import { PrismaClient } from '@ecommerce/database';
import { JWT } from '@fastify/jwt';
import Redis from 'ioredis';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    redis: Redis;

    accessTokenSign: JWT['sign'];
    accessTokenVerify: JWT['verify'];

    refreshTokenSign: JWT['sign'];
    refreshTokenVerify: JWT['verify'];
  }
}

export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
}

export interface RefreshTokenPayload {
  sub: string; // user id
  sessionId: string;
}
