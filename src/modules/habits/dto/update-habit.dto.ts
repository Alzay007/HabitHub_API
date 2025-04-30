import {IsBoolean, IsOptional, IsInt, Min} from 'class-validator';
import {PartialType} from '@nestjs/mapped-types';
import {CreateHabitDto} from './create-habit.dto';

export class UpdateHabitDto extends PartialType(CreateHabitDto) {
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  progress?: number;
}
