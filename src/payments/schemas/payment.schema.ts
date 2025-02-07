import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Purchase', required: true })
  purchase: Types.ObjectId;

  @Prop({ type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' })
  status: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  method: string; // Método de pago simulado (e.g., 'credit_card', 'paypal')
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
