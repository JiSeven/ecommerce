import { FastifyInstance } from 'fastify';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { registerSchema } from './auth.schema';
import z from 'zod';

export async function authRoutes(app: FastifyInstance) {
  const service = new AuthService(app);
  const controller = new AuthController(service);

  app.post('/register', {
    schema: {
      body: z.toJSONSchema(registerSchema, { target: 'draft-7' }),
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
    handler: controller.register.bind(controller),
  });
}
