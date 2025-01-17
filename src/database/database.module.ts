import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
      MongooseModule.forRoot('mongodb+srv://rocamalo:Rodclazpri137@clustercursos.1mbav.mongodb.net/'),
    ],
    exports: [MongooseModule], // Exportamos el módulo para que esté disponible en otros módulos
  })
  export class DatabaseModule {}