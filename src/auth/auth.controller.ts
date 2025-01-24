import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // Este Guard aplica la local.stragegy.ts y
  //  ejecuta el metodo validate automaticamente regresando el req.user con su data
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
