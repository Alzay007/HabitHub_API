import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitModule } from './modules/habits/habit.module';
import * as dotenv from 'dotenv';
import { AuthModule } from '@modules/auth/auth.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    HabitModule,
    AuthModule,
  ],
})
export class AppModule { }
