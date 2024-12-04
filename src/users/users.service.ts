/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Find a user by their ID
  async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Update user profile (name, email, role, etc.)
  async updateUserProfile(id: string, updateUserDto: any): Promise<UserDocument> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user's profile data
    user.name = updateUserDto.name || user.name;
    user.email = updateUserDto.email || user.email;
    user.role = updateUserDto.role || user.role;

    // Save updated user data
    await user.save();
    return user;
  }

  // Retrieve the user profile based on ID
  async getUserProfile(id: string): Promise<UserDocument> {
    const user = await this.findUserById(id);
    return user; // Returning user data without password
  }

   // New method to get all users
   async getAllUsers() {
    return this.userModel.find().exec(); // This fetches all users from the database
  }
}
