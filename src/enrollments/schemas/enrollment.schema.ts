import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EnrollmentDocument = Enrollment & Document;

@Schema()
export class Enrollment {
  @Prop({ required: true, ref: 'User' })
  student: string; // ID del estudiante

  @Prop({ required: true, ref: 'Course' })
  course: string; // ID del curso

  @Prop({ default: Date.now })
  enrolledAt: Date; // Fecha de inscripción

  @Prop({ default: 0 })
  progress: number; // Porcentaje de progreso en el curso
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
