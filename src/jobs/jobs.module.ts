/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { MongooseModule } from '@nestjs/mongoose';  // Import MongooseModule
import { Job, JobSchema } from './jobs.schema';  // Import your Job schema
import { Application, ApplicationSchema } from 'src/applications/applications.schema';
import { AuthModule } from '../auth/auth.module';  // Import AuthModule
import { forwardRef } from '@nestjs/common';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },  // Register Job model here
      { name: Application.name, schema: ApplicationSchema },  // If needed, register Application model
    ]), forwardRef(() => AuthModule), 
  ],
  providers: [JobsService],
  controllers: [JobsController],
  exports: [JobsService], 
})
export class JobsModule {}