import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';

import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserSchema} from './schemas/auth.schema';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtStrategy} from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {expiresIn: '1d'},
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
