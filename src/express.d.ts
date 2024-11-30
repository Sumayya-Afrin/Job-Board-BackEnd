/* eslint-disable prettier/prettier */
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string; // Or the appropriate type for the user ID, e.g., ObjectId if you're using MongoDB
        email: string;
        // Include any other user properties you need here
      };
    }
  }
}
