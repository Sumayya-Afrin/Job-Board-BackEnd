/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private otpStore = new Map<string, { otp: string; expires: Date }>();

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

 
  async register(name: string, email: string, password: string, role: string) {
    const existingUser = await this.userModel.findOne({ email });
    const existingName = await this.userModel.findOne({ name });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    if (existingName) {
      throw new UnauthorizedException('Username already exists');
    }

    const otp = this.generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store OTP temporarily with expiration
    this.otpStore.set(email, {
      otp,
      expires: new Date(Date.now() + 5 * 60 * 1000), 
    });

    // Send OTP to user's email
    await this.sendOtpEmail(email, otp);

    return {
      message: `An OTP has been sent to ${email}. Please verify to complete registration.`,
    };
  }

  
  async verifyRegistration(email: string, otp: string, name: string, password: string, role: string) {
    const otpData = this.otpStore.get(email);

    if (!otpData || otpData.expires < new Date()) {
      throw new UnauthorizedException('OTP expired or invalid.');
    }

    if (otpData.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP.');
    }

    this.otpStore.delete(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hashedPassword, role });

    try {
      await user.save();
      return {
        message: 'Registration successful!',
        token: this.generateToken(user),
      };
    } catch (error) {
      throw new InternalServerErrorException('Error saving user.');
    }
  }

  /**
   * Login a user and return a welcome message with JWT token.
   */
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate and send OTP for login verification
    const otp = this.generateOtp();
    this.otpStore.set(email, {
      otp,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    await this.sendOtpEmail(email, otp);

    return {
      message: `An OTP has been sent to ${email}. Please verify to complete login.`,
    };
  }

  /**
   * Verify OTP for login and return JWT token.
   */
  async verifyLogin(email: string, otp: string) {
    const otpData = this.otpStore.get(email);

    if (!otpData || otpData.expires < new Date()) {
      throw new UnauthorizedException('OTP expired or invalid.');
    }

    if (otpData.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP.');
    }

    this.otpStore.delete(email);

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return {
      message: `Welcome ${user.role}!`,
      token: this.generateToken(user),
    };
  }

 
  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Send OTP to user's email using nodemailer.
   */
  private async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'md.sumayaafreen1234@gmail.com',
        pass: 'igff fqkx gkkm wcxb',
      },
    });

    try {
      await transporter.sendMail({
        from: 'md.sumayaafreen1234@gmail.com',
        to: email,
        subject: 'Your OTP Verification Code',
        text: `Your OTP is: ${otp}`,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error sending OTP email.');
    }
  }

  /**
   * Generate a JWT token for the user.
   */
  private generateToken(user: UserDocument) {
    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: 'job-board-12345',
        // expiresIn: '60m',
      }),
    };
  }
}
