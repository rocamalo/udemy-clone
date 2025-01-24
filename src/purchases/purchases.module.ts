import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Purchase, PurchaseSchema } from './schemas/purchase.schema';
import { CoursesModule } from '../courses/courses.module'; // Para verificar cursos
import { UsersModule } from '../users/users.module'; // Para verificar usuarios
import { SharedModule } from 'src/shared/shared.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Purchase.name, schema: PurchaseSchema }]),
    CoursesModule, // Importar para validar cursos
    UsersModule,   // Importar para validar estudiantes
    EnrollmentsModule,
    SharedModule
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
