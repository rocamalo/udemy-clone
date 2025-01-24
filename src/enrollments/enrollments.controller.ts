import { EnrollmentsService } from './enrollments.service';
import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentService: EnrollmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Post()
  async enrollStudent(@Body('courseId') courseId: string, @Body('studentId') studentId: string) {
    return this.enrollmentService.enrollStudent(courseId, studentId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Get('student/:studentId')
  async getCoursesByStudent(@Param('studentId') studentId: string) {
    return this.enrollmentService.getCoursesByStudent(studentId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  @Get('course/:courseId')
  async getStudentsByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentService.getStudentsByCourse(courseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('student')
  @Delete()
  async unenrollStudent(@Body('courseId') courseId: string, @Body('studentId') studentId: string) {
    return this.enrollmentService.unenrollStudent(courseId, studentId);
  }
}
