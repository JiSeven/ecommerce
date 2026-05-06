import { FastifyInstance } from 'fastify';
import { LoginInput, RegisterInput } from './auth.schema';
import { prisma } from '@ecommerce/database';
import {
  AccountDisabledError,
  EmailTakenError,
  InvalidCredentialsError,
  TokenInvalidError,
} from './auth.errors';
import argon2 from 'argon2';
import { OAuthProvider } from '../../../../../packages/database/src/generated/enums';
import { AccessTokenPayload, RefreshTokenPayload } from '../../types/fastify';
import { User } from '../../../../../packages/database/src/generated/client';
import { OtpService } from './otp.service';

// argon2id options — OWASP recommended minimums
const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 64 * 1024, // 64 MB
  timeCost: 3, // iterations
  parallelism: 4,
};

export class AuthService {
  private readonly otpService: OtpService;

  constructor(private readonly app: FastifyInstance) {
    this.otpService = new OtpService(app.redis);
  }

  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new EmailTakenError();
    }

    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
    });

    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        accounts: {
          create: {
            provider: OAuthProvider.LOCAL,
            providerAccountId: input.email,
            passwordHash,
          },
        },
      },
    });

    this.otpService.sendVerificationOtp(user.id, user.email).catch((err) => {
      this.app.log.error(err, 'Failed to send verification OTP');
    });

    return user;
  }

  async logout(refreshToken: string) {
    await prisma.session.updateMany({
      where: {
        refreshToken,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async login(input: LoginInput, meta: { userAgent?: string; ipAddress?: string }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        accounts: {
          where: {
            provider: OAuthProvider.LOCAL,
          },
        },
      },
    });

    const account = user?.accounts[0];

    const dummyHash = await argon2.hash('dummy', ARGON2_OPTIONS);
    const isValid = await argon2.verify(account?.passwordHash ?? dummyHash, input.password);

    if (!user || !account || !isValid) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      throw new AccountDisabledError();
    }

    const [tokens] = await Promise.all([
      await this.createTokenPair(user, meta),
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      }),
    ]);

    return {
      tokens,
      user,
    };
  }

  private async createTokenPair(user: User, meta: { userAgent?: string; ipAddress?: string }) {
    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
    };

    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 30);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: 'pending',
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
        expiresAt: refreshExpiresAt,
      },
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.app.accessTokenSign(accessTokenPayload),
      this.app.refreshTokenSign({
        sub: user.id,
        sessionId: session.id,
      } satisfies RefreshTokenPayload),
    ]);

    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }
}
