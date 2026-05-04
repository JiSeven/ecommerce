import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { prisma } from '@ecommerce/database';

export default fp(async function prismaPlugin(app: FastifyInstance) {
  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});
