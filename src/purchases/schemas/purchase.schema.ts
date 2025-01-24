import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export type PurchaseDocument = Purchase & Document;

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ required: true, ref: 'User' })
  student: mongoose.Schema.Types.ObjectId; // ID del estudiante que realizó la compra

  @Prop({ required: true, ref: 'Course' })
  course: mongoose.Schema.Types.ObjectId; // ID del curso comprado

  @Prop({ required: true })
  amount: number; // Monto pagado por el curso

  @Prop({ required: true })
  commission: number; // Comisión para el administrador
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
