/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract the JWT from the Authorization header
      ignoreExpiration: false, // Don't allow expired tokens
      secretOrKey: 'your_jwt_secret', // The secret used to verify the JWT
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; // Attach user info to the request
  }
}
