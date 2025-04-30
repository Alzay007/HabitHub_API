import {Injectable} from '@nestjs/common';
import {HabitModel, Habit} from './habit.model';
import {CreateHabitDto} from './dto/create-habit.dto';
import {UpdateHabitDto} from './dto/update-habit.dto';

@Injectable()
export class HabitService {
  async createHabit(dto: CreateHabitDto): Promise<Habit> {
    const newHabit = new HabitModel({
      ...dto,
      status: true,
      progress: 0,
    });
    return await newHabit.save();
  }

  async getAllHabits(): Promise<Habit[]> {
    return await HabitModel.find();
  }

  async getHabitById(id: string): Promise<Habit | null> {
    return await HabitModel.findById(id);
  }

  async updateHabit(id: string, dto: UpdateHabitDto): Promise<Habit | null> {
    return await HabitModel.findByIdAndUpdate(id, dto, {new: true});
  }

  async deleteHabit(id: string): Promise<Habit | null> {
    return await HabitModel.findByIdAndDelete(id);
  }

  async markHabitAsComplete(id: string): Promise<Habit | null> {
    const habit = await HabitModel.findById(id);
    if (!habit) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyCompletedToday = habit.dates.some(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    if (!alreadyCompletedToday) {
      habit.dates.push(today);
      habit.progress += 1;

      habit.streak = this.calculateStreak(habit.dates);
    }

    return await habit.save();
  }

  private calculateStreak(dates: Date[]): number {
    const sorted = dates.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());

    let streak = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      const diff = (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else if (diff > 1) {
        break;
      }
    }
    return streak;
  }
}
