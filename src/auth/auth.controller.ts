/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/create-user.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   // Register a new user with validation
   @Post('register')
   async register(@Body(new ValidationPipe()) registerUserDto: RegisterUserDto) {
     const { name, email, password, role } = registerUserDto;
     return this.authService.register(name, email, password, role);
   }
 
   // Login a user with validation
   @Post('login')
   async login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
     const { email, password } = loginUserDto;
     return this.authService.login(email, password);
   }
 
}
