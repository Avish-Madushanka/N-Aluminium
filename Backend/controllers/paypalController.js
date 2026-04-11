const axios = require('axios');

let paypalAccessToken = null;
let tokenExpiry = null;

async function getPayPalAccessToken() {
  if (paypalAccessToken && tokenExpiry && tokenExpiry > Date.now()) {
    return paypalAccessToken;
  }
  
  try {
    const PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID;
    const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
    const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
    
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    paypalAccessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
    
    return paypalAccessToken;
  } catch (error) {
    console.error('Get PayPal token error:', error.response?.data || error.message);
    throw new Error('Failed to get PayPal access token');
  }
}

exports.createPayPalOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
    
    const accessToken = await getPayPalAccessToken();
    
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount.toString()
          },
          description: 'Glass Order Purchase'
        }],
        application_context: {
          brand_name: 'ALUX Panadura',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-confirmation`,
          cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout`
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({ success: true, orderId: response.data.id });
  } catch (error) {
    console.error('Create PayPal order error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to create PayPal order' });
  }
};

exports.capturePayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
    
    const accessToken = await getPayPalAccessToken();
    
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const transactionId = response.data.purchase_units[0]?.payments?.captures[0]?.id;
    
    res.json({
      success: true,
      transactionId: transactionId,
      data: response.data
    });
  } catch (error) {
    console.error('Capture PayPal order error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to capture PayPal payment' });
  }
};