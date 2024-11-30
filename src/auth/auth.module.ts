/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
// import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';  // Import UsersModule
// import { User, UserSchema } from '../users/users.schema'; 
// import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',  // Replace with your actual secret
      signOptions: { expiresIn: '60s' },  // Token expiry time
    }),
    UsersModule, // If you need the users module for finding users, etc.
  ],
  providers: [AuthService, JwtStrategy , JwtService, JwtAuthGuard],
   // Export JwtService so it can be used in other modules
   exports: [JwtService, JwtAuthGuard],
})
export class AuthModule {}