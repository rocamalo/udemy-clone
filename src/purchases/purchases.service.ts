import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase, PurchaseDocument } from './schemas/purchase.schema';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';

@Injectable()
export class PurchasesService {
  private readonly adminCommissionRate = 0.2; // 20% de comisión para el admin

  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    private readonly coursesService: CoursesService,
    private readonly enrollmentsService: EnrollmentsService
  ) {}

  async createPurchase(studentId: string, courseId: string): Promise<Purchase> {
    // Verificar si el curso existe
    const course = await this.coursesService.getCourseById(courseId);
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    // Verificar que el estudiante no haya comprado el curso previamente
    const existingPurchase = await this.purchaseModel.findOne({ student: studentId, course: courseId });
    if (existingPurchase) {
      throw new ForbiddenException('Ya has comprado este curso');
    }

    // Calcular montos
    const amount = course.price; // Precio del curso
    const commission = amount * this.adminCommissionRate;

    // Registrar la compra
    const purchase = new this.purchaseModel({
      student: studentId,
      course: courseId,
      amount,
      commission,
    });
    const savedPurchase = await purchase.save();

    // Inscribir al estudiante automáticamente al curso
    await this.enrollmentsService.enrollStudent(studentId, courseId);

    return savedPurchase;
  }

  async getPurchasesByStudent(studentId: string): Promise<Purchase[]> {
    return this.purchaseModel.find({ student: studentId }).populate('course').exec();
  }

  async getPurchasesByCourse(courseId: string): Promise<Purchase[]> {
    return this.purchaseModel.find({ course: courseId }).populate('student').exec();
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return this.purchaseModel.find().populate('student course').exec();
  }
}
