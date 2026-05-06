import { FastifyInstance } from 'fastify';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.schema';
import z from 'zod';

const verifyEmailSchema = z.object({
  code: z.string().length(6).regex(/^\d+$/, 'Code must be 6 digits'),
});

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

  app.post('/login', {
    schema: {
      body: z.toJSONSchema(loginSchema, { target: 'draft-7' }),
    },
    handler: controller.login.bind(controller),
  });

  // TODO: OTP handlers
}
