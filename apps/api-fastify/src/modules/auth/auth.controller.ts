import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './auth.schema';

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

  // TODO: OTP handlers

  async login(req: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    const { user, tokens } = await this.authService.login(req.body, {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    });

    // TODO: set refresh cookie

    return reply.send({
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }
}
