const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'EcoSynk Team'}" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

const sendBookingStatusUpdateEmail = async (booking, newStatus) => {
  if (!booking || !booking.contactDetails || !booking.contactDetails.email) {
    console.warn('Cannot send booking status email: missing booking data or recipient email.');
    return;
  }

  const recipientEmail = booking.contactDetails.email;
  const recipientName = booking.contactDetails.name || 'Valued Customer';
  let subject = '';
  let htmlContent = '';

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (newStatus === 'confirmed') {
    subject = `Your Pickup Booking ${booking.bookingId} is Confirmed!`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Booking Confirmed!</h2>
        <p>Dear ${recipientName},</p>
        <p>Great news! Your pickup booking has been <strong style="color: #27ae60;">confirmed</strong>.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(booking.selectedDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${booking.timeSlotId}</p>
          <p style="margin: 5px 0;"><strong>Pickup Location:</strong> ${booking.pickupLocation}</p>
        </div>
        <p>Our team will arrive at the specified location during the selected time slot.</p>
        <p>If you have any questions, please contact us.</p>
        <p>Thank you,<br>The ${process.env.EMAIL_FROM_NAME || 'EcoSynk Team'}</p>
        <p style="font-size: 12px; color: #7f8c8d;">
          <a href="${frontendUrl}" style="color: #3498db;">Visit our website</a>
        </p>
      </div>
    `;
  } else if (newStatus === 'cancelled') {
    subject = `Your Pickup Booking ${booking.bookingId} has been Cancelled`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Booking Cancelled</h2>
        <p>Dear ${recipientName},</p>
        <p>Your pickup booking has been <strong style="color: #e74c3c;">cancelled</strong>.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(booking.selectedDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${booking.timeSlotId}</p>
          ${booking.adminNotes ? `<p style="margin: 5px 0;"><strong>Reason:</strong> ${booking.adminNotes}</p>` : ''}
        </div>
        <p>If you have any questions, please contact us.</p>
        <p>Sincerely,<br>The ${process.env.EMAIL_FROM_NAME || 'EcoSynk Team'}</p>
        <p style="font-size: 12px; color: #7f8c8d;">
          <a href="${frontendUrl}" style="color: #3498db;">Visit our website</a>
        </p>
      </div>
    `;
  } else {
    console.log(`No email template configured for status: ${newStatus} for booking ${booking.bookingId}.`);
    return;
  }

  await sendEmail(recipientEmail, subject, htmlContent);
};

const sendAlumniApprovalEmail = async (email, name) => {
  const subject = 'Your Alumni Registration Has Been Approved!';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Welcome to the Alumni Program!</h2>
      <p>Dear ${name},</p>
      <p>Congratulations! Your alumni registration has been <strong style="color: #27ae60;">approved</strong>.</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;">You can now access all alumni features and benefits:</p>
        <ul style="color: #2c3e50;">
          <li>Network with fellow alumni</li>
          <li>Access exclusive events and opportunities</li>
          <li>Receive updates and newsletters</li>
          <li>Participate in alumni programs</li>
        </ul>
      </div>
      <p>To get started, please visit our alumni portal:</p>
      <p style="text-align: center;">
        <a href="${frontendUrl}/alumni/dashboard" 
           style="background: #d30905; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Access Alumni Portal
        </a>
      </p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Alumni Team</p>
      <p style="font-size: 12px; color: #7f8c8d; margin-top: 30px;">
        <a href="${frontendUrl}" style="color: #3498db;">Visit our website</a> | 
        <a href="${frontendUrl}/contact" style="color: #3498db;">Contact Us</a>
      </p>
    </div>
  `;

  await sendEmail(email, subject, htmlContent);
};

const sendAlumniRejectionEmail = async (email, name, reason = '') => {
  const subject = 'Update on Your Alumni Registration';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Alumni Registration Update</h2>
      <p>Dear ${name},</p>
      <p>Thank you for your interest in our alumni program. After reviewing your application, 
         we regret to inform you that we are unable to approve your registration at this time.</p>
      ${reason ? `
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
        </div>
      ` : ''}
      <p>If you believe this is an error or would like to provide additional information, 
         please contact our support team.</p>
      <p>You can also try registering again with updated information.</p>
      <p style="text-align: center;">
        <a href="${frontendUrl}/alumni/register" 
           style="background: #3498db; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          Register Again
        </a>
      </p>
      <p>If you have any questions, please contact us.</p>
      <p>Sincerely,<br>The Alumni Team</p>
      <p style="font-size: 12px; color: #7f8c8d; margin-top: 30px;">
        <a href="${frontendUrl}" style="color: #3498db;">Visit our website</a> | 
        <a href="${frontendUrl}/contact" style="color: #3498db;">Contact Us</a>
      </p>
    </div>
  `;

  await sendEmail(email, subject, htmlContent);
};

const sendAlumniStatusUpdateEmail = async (alumni, status, reason = '') => {
  if (!alumni || !alumni.email) {
    console.warn('Cannot send alumni status email: missing alumni data or recipient email.');
    return;
  }

  if (status === 'approved') {
    await sendAlumniApprovalEmail(alumni.email, alumni.fullName);
  } else if (status === 'rejected') {
    await sendAlumniRejectionEmail(alumni.email, alumni.fullName, reason);
  } else {
    console.log(`No email template configured for status: ${status}`);
  }
};

module.exports = { 
  sendEmail, 
  sendBookingStatusUpdateEmail,
  sendAlumniApprovalEmail,
  sendAlumniRejectionEmail,
  sendAlumniStatusUpdateEmail 
};