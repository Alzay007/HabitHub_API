import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request as ReqDecorator,
  Res,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import {Response, Request} from 'express';
import {AuthService} from './auth.service';
import {CreateUserDto} from './dto/create-user.dto';
import {LoginUserDto} from './dto/login-user.dto';
import {JwtAuthGuard} from './guards/jwt-auth.guard';

interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
    [key: string]: string | undefined;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res({passthrough: true}) res: Response) {
    const {accessToken, refreshToken} = await this.authService.register(createUserDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true, // включать только в проде с HTTPS
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {accessToken};
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res({passthrough: true}) res: Response) {
    const {accessToken, refreshToken} = await this.authService.login(loginUserDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {accessToken};
  }

  @Post('refresh')
  async refresh(@Req() req: RequestWithCookies, @Res({passthrough: true}) res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const {accessToken, refreshToken: newRefreshToken} =
      await this.authService.refreshTokens(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {accessToken};
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@ReqDecorator() req: {user: {sub: string; email: string}}) {
    return req.user;
  }
}
