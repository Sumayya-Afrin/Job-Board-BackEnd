/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';  // Import UsersModule
import { User, UserSchema } from '../users/users.schema'; 
import { AuthController } from './auth.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),  // Register the User schema with Mongoose
    JwtModule.register({
      secret: 'your_jwt_secret', // use a secret for JWT signing
      signOptions: { expiresIn: '60m' }, // Token expiry duration
    }),
    UsersModule,  // Import the UsersModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
 
})
export class AuthModule {}
