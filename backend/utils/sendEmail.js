// sendEmail.js
import nodemailer from 'nodemailer';
import generateOTP from '../utils/generateOtp.js';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import { setOTP } from './otpStore.js';  // Adjust the path accordingly
dotenv.config();

const sendEmail = asyncHandler(async (email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Generate 6 digit OTP
  const otp = generateOTP();
  setOTP(email, otp);  // Store OTP in otpStore

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP',
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);

  // Close the transporter to release resources
  transporter.close();
});

export default sendEmail;
