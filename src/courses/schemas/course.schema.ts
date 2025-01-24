import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, ref: 'User' })
  teacher: string; // ID del profesor que creó el curso

  @Prop({ default: [] })
  videos: string[]; // URLs o identificadores de los videos del curso
}

export const CourseSchema = SchemaFactory.createForClass(Course);
