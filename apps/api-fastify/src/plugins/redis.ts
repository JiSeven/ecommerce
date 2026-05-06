import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { redis } from '../lib/redis';

export default fp(async function redisPlugin(app: FastifyInstance) {
  await redis.connect();

  app.decorate('redis', redis);

  app.addHook('onClose', async () => {
    await redis.quit();
  });
});
