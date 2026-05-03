const express = require('express');
const router = express.Router();
const ScrapPrice = require('../models/ScrapPrice');
const ServiceArea = require('../models/ServiceArea');
const Booking = require('../models/Booking');
const ChatbotConversation = require('../models/ChatbotConversation');

const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];

function getAvailableDates() {
  const dates = [];
  for (let i = 1; i <= 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

const roleResponses = {
  client: {
    greeting: "Hello! I'm ALUX AI. How can I help with your aluminum recycling needs today?",
    default: "I can help with price estimates, booking pickups, or explaining recycling benefits."
  },
  business: {
    greeting: "Welcome business partner! ALUX offers bulk pricing and scheduled pickups for commercial accounts.",
    default: "Need bulk pickup scheduling or volume pricing? I'm here to help."
  },
  admin: {
    greeting: "Admin access confirmed. System is running normally. Active users: fetching from database.",
    default: "System metrics, user reports, and booking analytics available on request."
  }
};

const serviceAreasList = ['Downtown', 'Westside', 'Eastside', 'North Industrial Park', 'South Residential', 'Green Valley'];

function detectRole(message, userRole = 'client') {
  const msg = message.toLowerCase();
  if (msg.includes('admin') || msg.includes('dashboard') || msg.includes('system metrics')) return 'admin';
  if (msg.includes('business') || msg.includes('commercial') || msg.includes('bulk') || msg.includes('selling')) return 'business';
  return userRole;
}

async function getPriceEstimate(material) {
  try {
    const prices = await ScrapPrice.find({
      material: { $regex: material, $options: 'i' }
    }).limit(1);
    if (prices.length > 0) {
      return { found: true, data: prices[0] };
    }
  } catch (error) {
    console.error('Price query error:', error);
  }
  return { found: false };
}

async function getAllPrices() {
  try {
    const prices = await ScrapPrice.find({});
    const priceMap = {};
    prices.forEach(p => {
      priceMap[p.material] = { price: p.price, grade: p.grade };
    });
    return priceMap;
  } catch (error) {
    return {};
  }
}

async function saveConversation(userId, sessionId, userMessage, botResponse, role) {
  try {
    await ChatbotConversation.create({
      userId,
      sessionId,
      userMessage,
      botResponse,
      roleDetected: role
    });
  } catch (error) {
    console.error('Save conversation error:', error);
  }
}

async function processUserMessage(message, role = 'client', userId = null, sessionId = null) {
  const msg = message.toLowerCase();
  const roleData = roleResponses[role] || roleResponses.client;
  let response = '';

  if (msg.includes('price') || msg.includes('rate') || msg.includes('cost per kg')) {
    const materialMatch = msg.replace(/price|rate|cost per kg|how much|what is/g, '').trim();
    if (materialMatch && materialMatch.length > 2) {
      const estimate = await getPriceEstimate(materialMatch);
      if (estimate.found) {
        response = `💰 **${estimate.data.material}**: $${estimate.data.price} ${estimate.data.unit || 'USD/kg'} (Grade ${estimate.data.grade})\n\n📊 Prices updated daily. Clean, separated material gets best rates!`;
      } else {
        const allPrices = await getAllPrices();
        const priceList = Object.entries(allPrices).map(([k, v]) => `• ${k}: $${v.price} (${v.grade})`).join('\n');
        response = `**Current Scrap Prices**\n\n${priceList || 'No prices available'}\n\nType "price [material]" for specific quotes.`;
      }
    } else {
      const allPrices = await getAllPrices();
      const priceList = Object.entries(allPrices).map(([k, v]) => `• ${k}: $${v.price}`).join('\n');
      response = `**Current Scrap Prices (USD/kg)**\n\n${priceList || 'Loading prices...'}\n\nType "price aluminum cans" for details.`;
    }
  }

  else if (msg.includes('book') || msg.includes('pickup') || msg.includes('schedule') || msg.includes('collect')) {
    const dates = getAvailableDates();
    response = `**📅 Schedule a Pickup**\n\n**Step 1:** Go to "Book Pickup" in your dashboard\n**Step 2:** Select your address from saved locations\n**Step 3:** Choose available date: ${dates.slice(0, 5).join(', ')}\n**Step 4:** Pick time slot: ${timeSlots.join(', ')}\n**Step 5:** Describe your scrap (type, approx weight in kg)\n**Step 6:** Confirm booking\n\n**Service areas:** ${serviceAreasList.join(', ')}\n\n${role === 'business' ? '**Business perk:** Free pickup for 200kg+ orders!' : '**Small quantity fee:** $5-10 applies under 50kg'}\n\nType "book now" to start your booking!`;
  }

  else if (msg.includes('service area') || msg.includes('coverage') || msg.includes('where do you')) {
    response = `**📍 ALUX Service Areas**\n\n${serviceAreasList.map(area => `• ${area}`).join('\n')}\n\n🚚 **New areas coming soon:** Riverside, Oakwood, Silver Lake\n\nWant to request service in your area? Tell me your zip code!`;
  }

  else if (msg.includes('accepted') || msg.includes('materials') || msg.includes('what can i recycle') || msg.includes('what do you take')) {
    response = `**♻️ Accepted Aluminum Materials**\n\n• Aluminum cans (beverage) - CRV eligible\n• Aluminum windows (frames only, no glass)\n• Aluminum doors (without hinges/glass)\n• Aluminum sheets (clean, no paint/oil)\n• Aluminum siding (residential/commercial)\n• Aluminum gutters and downspouts\n• Aluminum foil (clean, balled up)\n• Aluminum rims (car/truck)\n• Cast aluminum (engine parts, cookware)\n\n❌ **Not accepted:**\n• Aluminum with plastic/wood attached\n• Contaminated with oil/paint/food\n• Mixed with other metals\n• Aerosol cans\n\nNeed help preparing your scrap? Just ask!`;
  }

  else if (msg.includes('recycle aluminum') || msg.includes('how to recycle') || msg.includes('recycling process')) {
    response = `**🔄 How to Recycle Aluminum with ALUX**\n\n**Step 1 - Collect & Sort**\nSeparate aluminum by type (cans, sheets, cast). Remove non-aluminum parts.\n\n**Step 2 - Clean (optional but recommended)**\nRinse cans, remove labels for best price.\n\n**Step 3 - Schedule Pickup**\nUse our booking system - choose date/time that works for you.\n\n**Step 4 - Weigh & Confirm**\nOur driver weighs on-site and provides instant quote.\n\n**Step 5 - Get Paid**\nPayment via bank transfer, PayPal, or ALUX wallet within 24 hours.\n\n**Pro tip:** 50kg+ qualifies for premium pricing (+15%)!`;
  }

  else if (msg.includes('benefit') || msg.includes('why recycle') || msg.includes('environment')) {
    response = `**🌍 Why Recycle Aluminum?**\n\n**Environmental Impact:**\n⚡ **95% less energy** than mining new aluminum\n💨 **92% lower CO2 emissions**\n🏭 **97% less water pollution**\n♾️ **Infinite recyclability** - no quality loss\n\n**Economic Benefits:**\n💰 **$1.20-1.60/kg** for clean scrap\n🏭 Reduces manufacturing costs by 40%\n📈 Supports local green jobs\n\n**ALUX Impact:**\n♻️ 247 tons recycled YTD\n🌳 Equivalent to saving 12,000 trees\n\n**Every kg matters!** What would you like to recycle today?`;
  }

  else if (msg.includes('modify') || msg.includes('cancel') || msg.includes('change booking') || msg.includes('update booking')) {
    response = `**📝 Modify or Cancel Booking**\n\n**To modify:**\nReply to your booking confirmation SMS or go to "My Bookings" → "Edit"\n\n**To cancel:**\n• Free cancellation up to 4 hours before pickup\n• Late cancellation (under 4h): $5 fee\n• No-show: $15 fee\n\n**Need to reschedule?**\nVisit "My Bookings" → "Reschedule" to see new available slots\n\nCurrent available slots for reschedule: ${getAvailableDates().slice(0, 4).join(', ')}\n\nWhat's your booking ID? (found in confirmation email)`;
  }

  else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('greeting')) {
    response = roleData.greeting;
  }

  else if (msg.includes('help') || msg.includes('what can you do')) {
    response = `**💡 I can help you with:**\n\n🔹 **Price estimates** - "price aluminum cans"\n🔹 **Book pickups** - "how to book a pickup"\n🔹 **Material list** - "what materials are accepted"\n🔹 **Service areas** - "what areas do you cover"\n🔹 **Recycling guide** - "how to recycle aluminum"\n🔹 **Benefits** - "why recycle aluminum"\n🔹 **Modify bookings** - "modify my booking"\n\nJust type your question naturally!`;
  }

  else if (msg.includes('book now')) {
    const nextDate = getAvailableDates()[0];
    response = `**✅ Ready to book?**\n\nI found available slot: **${nextDate} at ${timeSlots[0]}**\n\nTo confirm, please provide:\n1. Your full address\n2. Estimated weight (kg)\n3. Material type(s)\n\nOr visit your dashboard → "Book Pickup" to complete in 2 minutes!`;
  }

  else {
    response = roleData.default + `\n\nTry: "price", "book pickup", "accepted materials", or "service areas"`;
  }

  await saveConversation(userId, sessionId, message, response, role);

  return response;
}

router.post('/query', async (req, res) => {
  const { message, userRole = 'client', userId = null, sessionId = null } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const role = detectRole(message, userRole);
    const response = await processUserMessage(message, role, userId, sessionId || `session_${Date.now()}`);

    const suggestedQuestions = [
      "What's the price per kg?",
      "How do I book a pickup?",
      "What materials are accepted?",
      "What areas do you cover?"
    ];

    res.json({
      response,
      roleDetected: role,
      suggestedQuestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      response: "⚠️ Sorry, I'm having trouble processing your request. Please try again or contact support.",
      suggestedQuestions: []
    });
  }
});

router.post('/book', async (req, res) => {
  const { date, timeSlot, address, weight, material, userName, userEmail, userPhone, userId } = req.body;

  if (!date || !timeSlot || !address) {
    return res.status(400).json({ error: 'Date, timeSlot, and address required' });
  }

  const availableDates = getAvailableDates();
  if (!availableDates.includes(date)) {
    return res.status(400).json({ error: 'Selected date not available' });
  }

  if (!timeSlots.includes(timeSlot)) {
    return res.status(400).json({ error: 'Selected time slot not available' });
  }

  const bookingCode = `ALUX${Date.now()}${Math.floor(Math.random() * 1000)}`;

  try {
    const booking = await Booking.create({
      bookingCode,
      userId: userId || null,
      userName: userName || 'Guest',
      userEmail: userEmail || '',
      userPhone: userPhone || '',
      address,
      materialType: material || 'mixed',
      estimatedWeight: weight || 0,
      pickupDate: new Date(date),
      pickupTime: timeSlot,
      status: 'confirmed'
    });

    let estimatedPrice = 0;
    if (weight) {
      const priceData = await ScrapPrice.findOne({ material: { $regex: material || 'mixed', $options: 'i' } });
      if (priceData) {
        estimatedPrice = weight * priceData.price;
      } else {
        estimatedPrice = weight * 1.20;
      }
    }

    res.json({
      success: true,
      booking: {
        id: bookingCode,
        date,
        timeSlot,
        address,
        weight,
        material,
        status: 'confirmed'
      },
      estimatedPayout: estimatedPrice > 0 ? `$${estimatedPrice.toFixed(2)}` : 'Calculated at pickup',
      nextSteps: "Our driver will arrive within 30 min of your time slot. Have your scrap ready!"
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/prices', async (req, res) => {
  try {
    const prices = await ScrapPrice.find({});
    res.json({ prices, lastUpdated: new Date().toISOString() });
  } catch (error) {
    res.json({ prices: [], lastUpdated: new Date().toISOString() });
  }
});

router.get('/areas', async (req, res) => {
  try {
    const areas = await ServiceArea.find({ isActive: true });
    res.json({ areas });
  } catch (error) {
    res.json({ areas: serviceAreasList.map(city => ({ city, pickupFee: 0 })) });
  }
});

router.get('/slots', (req, res) => {
  res.json({ availableDates: getAvailableDates(), timeSlots });
});

module.exports = router;