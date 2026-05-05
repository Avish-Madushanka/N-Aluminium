const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const PasswordReset = require('../models/PasswordReset');
const Client = require('../models/Client');
const BusinessOwner = require('../models/BusinessOwner');
const Admin = require('../models/Admin');

const findUserByEmail = async (email) => {
  let user = await Client.findOne({ email: email.toLowerCase() });
  if (user) return user;
  user = await BusinessOwner.findOne({ email: email.toLowerCase() });
  if (user) return user;
  user = await Admin.findOne({ email: email.toLowerCase() });
  return user;
};

const getUserName = (user) => {
  if (user.fullName) return user.fullName;
  if (user.ownerName) return user.ownerName;
  if (user.businessName) return user.businessName;
  if (user.name) return user.name;
  return user.email.split('@')[0];
};

const sendResetEmail = async (email, name, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #d30905;">Reset Your Password</h2>
      <p>Dear ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #d30905; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">Reset Password</a>
      </div>
      <p>Or copy this link: ${resetUrl}</p>
      <p>This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      <hr>
      <p style="color: #666; font-size: 12px;">ALUX Panadura - Alubomulla, Panadura, Sri Lanka</p>
    </div>
  `;
  
  await transporter.sendMail({
    from: `"ALUX Panadura" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password - ALUX Panadura',
    html: htmlContent
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address.' });
    }
    
    const user = await findUserByEmail(email);
    
    if (!user) {
      return res.status(200).json({ success: true, message: 'If an account exists, you will receive reset instructions.' });
    }
    
    await PasswordReset.deleteMany({ email: email.toLowerCase() });
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    await PasswordReset.create({
      email: email.toLowerCase(),
      token: hashedToken,
      expiresAt: new Date(Date.now() + 3600000)
    });
    
    const userName = getUserName(user);
    await sendResetEmail(email, userName, resetToken);
    
    res.status(200).json({
      success: true,
      message: 'Password reset instructions have been sent to your email.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    
    if (!token || !email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const resetRequest = await PasswordReset.findOne({
      email: email.toLowerCase(),
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRequest) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }
    
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    
    resetRequest.used = true;
    await resetRequest.save();
    
    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const { token, email } = req.query;
    
    if (!token || !email) {
      return res.status(400).json({ success: false, valid: false });
    }
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const resetRequest = await PasswordReset.findOne({
      email: email.toLowerCase(),
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetRequest) {
      return res.status(400).json({ success: false, valid: false });
    }
    
    res.status(200).json({ success: true, valid: true });
  } catch (error) {
    res.status(500).json({ success: false, valid: false });
  }
};