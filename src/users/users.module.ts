import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from 'src/shared/shared.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }],),
    SharedModule,
    PassportModule, // Asegura que las estrategias de Passport estén disponibles
  ],
  controllers: [UsersController],
  providers: [UsersService,
    {
          provide: APP_GUARD, //basicos si se quieren usar los guards
          useClass: RolesGuard,
        },
  ],
  exports: [UsersService], // Exportamos el servicio para que pueda ser usado en otros módulos
})
export class UsersModule {}
