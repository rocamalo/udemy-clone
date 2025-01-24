import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Post()
  async createCourse(@Body() courseData: any) {
    return this.coursesService.createCourse(courseData);
  }

  @Get()
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.getCourseById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() courseData: any) {
    return this.coursesService.updateCourse(id, courseData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }

  /**
   * Listar cursos en los que un estudiante no está inscrito.
   */
  @UseGuards(JwtAuthGuard)
  @Roles('student')
  @Get('not-enrolled')
  async getCoursesNotEnrolledByStudent(@Request() req: any) {
    const studentId = req.user.userId;
    return this.coursesService.getCoursesNotEnrolledByStudent(studentId);
  }

  /**
   * Listar cursos creados por un teacher autenticado.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Get('by-teacher')
  async getCoursesByTeacher(@Request() req: any) {
    const teacherId = req.user.userId;
    return this.coursesService.getCoursesByTeacher(teacherId);
  }

    /**
   * Listar estudiantes inscritos en un curso específico.
   */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('teacher')
    @Get(':id/students')
    async getStudentsByCourse(@Param('id') courseId: string, @Request() req: any) {
      const teacherId = req.user.userId;
      return this.coursesService.getStudentsByCourse(courseId, teacherId);
    }
  
}
