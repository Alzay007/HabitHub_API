import {Schema, Document, model} from 'mongoose';

export interface Habit extends Document {
  name: string;
  description: string;
  status: boolean;
  progress: number;
  frequency: string;
  streak: number;
  dates: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<Habit>(
  {
    name: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: Boolean, default: true},
    progress: {type: Number, default: 0},
    frequency: {type: String, required: true},
    streak: {type: Number, default: 0},
    dates: {type: [Date], default: []},
  },
  {timestamps: true},
);

export const HabitModel = model<Habit>('Habit', habitSchema);
