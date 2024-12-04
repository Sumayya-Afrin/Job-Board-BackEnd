/* eslint-disable prettier/prettier */
import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import the JwtAuthGuard
import { UsersService } from './users.service';
import { UpdateUserDto } from './update-user.dto';
import { Validate } from 'class-validator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get a user's profile information by their user ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)  // Protect this route, so only authenticated users can access
  async getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }

  //get all users
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // Update a user's profile information
  @Put(':id')
  @UseGuards(JwtAuthGuard)  // Protect this route, so only authenticated users can access
  async updateUserProfile(@Param('id') id: string, @Body() updateUserdto: UpdateUserDto) {
    return this.usersService.updateUserProfile(id, updateUserdto);
  }
}
