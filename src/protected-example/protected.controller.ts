import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Asegúrate de ajustar la ruta si tu estructura es diferente
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

//controlador de prueba de rutas protegidas
@Controller('protected')
export class ProtectedController {

  @Get()
  @UseGuards(JwtAuthGuard) // Este guardia asegura que el endpoint requiera un token válido
  getProtectedData() {
    return {
      message: '¡Accediste a un endpoint protegido!',
      data: {
        secretInfo: 'Esta es información confidencial.',
      },
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Solo los administradores pueden acceder
  getAdminData() {
    return { message: '¡Accediste a datos de administrador!' };
  }

  @Get('teacher')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin') // Solo los profesores pueden acceder
  getTeacherData() {
    return { message: '¡Accediste a datos de profesor!' };
  }

  @Get('student')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student', 'admin') // Solo los estudiantes pueden acceder
  getStudentData() {
    return { message: '¡Accediste a datos de estudiante!' };
  }
}
