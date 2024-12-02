/* eslint-disable prettier/prettier */
import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import the JwtAuthGuard
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get a user's profile information by their user ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)  // Protect this route, so only authenticated users can access
  async getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }

  // Update a user's profile information
  @Put(':id')
  @UseGuards(JwtAuthGuard)  // Protect this route, so only authenticated users can access
  async updateUserProfile(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.updateUserProfile(id, updateUserDto);
  }
}
