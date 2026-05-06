import { prisma } from '@ecommerce/database';
import Redis from 'ioredis';
import crypto from 'node:crypto';
import { EmailAlreadyVerifiedError, InvalidOtpError, OtpRateLimitError } from './auth.errors';
import { sendVerificationEmail } from '../../lib/email';

const OTP_EXPIRY_SECONDS = 60 * 15; // 15 minutes
const RESEND_COOLDOWN_SECONDS = 60;

const keys = {
  otp: (userId: string) => `otp:email_verification:${userId}`,
  cooldown: (userId: string) => `otp:resend_cooldown:${userId}`,
} as const;

export class OtpService {
  constructor(private readonly redis: Redis) {}

  async sendVerificationOtp(userId: string, email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.emailVerified) {
      throw new EmailAlreadyVerifiedError();
    }

    const cooldown = await this.redis.get(keys.cooldown(userId));

    if (cooldown) {
      throw new OtpRateLimitError();
    }

    const code = crypto.randomInt(100_000, 999_999).toString();

    const tokenHash = crypto.createHash('sha256').update(code).digest('hex');

    await this.redis.set(keys.otp(userId), tokenHash, 'EX', OTP_EXPIRY_SECONDS);

    await this.redis.set(keys.cooldown(userId), '1', 'EX', RESEND_COOLDOWN_SECONDS);

    await sendVerificationEmail(email, code);
  }

  async verifyEmailOtp(userId: string, code: string) {
    const storedHash = await this.redis.get(keys.otp(userId));

    if (!storedHash) {
      throw new InvalidOtpError();
    }

    const incomingHash = crypto.createHash('sha256').update(code).digest('hex');

    // Timing-safe compare — prevents timing attacks on the hash comparison
    const isValid = crypto.timingSafeEqual(Buffer.from(incomingHash), Buffer.from(storedHash));

    if (!isValid) {
      throw new InvalidOtpError();
    }

    await this.redis.del(keys.otp(userId));

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }
}
