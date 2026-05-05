import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { RegisterInput } from './auth.schema';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: FastifyRequest<{ Body: RegisterInput }>, reply: FastifyReply) {
    const user = await this.authService.register(req.body);

    return reply.code(201).send({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }
}
