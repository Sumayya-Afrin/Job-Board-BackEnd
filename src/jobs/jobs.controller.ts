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
  Query,
 
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

  @Get()
  async getAllJobs(
    @Query('location') location: string,          // Optional query parameter for location
    @Query('minSalary') minSalary: number,        // Optional query parameter for minSalary
    @Query('maxSalary') maxSalary: number,        // Optional query parameter for maxSalary
  ) {
    return this.jobsService.getFilteredJobs(location, minSalary, maxSalary);
  }

  // Route to update an existing job
  @Put(':id')
  @UseGuards(JwtAuthGuard) // Protect the route with authentication guard
  async updateJob(@Param('id') id: string, @Body() jobData, @Req() req: IRequest) {
    const user = req.user;

    // Fetch the job to ensure the user is the recruiter who posted it
    const job = await this.jobsService.findById(id);
    if (!job) {
      throw new ForbiddenException('Job not found');
    }

    // Check if the current user is the recruiter who posted the job
    if (job.postedBy !== user.email) {
      throw new ForbiddenException('You can only update or delete jobs you created');
    }

    return this.jobsService.updateJob(id, jobData);
  }


  //applications
  @Get(':id/applications')
  @UseGuards(JwtAuthGuard) 
  async getJobApplications(@Param('id') id: string, @Req() req: IRequest) {
    const user = req.user;  

    
    const job = await this.jobsService.findById(id);
    if (!job) {
      throw new ForbiddenException('Applications not found');
    }

    
    if (job.postedBy !== user.email) {
      throw new ForbiddenException('You can only view applications for jobs you posted');
    }

    
    const applications = await this.jobsService.getApplicationsForJob(id);
    return applications;
  }

  // Route to delete a job
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Protect the route with authentication guard
  async deleteJob(@Param('id') id: string, @Req() req: IRequest) {
    const user = req.user;

    // Fetch the job to ensure the user is the recruiter who posted it
    const job = await this.jobsService.findById(id);
    if (!job) {
      throw new ForbiddenException('Job not found');
    }

    // Check if the current user is the recruiter who posted the job
    if (job.postedBy !== user.email) {
      throw new ForbiddenException('You can only update or delete jobs you created');
    }

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
