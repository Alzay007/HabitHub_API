import {Injectable, HttpException, HttpStatus} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {JwtService} from '@nestjs/jwt';
import {CreateUserDto} from './dto/create-user.dto';
import {LoginUserDto} from './dto/login-user.dto';
import {User} from './schemas/auth.schema';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getTokens(
    userId: string,
    email: string,
  ): Promise<{accessToken: string; refreshToken: string}> {
    const payload = {sub: userId, email};

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<{accessToken: string; refreshToken: string}> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return this.getTokens(payload.sub, payload.email);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{accessToken: string; refreshToken: string}> {
    const {firstName, lastName, email, password} = createUserDto;
    const existingUser = await this.userModel.findOne({email});
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({firstName, lastName, email, password: hashedPassword});
    const user = await newUser.save();

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return this.getTokens(user._id.toString(), user.email);
  }

  async login(loginUserDto: LoginUserDto): Promise<{accessToken: string; refreshToken: string}> {
    const {email, password} = loginUserDto;
    const user = await this.userModel.findOne({email});

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return this.getTokens(user._id.toString(), user.email);
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }
}
