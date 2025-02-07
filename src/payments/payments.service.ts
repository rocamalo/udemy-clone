import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment>) {}

  // Simular la creación de un PaymentIntent
  async createPaymentIntent(amount: number, currency: string, purchaseId: string) {
    const clientSecret = `fake_client_secret_${Date.now()}`; // Generar un client_secret simulado

    // Guardar el pago en la base de datos
    const payment = new this.paymentModel({
      purchase: purchaseId,
      amount,
      currency,
      method: 'simulated-stripe',
      status: 'pending',
      clientSecret, // Almacenar el client_secret simulado
    });
    await payment.save();

    return { clientSecret, paymentId: payment._id }; // Retornar la información simulada
  }

  // Simular la confirmación de un pago
  async confirmPayment(clientSecret: string) {
    const payment = await this.paymentModel.findOne({ clientSecret });
    if (!payment) {
      throw new Error('Invalid client secret');
    }

    // Actualizar el estado del pago
    payment.status = 'completed';
    await payment.save();

    return payment;
  }

  async findPaymentById(paymentId: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('El pago no existe');
    }
    return payment;
  }
}
