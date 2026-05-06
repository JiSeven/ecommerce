import fastify, { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';

import { env } from './config/env';
import fastifyCors from '@fastify/cors';
import prismaPlugin from './plugins/prisma';
import redisPlugin from './plugins/redis';
import jwtPlugin from './plugins/jwt';
import errorHandler from './plugins/error-handler';
import { authRoutes } from './modules/auth/auth.routes';

export async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      level: env.NODE_ENV === 'production' ? 'warn' : 'info',
      transport: env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
    },
  });

  await app.register(helmet);

  await app.register(fastifyCors, {
    origin: env.CLIENT_URL,
    credentials: true,
  });

  await app.register(prismaPlugin);
  await app.register(jwtPlugin);
  await app.register(redisPlugin);

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  await app.register(errorHandler);
  await app.register(authRoutes, { prefix: '/auth' });

  return app;
}
