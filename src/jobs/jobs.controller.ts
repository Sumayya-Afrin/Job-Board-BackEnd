/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Get,
  ForbiddenException,
 
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming JwtAuthGuard is implemented for authentication
import { Request } from 'express';
//import { UserSchema } from 'src/users/users.schema';
import { IRequest } from 'src/request.interface';


@Controller('jobs') // Ensure this is defined
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // Route to create a new job
  @Post()
  @UseGuards(JwtAuthGuard) // Protect the route with authentication guard
  async createJob(@Body() jobData, @Req() req: IRequest) {
    const user = req.user;
    console.log(user);

    // Check if the user has the 'recruiter' role
    if (user.role !== 'recruiter') {
      throw new ForbiddenException('Only recruiters can post jobs.');
    }
    return this.jobsService.createJob(jobData);
  }

  @Get() // This handles GET requests to /jobs
  async getAllJobs() {
    return this.jobsService.getAllJobs(); // Calls the getAllJobs method in the JobsService
  }

  // Route to update an existing job
  @Put(':id')
  @UseGuards(JwtAuthGuard) // Protect the route with authentication guard
  async updateJob(@Param('id') id: string, @Body() jobData) {
    return this.jobsService.updateJob(id, jobData);
  }

  // Route to delete a job
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Protect the route with authentication guard
  async deleteJob(@Param('id') id: string) {
    return this.jobsService.deleteJob(id);
  }

  // Route for a job seeker to apply for a job
  @Post(':id/apply')
  @UseGuards(JwtAuthGuard) // Protect the route with authentication guard
  async applyForJob(
    @Param('id') jobId: string,
    @Body() applicationData,
    @Req() req:IRequest ,
  ) {

    //const user = req.user; // The user is attached to the request by the JwtAuthGuard

 

    const userId = req.user.userId; // Extract userId from the JWT token (assumed to be set during authentication)
    const coverLetter = applicationData.coverLetter; // Extract cover letter from the request body
  


    if (req.user.role !== 'seeker') {
      throw new ForbiddenException('Only seekers can apply for jobs.');
    }

    // Call the service to apply for the job
    return this.jobsService.applyForJob(userId, jobId, coverLetter);
  }
}
