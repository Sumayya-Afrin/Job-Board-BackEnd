/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private jobsService: JobsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Bearer token
    console.log('Authorization Header:', request.headers.authorization);
    console.log('Extracted Token:', token);

    if (!token) {
      console.log('No token found');
      throw new ForbiddenException('Authorization token is missing'); // No token found, reject the request
    }

    try {
      // Validate token
      const user = this.jwtService.verify(token, { secret: 'job-board-12345' });
      request.user = user; // Attach the decoded user info to the request
      console.log('Decoded user:', request.user);

      // Check for /jobs/:id for PUT or DELETE actions
      if (request.url.includes('/jobs') && (request.method === 'PUT' || request.method === 'DELETE')) {
        const jobId = request.params.id; // Get job ID from the URL parameter
        const job = await this.jobsService.findById(jobId);
        if (!job) {
          throw new ForbiddenException('Job not found');
        }
        if (job.postedBy !== user.email) {
          throw new ForbiddenException('You can only update or delete jobs you created');
        }
      }

      // Check for /jobs POST actions
      if (request.url.includes('/jobs') && request.method === 'POST') {
        if (request.url.includes('/apply')) {  // Apply for a job
          if (user.role !== 'seeker') {
            throw new ForbiddenException('Only seekers can apply for jobs.');
          }
        } else {  // Post a job
          if (user.role !== 'recruiter') {
            throw new ForbiddenException('Only recruiters can post jobs.');
          }
        }
      }

      return true;
    } catch (error) {
      console.log('Rejecting the request due to error:', error.message);
      throw new ForbiddenException('Invalid token or role'); // Invalid token, reject the request
    }
  }
}
