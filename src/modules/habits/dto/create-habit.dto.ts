import {IsString, Length} from 'class-validator';

export class CreateHabitDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @Length(1, 500)
  description!: string;

  @IsString()
  @Length(1, 100)
  frequency!: string;
}
