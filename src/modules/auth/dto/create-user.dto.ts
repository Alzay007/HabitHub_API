import { IsEmail, IsNotEmpty, MinLength, Matches, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string = '';

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string = '';

  @IsString()
  @MinLength(6, { message: 'Confirm password must be at least 6 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, { message: 'Confirm password must contain at least one number and one uppercase letter' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string = '';
}
