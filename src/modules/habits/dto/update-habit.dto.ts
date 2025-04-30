import {IsBoolean, IsOptional, IsInt, Min} from 'class-validator';

export class UpdateHabitDto {
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  progress?: number;
}
