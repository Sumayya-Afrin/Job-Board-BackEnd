/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './jobs.schema';
import {
  Application,
  ApplicationDocument,
} from '../applications/applications.schema';
//import { User } from '../users/users.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  // Get all jobs
  async getAllJobs() {
    return this.jobModel.find().exec();
  }

  // Create a new job posting
  async createJob(jobData: any) {
    const job = new this.jobModel(jobData);
    await job.save();
    return job;
  }

  // Update an existing job posting
  async updateJob(id: string, jobData: any) {
    const job = await this.jobModel.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    job.title = jobData.title || job.title;
    job.description = jobData.description || job.description;
    job.location = jobData.location || job.location;
    job.salary = jobData.salary || job.salary;
    job.updatedAt = new Date();
    await job.save();
    return job;
  }

  // Delete a job posting
  async deleteJob(id: string): Promise<any> {
    const job = await this.jobModel.findById(id);
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Use deleteOne or delete() instead of remove
    await job.deleteOne();  // or job.delete() as alternative
    
    return { message: 'Job deleted successfully' };
  }
  // Apply for a job
    // Check if user has already applied for the job
    async findApplicationByJobAndUser(jobId: string, userId: string): Promise<Application | null> {
        return this.applicationModel.findOne({ jobId, userId });
      }
    
      // Apply for a job
      async applyForJob(userId: string, jobId: string, coverLetter: string): Promise<Application> {
        const application = new this.applicationModel({
          jobId,
          userId,
          coverLetter,
          status: 'applied',
        });
    
        return application.save();
      }
}
