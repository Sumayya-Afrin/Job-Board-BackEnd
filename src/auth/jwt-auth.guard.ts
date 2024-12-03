/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Bearer token
    console.log(request);
    console.log(token);

    if (!token) {
      console.log('No token found');
      throw new ForbiddenException('Authorization token is missing'); // No token found, reject the request
    }

    try {
      
      const user = this.jwtService.verify(token, { secret: 'job-board-12345' });
      request.user = user; // Attach the decoded user info to the request
      console.log('Decoded user:', request.user);

      
    
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
      console.log('Rejecting the request due to invalid token or role');
      return false; // Invalid token, reject the request
    }
  }
}
