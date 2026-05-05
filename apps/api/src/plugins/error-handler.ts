import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

import { DomainError } from '../errors';

export default fp(async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof DomainError) {
      return reply.code(error.statusCode).send({
        error: error.message,
        code: error.code,
      });
    }

    app.log.error(error);
    return reply.code(500).send({ error: 'Internal server error' });
  });
});
