/* eslint-disable prettier/prettier */
import { Request } from 'express';

// Extending the Request interface to include `user` property
export interface IRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}
