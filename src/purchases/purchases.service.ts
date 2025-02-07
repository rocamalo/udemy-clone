import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase, PurchaseDocument } from './schemas/purchase.schema';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class PurchasesService {
  private readonly adminCommissionRate = 0.2; // 20% de comisión para el admin

  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    private readonly coursesService: CoursesService,
    private readonly enrollmentsService: EnrollmentsService,
    private paymentsService: PaymentsService, // Inyección del servicio de pagos
  ) {}

  async createPurchase(studentId: string, courseId: string, paymentId: string): Promise<Purchase> {
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
  
    // Validar el estado del pago
    const payment = await this.paymentsService.findPaymentById(paymentId);
    if (!payment || payment.status !== 'completed') {
      throw new BadRequestException('El pago no ha sido completado');
    }
  
    // Validar que el monto pagado sea igual al precio del curso
    const amount = payment.amount;
    if (amount !== course.price) {
      throw new BadRequestException('El monto del pago no coincide con el precio del curso');
    }
  
    // Calcular la comisión
    const commission = amount * this.adminCommissionRate;
  
    // Registrar la compra
    const purchase = new this.purchaseModel({
      student: studentId,
      course: courseId,
      amount,
      commission,
      paymentId, // Asociar el pago con la compra
      status: 'active',
      createdAt: new Date(),
    });
    const savedPurchase = await purchase.save();
  
    // Inscribir al estudiante automáticamente al curso
    await this.enrollmentsService.enrollStudent(studentId, courseId);
  
    return savedPurchase;
  }
  

  // async createPurchase(studentId: string, courseId: string, paymentId: string): Promise<Purchase> {
  //   // Verificar si el curso existe
  //   const course = await this.coursesService.getCourseById(courseId);
  //   if (!course) {
  //     throw new NotFoundException('Curso no encontrado');
  //   }

  //   // Verificar que el estudiante no haya comprado el curso previamente
  //   const existingPurchase = await this.purchaseModel.findOne({ student: studentId, course: courseId });
  //   if (existingPurchase) {
  //     throw new ForbiddenException('Ya has comprado este curso');
  //   }

  //   // Calcular montos
  //   const amount = course.price; // Precio del curso
  //   const commission = amount * this.adminCommissionRate;

  //   // // Validar el estado del pago
  //   // const payment = await this.paymentsService.findPaymentById(paymentId);
  //   // if (!payment || payment.status !== 'completed') {
  //   //   throw new BadRequestException('El pago no ha sido completado');
  //   // }

  //   // Registrar la compra 
  //   const purchase = new this.purchaseModel({
  //     student: studentId,
  //     course: courseId,
  //     amount,
  //     commission,
  //     status: 'active',
  //     createdAt: new Date(),// paymentId, // Asociar el pago con la compra en el futuro
  //   });
  //   const savedPurchase = await purchase.save();

  //   // Inscribir al estudiante automáticamente al curso
  //   await this.enrollmentsService.enrollStudent(studentId, courseId);

  //   return savedPurchase;
  // }

  async cancelPurchase(studentId: string, purchaseId: string): Promise<Purchase> {
    const purchase = await this.purchaseModel.findOne({ _id: purchaseId, student: studentId });

    if (!purchase) {
      throw new NotFoundException('Compra no encontrada');
    }

    if (purchase.status === 'cancelled') {
      throw new BadRequestException('La compra ya está cancelada');
    }

    // Ejemplo de política: no cancelar si han pasado más de 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    if (purchase.createdAt < sevenDaysAgo) {
      throw new BadRequestException('No puedes cancelar la compra después de 7 días');
    }

    // Actualizar el estado a cancelado
    purchase.status = 'cancelled'; 
    await purchase.save();
    // Desuscribir al estudiante automáticamente del curso
    await this.enrollmentsService.unenrollStudent( purchase.course.toString(),studentId );

    return purchase;
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

  async getPurchaseStatistics(): Promise<any[]> { //Modificar para no incluir compras canceladas
    return this.purchaseModel.aggregate([
      {
        $group: {
          _id: '$course', // Agrupar por curso
          totalPurchases: { $sum: 1 }, // Contar compras
          totalRevenue: { $sum: '$amount' }, // Sumar ingresos (si hay un campo 'amount')
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'courseDetails',
        },
      },
      {
        $unwind: '$courseDetails', // Desenrollar los detalles del curso
      },
      {
        $project: {
          courseTitle: '$courseDetails.title',
          totalPurchases: 1,
          totalRevenue: 1,
        },
      },
    ]);
  }
  
}
