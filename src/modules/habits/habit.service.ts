import { Injectable } from '@nestjs/common';
import { HabitModel, Habit } from './habit.model';

@Injectable()
export class HabitService {
  async createHabit(name: string, description: string): Promise<Habit> {
    const newHabit = new HabitModel({
      name,
      description,
      status: true,
      progress: 0,
    });

    return await newHabit.save();
  }

  async getAllHabits(): Promise<Habit[]> {
    return await HabitModel.find();
  }

  async updateHabit(id: string, status: boolean, progress: number): Promise<Habit | null> {
    return await HabitModel.findByIdAndUpdate(
      id,
      { status, progress },
      { new: true },
    );
  }

  async deleteHabit(id: string): Promise<Habit | null> {
    return await HabitModel.findByIdAndDelete(id);
  }
}
