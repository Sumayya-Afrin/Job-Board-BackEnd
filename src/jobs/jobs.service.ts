/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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


    // Find job by ID
    async findById(id: string): Promise<Job | null> {
      return this.jobModel.findById(id).exec(); // Returns the job document with postedBy
    }

  // Create a new job posting
  async createJob(jobData: any) {
    console.log('posting jobs');
    const job = new this.jobModel(jobData);
    await job.save();
    return job;
  }

  

  // Update an existing job posting
  async updateJob(id: string, jobData: any): Promise<Job> {
    return this.jobModel.findByIdAndUpdate(id, jobData, { new: true }).exec();
  }

  // Delete a job posting
  async deleteJob(id: string): Promise<any> {
    return this.jobModel.findByIdAndDelete(id).exec();
  }

  // Apply for a job
    // Check if user has already applied for the job
    async findApplicationByJobAndUser(jobId: string, userId: string): Promise<Application | null> {
        return this.applicationModel.findOne({ jobId, userId });
      }
    
      // Apply for a job
      async applyForJob(userId: string, jobId: string, coverLetter: string): Promise<Application> {

         // Optionally, you can check if the user has already applied for the job before creating a new application
  const existingApplication = await this.applicationModel.findOne({ jobId, userId });
  if (existingApplication) {
    throw new ConflictException('You have already applied for this job');
  }

        const application = new this.applicationModel({

        
        
          jobId,
          userId,
          coverLetter,
          status: 'applied',
        });

        console.log('applied');
    
        return application.save();
      }
}
