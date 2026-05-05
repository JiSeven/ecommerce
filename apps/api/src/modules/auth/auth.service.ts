import { FastifyInstance } from 'fastify';
import { LoginInput, RegisterInput } from './auth.schema';
import { prisma } from '@ecommerce/database';
import {
  AccountDisabledError,
  EmailTakenError,
  InvalidCredentialsError,
  TokenInvalidError,
} from '../../errors';
import argon2 from 'argon2';
import { OAuthProvider } from '../../../../../packages/database/src/generated/enums';
import { RefreshTokenPayload } from '../../types/fastify';

// argon2id options — OWASP recommended minimums
const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 64 * 1024, // 64 MB
  timeCost: 3, // iterations
  parallelism: 4,
};

export class AuthService {
  constructor(private readonly app: FastifyInstance) {}

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

    return prisma.user.create({
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
  }
}
