import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // Usuario válido
    }
    return null; // Credenciales inválidas
  }

  async login(user: UserDto): Promise<{ access_token: string }> {
    const payload = {    
      sub: user.userId,
      email: user.email,
      role: user.role
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

export interface UserDto {
  userId: string; // ID como cadena
  email: string;
  role: string;
}
