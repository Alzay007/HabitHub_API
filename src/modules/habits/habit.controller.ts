import {Controller, Get, Post, Body, Param, Delete, Put, UseGuards} from '@nestjs/common';
import {HabitService} from './habit.service';
import {Habit} from './habit.model';
import {CreateHabitDto} from './dto/create-habit.dto';
import {UpdateHabitDto} from './dto/update-habit.dto';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('habits')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  async create(@Body() createHabitDto: CreateHabitDto): Promise<Habit> {
    return this.habitService.createHabit(createHabitDto);
  }

  @Get()
  async findAll(): Promise<Habit[]> {
    return this.habitService.getAllHabits();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Habit | null> {
    return this.habitService.getHabitById(id);
  }

  @Post(':id/complete')
  async markComplete(@Param('id') id: string): Promise<Habit | null> {
    return this.habitService.markHabitAsComplete(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ): Promise<Habit | null> {
    return this.habitService.updateHabit(id, updateHabitDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{message: string; habit: Habit}> {
    return this.habitService.deleteHabit(id);
  }
}
