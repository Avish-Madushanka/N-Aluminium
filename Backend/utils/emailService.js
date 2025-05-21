const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: (process.env.EMAIL_SECURE === 'true'), 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
 
});

/**
 * @param {string} to 
 * @param {string} subject 
 * @param {string} htmlContent 
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, htmlContent) => {
    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'EcoSynk Team'}" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
        console.error(`[EmailService] Error sending email to ${to}:`, error);
    }
};

/**

 * @param {object} booking 
 * @param {string} newStatus 
 */
const sendBookingStatusUpdateEmail = async (booking, newStatus) => {
    if (!booking || !booking.contactDetails || !booking.contactDetails.email) {
        console.warn('[EmailService] Cannot send booking status email: missing booking data or recipient email.');
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
            <p>Dear ${recipientName},</p>
            <p>Great news! Your pickup booking (ID: <strong>${booking.bookingId}</strong>) has been <strong>confirmed</strong>.</p>
            <p><strong>Details:</strong></p>
            <ul>
                <li>Date: ${new Date(booking.selectedDate).toLocaleDateString()}</li>
                <li>Time Slot: ${booking.timeSlotId}</li>
                <li>Pickup Location: ${booking.pickupLocation}</li>
            </ul>
            <p>Our team will arrive at the specified location during the selected time slot.</p>
            <p>If you have any questions or need to make changes, please contact us as soon as possible.</p>
            <p>Thank you,<br/>The ${process.env.EMAIL_FROM_NAME || 'EcoSynk Team'}</p>
            <p><small>Visit our website: <a href="${frontendUrl}">${frontendUrl}</a></small></p>
        `;
    } else if (newStatus === 'cancelled') {
        subject = `Important: Your Pickup Booking ${booking.bookingId} has been Cancelled`;
        htmlContent = `
            <p>Dear ${recipientName},</p>
            <p>We are writing to inform you that your pickup booking (ID: <strong>${booking.bookingId}</strong>) has been <strong>cancelled</strong> by our administration.</p>
            <p><strong>Booking Details:</strong></p>
            <ul>
                <li>Date: ${new Date(booking.selectedDate).toLocaleDateString()}</li>
                <li>Time Slot: ${booking.timeSlotId}</li>
            </ul>
            ${booking.adminNotes ? `<p><strong>Reason/Notes from Admin:</strong> ${booking.adminNotes}</p>` : ''}
            <p>If you believe this is an error, have any questions, or wish to make a new booking, please contact us or visit our website.</p>
            <p>We apologize for any inconvenience this may cause.</p>
            <p>Sincerely,<br/>The ${process.env.EMAIL_FROM_NAME || 'EcoSynk Team'}</p>
            <p><small>Visit our website: <a href="${frontendUrl}">${frontendUrl}</a></small></p>
        `;
    } else {
        console.log(`[EmailService] No email template configured for status: ${newStatus} for booking ${booking.bookingId}.`);
        return; 
    }

    await sendEmail(recipientEmail, subject, htmlContent);
};

module.exports = { sendEmail, sendBookingStatusUpdateEmail };