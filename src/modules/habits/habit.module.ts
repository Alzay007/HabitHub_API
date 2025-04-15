import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';
import { HabitModel } from './habit.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Habit', schema: HabitModel.schema }])],
  controllers: [HabitController],
  providers: [HabitService],
})
export class HabitModule { }
