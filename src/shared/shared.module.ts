import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

//importa este modulo en cualquier modulo donde quieras hacer uso del jwt y los guards
@Global() // Hace que este módulo esté disponible globalmente
@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey', // Usa una clave más segura
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [JwtModule], // Exporta JwtModule para que otros módulos puedan usarlo
})
export class SharedModule {}
