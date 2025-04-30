import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Habit} from './habit.model';
import {CreateHabitDto} from './dto/create-habit.dto';
import {UpdateHabitDto} from './dto/update-habit.dto';

@Injectable()
export class HabitService {
  constructor(@InjectModel('Habit') private readonly habitModel: Model<Habit>) {}

  async createHabit(dto: CreateHabitDto): Promise<Habit> {
    try {
      const newHabit = new this.habitModel({
        ...dto,
        status: true,
        progress: 0,
      });
      return await newHabit.save();
    } catch {
      throw new BadRequestException('Failed to create habit. Please check the provided data.');
    }
  }

  async getAllHabits(): Promise<Habit[]> {
    try {
      return await this.habitModel.find();
    } catch {
      throw new InternalServerErrorException('Failed to retrieve habits.');
    }
  }

  async getHabitById(id: string): Promise<Habit> {
    const habit = await this.habitModel.findById(id);
    if (!habit) {
      throw new NotFoundException(`Habit with id ${id} not found.`);
    }
    return habit;
  }

  async updateHabit(id: string, dto: UpdateHabitDto): Promise<Habit> {
    const updatedHabit = await this.habitModel.findByIdAndUpdate(id, dto, {new: true});
    if (!updatedHabit) {
      throw new NotFoundException(`Failed to update habit with id ${id}.`);
    }
    return updatedHabit;
  }

  async deleteHabit(id: string): Promise<{message: string; habit: Habit}> {
    const deletedHabit = await this.habitModel.findByIdAndDelete(id);

    if (!deletedHabit) {
      throw new NotFoundException(`Failed to delete habit with id ${id}.`);
    }

    return {message: 'Habit successfully deleted', habit: deletedHabit};
  }

  async markHabitAsComplete(id: string): Promise<Habit> {
    const habit = await this.habitModel.findById(id);
    if (!habit) {
      throw new NotFoundException(`Habit with id ${id} not found.`);
    }

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
