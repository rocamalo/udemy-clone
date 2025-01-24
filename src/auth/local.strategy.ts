import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // Usar 'email' como username
  }

  async validate(email: string, password: string): Promise<AuthUserDTO> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return { 
      userId: user._id.toString(), 
      email: user.email, 
      role: user.role 
    }; // Devolver solo los datos necesarios
  }
}

export class AuthUserDTO {
  userId: string // O usar mongoose.Schema.Types.ObjectId si prefieres tener el tipo de Mongo
  email: string;
  role: string;
}

