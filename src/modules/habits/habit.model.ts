import { Schema, Document, model } from 'mongoose';

// Інтерфейс для звички
export interface Habit extends Document {
  name: string;
  description: string;
  status: boolean;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// Схема для звички
const habitSchema = new Schema<Habit>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, default: true },
  progress: { type: Number, default: 0 },
}, { timestamps: true });

// Модель для звички
export const HabitModel = model<Habit>('Habit', habitSchema);
