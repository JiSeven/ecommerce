import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import { env } from '../config/env';

export default fp(async function jwtPlugin(app: FastifyInstance) {
  await app.register(fastifyCookie);

  await app.register(fastifyJwt, {
    secret: env.JWT_ACCESS_SECRET,
    namespace: 'access',
    jwtVerify: 'accessVerify',
    jwtSign: 'accessSign',
    sign: {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  });

  await app.register(fastifyJwt, {
    secret: env.JWT_REFRESH_SECRET,
    namespace: 'refresh',
    jwtVerify: 'refreshVerify',
    jwtSign: 'refreshSign',
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
    sign: {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
  });
});
