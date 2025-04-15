import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { HabitService } from './habit.service';
import { Habit } from './habit.model';

@Controller('habits')
export class HabitController {
  constructor(private readonly habitService: HabitService) { }

  @Post()
  async create(@Body('name') name: string, @Body('description') description: string): Promise<Habit> {
    return this.habitService.createHabit(name, description);
  }

  @Get()
  async findAll(): Promise<Habit[]> {
    return this.habitService.getAllHabits();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('status') status: boolean,
    @Body('progress') progress: number,
  ): Promise<Habit | null> {
    return this.habitService.updateHabit(id, status, progress);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Habit | null> {
    return this.habitService.deleteHabit(id);
  }
}
