/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string, role: string) {

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role,
    });
   
    try {
      await user.save();
      return this.generateToken(user); // Return the JWT after saving the user
    } catch (error) {
      throw new InternalServerErrorException('Error saving user');
    }
  }

 
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Proper error handling
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials'); // Proper error handling
    }

    return this.generateToken(user);
  }

  // Method for generating JWT token
  private generateToken(user: UserDocument) {
    const payload = { userId: user._id.toString(), email: user.email, role: user.role };  // Make sure userId is included
    return {
      access_token: this.jwtService.sign(payload, {
        secret: 'job-board-12345', // Use your actual secret here
       // expiresIn: '60m', // Optional: Token expiration time
      }),
    };
  }
  

}
