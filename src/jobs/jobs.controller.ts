/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs') // Ensure this is defined
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()  // POST method for creating a job
  async createJob(@Body() jobData) {
    return this.jobsService.createJob(jobData);
  }
}
