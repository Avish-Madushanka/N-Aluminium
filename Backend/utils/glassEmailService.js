const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"ALUX Panadura" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: htmlContent
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    return false;
  }
};

exports.sendOrderConfirmationEmail = async (order) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.glassType}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.widthFt}'x${item.heightFt}'</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">Rs ${item.totalPrice.toFixed(2)}</td>
    </tr>
  `).join('');
  
  const deliveryHtml = order.deliveryMethod === 'pickup' ? `
    <div style="margin: 15px 0;">
      <h3 style="color: #2c3e50;">Pickup Details</h3>
      <p><strong>Location:</strong> ALUX Panadura - Alubomulla, Sri Lanka</p>
      <p><strong>Date:</strong> ${order.pickupDate}</p>
      <p><strong>Time:</strong> ${order.pickupTimeSlot}</p>
    </div>
  ` : `
    <div style="margin: 15px 0;">
      <h3 style="color: #2c3e50;">Delivery Details</h3>
      <p><strong>Address:</strong> ${order.selectedLocation?.address || 'Manually entered location'}</p>
      <p><strong>Distance:</strong> ${order.distance} km</p>
      <p><strong>Date:</strong> ${order.deliveryDate}</p>
      <p><strong>Time:</strong> ${order.deliveryTimeSlot}</p>
      ${order.urgentDelivery ? '<p><strong>Urgent Delivery:</strong> Yes (+25% fee)</p>' : ''}
      ${order.insurance ? '<p><strong>Insurance:</strong> Included (2% of glass value)</p>' : ''}
    </div>
  `;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f9f9f9;">
      <div style="background: #1a1a2e; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">ALUX Panadura</h1>
        <p style="color: #ccc; margin: 5px 0 0;">Alubomulla, Panadura, Sri Lanka</p>
      </div>
      
      <div style="padding: 30px; background: white;">
        <h2 style="color: #1a1a2e; margin-top: 0;">Order Confirmation</h2>
        <p>Dear ${order.userInfo.fullName},</p>
        <p>Thank you for your purchase! Your order has been successfully placed and payment confirmed.</p>
        
        <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
          <p style="margin: 5px 0;"><strong>Bill Number:</strong> ${order.billNumber}</p>
          <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : order.paymentMethod === 'bank' ? 'Bank Transfer' : order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod === 'paypal' ? 'PayPal' : 'Mobile Payment'}</p>
        </div>
        
        <h3 style="color: #2c3e50;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background: #2c3e50; color: white;">
              <th style="padding: 10px;">Product</th>
              <th style="padding: 10px;">Dimensions</th>
              <th style="padding: 10px;">Qty</th>
              <th style="padding: 10px;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        
        ${deliveryHtml}
        
        <div style="border-top: 2px solid #eee; padding: 15px 0; margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Glass Total:</span>
            <span>Rs ${order.totalGlassPrice.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Transport Cost:</span>
            <span>Rs ${order.transportCost.toFixed(2)}</span>
          </div>
          ${order.insuranceCost > 0 ? `
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Insurance (2%):</span>
            <span>Rs ${order.insuranceCost.toFixed(2)}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin: 15px 0; padding-top: 10px; border-top: 2px solid #2c3e50; font-size: 1.2em; font-weight: bold;">
            <span>Grand Total:</span>
            <span style="color: #e74c3c;">Rs ${order.grandTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">⚠️ <strong>Fragile Glass</strong> - Handle with care. Professional handling with wooden frame packaging required.</p>
        </div>
        
        <p style="margin-top: 30px;">You can track your order status here:</p>
        <p style="text-align: center;">
          <a href="${frontendUrl}/track-order/${order.orderId}" style="background: #d30905; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Track Your Order</a>
        </p>
        
        <p style="margin-top: 30px;">If you have any questions, please contact us at +94 72 104 6048 or reply to this email.</p>
        
        <p style="margin-top: 20px;">Best regards,<br><strong>ALUX Panadura Team</strong></p>
      </div>
      
      <div style="background: #1a1a2e; padding: 20px; text-align: center; color: #ccc; font-size: 12px;">
        <p style="margin: 0;">ALUX Panadura - Alubomulla, Panadura, Sri Lanka</p>
        <p style="margin: 5px 0;">Tel: +94 72 104 6048 | Email: donotreply.ALUX@gmail.com</p>
        <p style="margin: 10px 0 0;">&copy; ${new Date().getFullYear()} ALUX Panadura. All rights reserved.</p>
      </div>
    </div>
  `;
  
  return await sendEmail(order.userInfo.email, `Order Confirmed - ${order.orderId}`, htmlContent);
};

exports.sendOrderStatusUpdateEmail = async (order, newStatus, note) => {
  const statusText = {
    pending: 'Pending',
    processing: 'Processing',
    dispatched: 'Dispatched',
    ontheway: 'On The Way',
    delivered: 'Delivered'
  };
  
  const statusColors = {
    pending: '#f39c12',
    processing: '#3498db',
    dispatched: '#9b59b6',
    ontheway: '#e67e22',
    delivered: '#27ae60'
  };
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
      <div style="background: #1a1a2e; padding: 25px; text-align: center;">
        <h1 style="color: white; margin: 0;">ALUX Panadura</h1>
      </div>
      
      <div style="padding: 25px; background: white;">
        <h2 style="color: #1a1a2e;">Order Status Update</h2>
        <p>Dear ${order.userInfo.fullName},</p>
        <p>Your order status has been updated.</p>
        
        <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
          <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="color: ${statusColors[newStatus]}; font-weight: bold;">${statusText[newStatus]}</span></p>
          ${note ? `<p style="margin: 5px 0;"><strong>Note:</strong> ${note}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}/track-order/${order.orderId}" style="background: #d30905; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">Track Order</a>
        </div>
        
        <p>Thank you for choosing ALUX Panadura!</p>
        <p>Best regards,<br><strong>ALUX Panadura Team</strong></p>
      </div>
    </div>
  `;
  
  return await sendEmail(order.userInfo.email, `Order Status Update - ${order.orderId}`, htmlContent);
};