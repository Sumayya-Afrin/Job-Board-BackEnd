/* eslint-disable prettier/prettier */

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string; // Correctly name this field as `userId`
        email: string;
        // Include any other user properties you need here
      };
    }
  }
}
