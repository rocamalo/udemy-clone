import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { Enrollment, EnrollmentDocument } from 'src/enrollments/schemas/enrollment.schema';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  @InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>,) {}

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const newCourse = new this.courseModel(courseData);
    return newCourse.save();
  }

  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async getCourseById(courseId: string): Promise<Course | null> {
    return this.courseModel.findById(courseId).exec();
  }

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course | null> {
    return this.courseModel.findByIdAndUpdate(courseId, courseData, { new: true }).exec();
  }

  async deleteCourse(courseId: string): Promise<Course | null> {
    return this.courseModel.findByIdAndDelete(courseId).exec();
  }

  /**
   * Obtener cursos en los que un estudiante no está inscrito.
   */
  async getCoursesNotEnrolledByStudent(studentId: string): Promise<Course[]> {
    return this.courseModel.find({ enrolledStudents: { $ne: studentId } }).exec();
  }

  /**
   * Obtener cursos creados por un teacher específico.
   */
  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    return this.courseModel.find({ teacher: teacherId }).exec();
  }

  async getStudentsByCourse(courseId: string, teacherId: string): Promise<any[]> {
    // Verificar que el curso pertenece al maestro autenticado.
    const course = await this.courseModel.findById(courseId).exec();
    if (!course || course.teacher !== teacherId) {
      throw new Error('No autorizado para acceder a los estudiantes de este curso.');
    }
  
    // Consultar las inscripciones asociadas al curso y devolver información de los estudiantes.
    return this.enrollmentModel.find({ course: courseId }).populate('student').exec();
  }
  
}
