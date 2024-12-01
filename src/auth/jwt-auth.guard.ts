/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // This method will determine whether the current request can proceed based on the JWT
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
      console.log('No token found');
      return false; // No token found, reject the request
    }

    try {
      // Verify and decode the JWT
      const user = this.jwtService.verify(token , { secret: 'job-board-12345' });
      request.user = user; // Attach the decoded user info to the request
      console.log('Decoded user:', request.user);
     // console.log('User ID:', userId);

      return true;
    } catch (error) {
      return false; // Invalid token, reject the request
    }
  }
}
