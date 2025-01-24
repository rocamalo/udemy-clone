import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async enrollStudent(studentId: string, courseId: string): Promise<Enrollment> {
     // Verificar si el estudiante ya está inscrito
  const existingEnrollment = await this.enrollmentModel.findOne({ student: studentId, course: courseId });
  if (existingEnrollment) {
    return existingEnrollment; // Si ya está inscrito, no hacer nada
  }

  // Crear la inscripción
  const enrollment = new this.enrollmentModel({
    student: studentId,
    course: courseId,
  });
  return enrollment.save();
  }
//servicio generico para traer todos los estudiantes de un curso sin importar el teacher
  async getStudentsByCourse(courseId: string): Promise<Enrollment[]> {
    return this.enrollmentModel.find({ course: courseId }).populate('student').exec();
  }

  async getCoursesByStudent(studentId: string): Promise<Enrollment[]> {
    return this.enrollmentModel.find({ student: studentId }).populate('course').exec();
  }

  async unenrollStudent(courseId: string, studentId: string): Promise<Enrollment | null> {
    return this.enrollmentModel.findOneAndDelete({ course: courseId, student: studentId }).exec();
  }
}
