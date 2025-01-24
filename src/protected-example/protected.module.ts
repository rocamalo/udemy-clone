import { Module } from '@nestjs/common';
import { ProtectedController } from './protected.controller';
import { RolesGuard } from '../auth/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [ SharedModule], // Importa el SharedModule que exporta JwtModule para tener acceso aqui
  controllers: [ProtectedController],
  providers: [
    {
      provide: APP_GUARD, //basicos si se quieren usar los guards
      useClass: RolesGuard,
    },
  ],
})
export class ProtectedModule {}
