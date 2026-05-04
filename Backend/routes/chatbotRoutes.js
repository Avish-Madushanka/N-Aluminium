const express = require('express');
const router = express.Router();
const ScrapPrice = require('../models/ScrapPrice');
const ScrapType = require('../models/ScrapType');
const ServiceArea = require('../models/ServiceArea');
const Booking = require('../models/Booking');
const ChatbotConversation = require('../models/ChatbotConversation');
const GlassOrder = require('../models/GlassOrder');
const GlassProduct = require('../models/GlassProduct');
const AluQuotation = require('../models/AluQuotation');
const QuotationRequest = require('../models/QuotationRequest');
const BuyAndSellItem = require('../models/BuyAndSellItem');
const Item = require('../models/Item');
const Cart = require('../models/Cart');
const Alumni = require('../models/Alumni');
const Project = require('../models/Project');

function getAvailableDates() {
  const dates = [];
  for (let i = 1; i <= 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[date.getDay()];
    dates.push({ date: `${year}-${month}-${day}`, display: `${dayName}, ${month}/${day}/${year}` });
  }
  return dates;
}

const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
const transportRates = { first5km: 500, additionalKm: 80, currency: 'LKR' };

async function getPriceEstimate(material) {
  try {
    let priceData = await ScrapPrice.findOne({ material: { $regex: material, $options: 'i' } });
    if (!priceData) {
      priceData = await ScrapType.findOne({ name: { $regex: material, $options: 'i' }, isActive: true });
    }
    if (priceData) {
      return { found: true, data: priceData };
    }
  } catch (error) {
    console.error('Price query error:', error);
  }
  return { found: false };
}

async function getAllPrices() {
  try {
    const prices = await ScrapPrice.find({});
    if (prices.length > 0) return prices;
    const scrapTypes = await ScrapType.find({ isActive: true });
    if (scrapTypes.length > 0) return scrapTypes;
    return [];
  } catch (error) {
    return [];
  }
}

async function saveConversation(userId, sessionId, userMessage, botResponse, role, category) {
  try {
    await ChatbotConversation.create({ userId, sessionId, userMessage, botResponse, roleDetected: role });
  } catch (error) {
    console.error('Save conversation error:', error);
  }
}

async function getUserBookingsFromDB(userId) {
  try {
    return await Booking.find({ userId }).sort({ selectedDate: 1 }).limit(10);
  } catch (error) {
    return [];
  }
}

async function getUserGlassOrders(userId, email) {
  try {
    let orders = [];
    if (userId) orders = await GlassOrder.find({ userId }).sort({ createdAt: -1 }).limit(5);
    if (orders.length === 0 && email) orders = await GlassOrder.find({ 'userInfo.email': email }).sort({ createdAt: -1 }).limit(5);
    return orders;
  } catch (error) {
    return [];
  }
}

async function getGlassProductsFromDB() {
  try {
    const glassData = await GlassProduct.findOne();
    if (glassData && glassData.glassTypes) {
      const result = {};
      const glassTypesMap = glassData.glassTypes;
      if (glassTypesMap instanceof Map) {
        for (let [typeName, qualities] of glassTypesMap) {
          result[typeName] = {};
          if (qualities && qualities.Standard) {
            const sizes = [];
            if (qualities.Standard instanceof Map) {
              for (let [size, price] of qualities.Standard) {
                sizes.push(`${size}mm: $${price}`);
              }
            }
            result[typeName].Standard = sizes.slice(0, 3).join(', ');
          }
          if (qualities && qualities.Premium) {
            const sizes = [];
            if (qualities.Premium instanceof Map) {
              for (let [size, price] of qualities.Premium) {
                sizes.push(`${size}mm: $${price}`);
              }
            }
            result[typeName].Premium = sizes.slice(0, 3).join(', ');
          }
        }
      }
      return result;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function getUserQuotations(userId, email) {
  try {
    let quotations = [];
    if (userId) quotations = await AluQuotation.find({ userId }).sort({ submittedAt: -1 }).limit(5);
    if (quotations.length === 0 && email) quotations = await AluQuotation.find({ email }).sort({ submittedAt: -1 }).limit(5);
    return quotations;
  } catch (error) {
    return [];
  }
}

async function getUserItemQuotations(userId) {
  try {
    return await QuotationRequest.find({ userId }).sort({ requestedAt: -1 }).limit(5);
  } catch (error) {
    return [];
  }
}

async function getAllBuyAndSellItems() {
  try {
    return await BuyAndSellItem.find({ status: 'active' }).sort({ createdAt: -1 }).limit(15);
  } catch (error) {
    return [];
  }
}

async function getUserBuyAndSellItems(userId) {
  try {
    return await BuyAndSellItem.find({ userId }).sort({ createdAt: -1 }).limit(10);
  } catch (error) {
    return [];
  }
}

async function getAllItemMarketplaceItems() {
  try {
    return await Item.find({ inStock: true }).sort({ createdAt: -1 }).limit(15);
  } catch (error) {
    return [];
  }
}

async function getUserItemCart(userId) {
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    return cart;
  } catch (error) {
    return null;
  }
}

async function getItemCategories() {
  try {
    const categories = await Item.distinct('category');
    return categories;
  } catch (error) {
    return ['glass', 'cradding', 'silicon', 'rubber', 'pvc', 'box-bars', 'u-channels', 'l-bars', 't-channels', 'j-channels', 'sivilim', 'cutters', 'grill', 'rivet-guns', 'rubber-blade', 'glass-cutters', 'rivet-box'];
  }
}

async function getUserAlumniStatus(email) {
  try {
    return await Alumni.findOne({ email }).sort({ createdAt: -1 });
  } catch (error) {
    return null;
  }
}

async function getUserProjects(userId) {
  try {
    return await Project.find({ userId }).sort({ createdAt: -1 }).limit(5);
  } catch (error) {
    return [];
  }
}

async function getAllProjects() {
  try {
    return await Project.find({}).sort({ createdAt: -1 }).limit(10);
  } catch (error) {
    return [];
  }
}

function getNormalAIResponse(userMessage, userName) {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `Hello ${userName}! I'm ALUX AI. I can help with prices, bookings, glass orders, quotations, item marketplace, buy & sell, training, and projects. What would you like to know?`;
  }
  
  if (msg.includes('how are you')) {
    return "I'm doing great! Ready to help you with aluminum recycling, glass orders, item marketplace, and more!";
  }
  
  if (msg.includes('thank') || msg.includes('thanks')) {
    return "You're welcome! Happy to help. Is there anything else you need?";
  }
  
  if (msg.includes('bye') || msg.includes('goodbye')) {
    return "Goodbye! Thank you for using ALUX AI. Come back anytime!";
  }
  
  if (msg.includes('what can you do') || msg.includes('help me')) {
    return "I can help with:\n\n💰 Prices\n📅 Book Pickup\n🥤 Glass Orders\n📋 My Quotes\n🛒 Item Marketplace\n💼 Buy & Sell\n🎓 Training\n📁 ALUX Projects\n\nWhat would you like to know?";
  }
  
  return `I'm not sure I understand, ${userName}. Try asking about: prices, booking pickup, glass orders, item marketplace, buy & sell, training, or projects.`;
}

async function processUserMessage(message, role = 'client', userId = null, sessionId = null, userEmail = null) {
  const msg = message.toLowerCase().trim();
  let response = '';
  let category = '';

  const userName = 'there';

  if (msg === 'what is the price per kg?' || msg === 'price per kg' || msg === 'check prices' || msg === 'scrap prices' || msg === 'price') {
    category = 'price';
    const allPrices = await getAllPrices();
    if (allPrices.length > 0) {
      const priceList = allPrices.map(p => `• ${p.material || p.name}: $${p.price} ${p.unit || 'USD/kg'}`).join('\n');
      response = `📊 Current Scrap Prices (USD/kg):\n\n${priceList}\n\n💡 Tip: Clean, separated aluminum gets higher rates! Type "price aluminum cans" for specific material prices.`;
    } else {
      response = `📊 Current Scrap Prices (USD/kg):\n\n• Aluminum Cans: $1.20\n• Aluminum Windows: $1.50\n• Aluminum Doors: $1.40\n• Aluminum Sheets: $1.30\n• Mixed Aluminum: $1.00\n• Cast Aluminum: $0.90\n• Aluminum Rims: $1.60\n• Aluminum Foil: $0.85\n\n💡 Type "price aluminum cans" to check specific material prices.`;
    }
  }

  else if (msg.includes('price') && !msg.includes('what is the price per kg?') && !msg.includes('price per kg') && !msg.includes('check prices') && !msg.includes('scrap prices')) {
    category = 'price';
    let materialMatch = msg.replace('price', '').replace('for', '').replace('of', '').trim();
    if (materialMatch && materialMatch.length > 2) {
      const estimate = await getPriceEstimate(materialMatch);
      if (estimate.found) {
        const priceValue = estimate.data.price;
        const unitValue = estimate.data.unit || 'USD/kg';
        const nameValue = estimate.data.material || estimate.data.name;
        response = `💰 ${nameValue}: $${priceValue} ${unitValue}\n\n📈 Current market rate. Prices are updated daily based on market conditions.`;
      } else {
        const allPrices = await getAllPrices();
        if (allPrices.length > 0) {
          const priceList = allPrices.slice(0, 6).map(p => `• ${p.material || p.name}: $${p.price}`).join('\n');
          response = `❌ Couldn't find "${materialMatch}".\n\nAvailable materials:\n${priceList}\n\nTry: "price aluminum cans" or "price aluminum windows"`;
        } else {
          response = `❌ Couldn't find "${materialMatch}". Try: aluminum cans, aluminum windows, aluminum doors, aluminum sheets, mixed aluminum, cast aluminum, aluminum rims, or aluminum foil.`;
        }
      }
    } else {
      response = `💰 Please specify a material. Example: "price aluminum cans" or "price aluminum windows"`;
    }
  }

  else if (msg === 'what materials are accepted?' || msg === 'accepted materials' || msg === 'what can i recycle' || msg === 'recyclable items') {
    category = 'materials';
    const allPrices = await getAllPrices();
    let priceList = '';
    if (allPrices.length > 0) {
      priceList = allPrices.map(p => `• ${p.material || p.name}: $${p.price} ${p.unit || 'USD/kg'}`).join('\n');
    } else {
      priceList = `• Aluminum Cans: $1.20/kg\n• Aluminum Windows: $1.50/kg\n• Aluminum Doors: $1.40/kg\n• Aluminum Sheets: $1.30/kg\n• Mixed Aluminum: $1.00/kg\n• Cast Aluminum: $0.90/kg\n• Aluminum Rims: $1.60/kg\n• Aluminum Foil: $0.85/kg`;
    }
    
    response = `♻️ Accepted Aluminum Materials:\n\n✅ ACCEPTED:\n${priceList}\n\n📋 DETAILS:\n• Aluminum Cans - Beverage cans, CRV eligible\n• Aluminum Windows - Frames only, no glass\n• Aluminum Doors - Without hinges/glass\n• Aluminum Sheets - Clean, no paint/oil\n• Aluminum Siding - Residential/commercial\n• Aluminum Gutters - Downspouts included\n• Aluminum Foil - Clean, balled up\n• Aluminum Rims - Car/truck wheels\n• Cast Aluminum - Engine parts, cookware\n\n❌ NOT ACCEPTED:\n• Aluminum with plastic/wood attached\n• Contaminated with oil/paint/food\n• Mixed with other metals\n• Aerosol cans\n\n💡 PREPARATION TIPS:\n• Remove all non-aluminum parts\n• Clean when possible for best price\n• Separate different grades\n• Ball up foil to save space\n\n💰 ESTIMATED EARNINGS:\n• 50kg mixed aluminum ≈ $60-75\n• 100kg clean sheets ≈ $120-150\n\nType "price [material]" for current rates!`;
  }

  else if (msg === 'how do i book a pickup?' || msg === 'booking guide' || msg === 'how to book') {
    category = 'booking';
    const dates = getAvailableDates();
    response = `📅 How to Book a Pickup:\n\n📍 PATH: Dashboard → Book Pickup → Schedule New Pickup\n\n📋 STEPS:\n1. Login to your ALUX account\n2. Click "Book Pickup" in navigation\n3. Enter your pickup address\n4. Choose available date: ${dates.slice(0, 3).map(d => d.display).join(', ')}\n5. Select time slot: ${timeSlots.join(', ')}\n6. Enter scrap type and estimated weight (kg)\n7. Review and confirm booking\n8. Receive confirmation via SMS/Email\n\n💰 PRICING:\n• Free pickup for 50kg+ orders\n• Small quantity fee: $5-15 (under 50kg)\n• Business accounts: Priority scheduling\n\n❓ Need help? Type "book now" to schedule immediately!`;
  }

  else if (msg === 'book now' || msg === 'booknow' || msg === 'start booking') {
    category = 'booking';
    const dates = getAvailableDates();
    response = `✅ Book Your Pickup Now:\n\n📍 PATH: Dashboard → Book Pickup → Schedule New Pickup\n\n📅 AVAILABLE DATES:\n${dates.slice(0, 7).map(d => `• ${d.display} - ${timeSlots.join(', ')}`).join('\n')}\n\n⏰ TIME SLOTS: ${timeSlots.join(', ')}\n\n📝 TO BOOK:\n1. Go to Dashboard → Book Pickup\n2. Enter your address\n3. Select date and time\n4. Enter scrap details\n5. Confirm booking\n\n📞 OR CALL US: +94 72 104 6048\n\n💰 Free pickup for 50kg+ orders!`;
  }

  else if (msg === 'my bookings' || msg === 'my booking' || msg === 'my pickups') {
    category = 'booking';
    if (!userId) {
      response = `📋 Please login to view your bookings.\n\n📍 PATH: Login → Dashboard → My Bookings\n\n🔐 Not logged in? Please login to access your booking history.`;
    } else {
      const userBookings = await getUserBookingsFromDB(userId);
      if (userBookings.length > 0) {
        let bookingsList = userBookings.map((b, index) => {
          const bookingDate = b.selectedDate ? new Date(b.selectedDate).toLocaleDateString() : 'Date TBD';
          const statusIcon = b.status === 'confirmed' ? '✅' : b.status === 'pending' ? '⏳' : b.status === 'completed' ? '✔️' : '❌';
          return `${index + 1}. ${statusIcon} ${b.bookingId || 'Booking'} - ${bookingDate} at ${b.timeSlotId || 'Time TBD'} - ${b.status.toUpperCase()}`;
        }).join('\n');
        response = `📋 Your Bookings:\n\n${bookingsList}\n\n📝 TO MODIFY/CANCEL:\n• PATH: Dashboard → My Bookings → Select booking → Edit/Cancel\n• Free cancellation up to 4 hours before pickup\n• Late cancellation: $5 fee\n\n❓ Need help? Call +94 72 104 6048`;
      } else {
        response = `📋 You don't have any bookings yet.\n\n📅 TO BOOK A PICKUP:\n• PATH: Dashboard → Book Pickup → Schedule New Pickup\n• Type "book now" to get started!\n\n💰 Free pickup for 50kg+ orders!`;
      }
    }
  }

  else if (msg === 'available dates' || msg === 'pickup dates' || msg === 'what dates are available') {
    category = 'booking';
    const dates = getAvailableDates();
    response = `📅 Available Pickup Dates:\n\n${dates.slice(0, 10).map(d => `• ${d.display} - ${timeSlots.join(', ')}`).join('\n')}\n\n📍 TO BOOK: Dashboard → Book Pickup → Select your preferred date and time\n\n💰 Free pickup for 50kg+ orders!`;
  }

  else if (msg === 'what areas do you cover?' || msg === 'service areas' || msg === 'coverage') {
    category = 'areas';
    response = `📍 ALUX Service Areas:\n\n📌 PATH: Home → Services → Scraps Collection → Find Collection Locations\n\n✅ ACTIVE SERVICE AREAS:\n• Downtown - Free pickup\n• Westside - $5 fee\n• Eastside - $5 fee\n• North Industrial Park - Free pickup\n• South Residential - $8 fee\n• Green Valley - $10 fee\n\n🚚 NEW AREAS COMING SOON:\n• Riverside (Next Month)\n• Oakwood (Next Month)\n• Silver Lake (Next Month)\n\n💰 PICKUP FEES:\n• Free for 50kg+ orders\n• Small quantity fee applies under 50kg\n• Business accounts: Priority scheduling\n\n📞 Call +94 72 104 6048 to check if we cover your area!`;
  }

  else if (msg === 'find collection locations' || msg === 'collection locations' || msg === 'where to drop off') {
    category = 'areas';
    response = `📍 Find Collection Locations:\n\n📌 PATH: Home → Services → Scraps Collection → Find Collection Locations\n\n🏢 MAIN LOCATION:\nALUX Panadura\nAlubomulla, Panadura, Sri Lanka\n\n📞 PHONE: +94 72 104 6048\n\n🕐 HOURS:\nMonday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday: Closed\n\n🗺️ For more locations, visit our website or use the map in the Scraps Collection section!`;
  }

  else if (msg === 'glass prices' || msg === 'check glass prices' || msg === 'glass rates') {
    category = 'glass';
    const glassProducts = await getGlassProductsFromDB();
    if (glassProducts) {
      let glassList = '';
      for (const [typeName, qualities] of Object.entries(glassProducts)) {
        glassList += `\n📌 ${typeName}:\n`;
        if (qualities.Standard) glassList += `   Standard: ${qualities.Standard}\n`;
        if (qualities.Premium) glassList += `   Premium: ${qualities.Premium}\n`;
      }
      response = `🥤 Glass Prices (USD per sq ft):\n${glassList}\n\n💡 Prices vary by thickness and quality. Volume discounts available for bulk orders!\n\n📍 ORDER PATH: Dashboard → Glass Order → Place New Order`;
    } else {
      response = `🥤 Glass Prices (USD per sq ft):\n\n• Clear Float Glass: 4mm-$130, 6mm-$210, 8mm-$290, 10mm-$350, 12mm-$500\n• Tempered Glass: 5mm-$375, 6mm-$450, 8mm-$540, 12mm-$630\n• Laminated Glass: 10mm-$500, 15mm-$900, 20mm-$1400\n• Tinted Glass: 4mm-$370, 6mm-$450, 8mm-$600\n\n📌 ORDER PATH: Dashboard → Glass Order → Place New Order\n💡 Standard vs Premium quality options available. Contact us for bulk discounts!`;
    }
  }

  else if (msg === 'how to order glass' || msg === 'place glass order' || msg === 'glass ordering guide') {
    category = 'glass';
    response = `🥤 How to Order Glass:\n\n📍 PATH: Dashboard → Glass Order → Place New Order\n\n📋 STEP-BY-STEP:\n1. Select glass type (Clear Float, Tempered, Laminated, Tinted)\n2. Choose quality (Standard or Premium)\n3. Enter width and height in feet\n4. Select quantity\n5. System calculates area (sq ft) and price\n6. Choose pickup or delivery\n7. For delivery: Enter delivery address\n8. Review order summary\n9. Select payment method (Card, Bank, PayPal, Mobile)\n10. Complete payment\n\n✅ You'll receive:\n• Order confirmation email\n• Bill number for tracking\n• Order ID for status updates\n• Driver details (for delivery orders)\n\n⏱️ Estimated delivery: 2-5 business days depending on location`;
  }

  else if (msg === 'glass transport charges' || msg === 'glass delivery cost' || msg === 'how much for glass delivery') {
    category = 'glass';
    response = `🚚 Glass Transport Charges:\n\n💰 DELIVERY FEE STRUCTURE:\n• First 5 kilometers: ${transportRates.first5km} ${transportRates.currency}\n• Each additional kilometer: ${transportRates.additionalKm} ${transportRates.currency}\n\n📊 EXAMPLE CALCULATIONS:\n• 5km delivery = ${transportRates.first5km} ${transportRates.currency}\n• 10km delivery = ${transportRates.first5km + (5 * transportRates.additionalKm)} ${transportRates.currency}\n• 20km delivery = ${transportRates.first5km + (15 * transportRates.additionalKm)} ${transportRates.currency}\n\n⚠️ ADDITIONAL CHARGES:\n• Urgent delivery: +25% of base fare\n• Insurance: 2% of glass value (optional but recommended)\n• Waiting time: ${transportRates.additionalKm * 2} ${transportRates.currency}/hour after 30 minutes\n\n📍 Free pickup available from our store location!\n🏢 ALUX Panadura, Alubomulla, Panadura, Sri Lanka`;
  }

  else if (msg === 'glass navigation path' || msg === 'glass ordering path') {
    category = 'glass';
    response = `🗺️ Glass Order Navigation Path:\n\n💻 DESKTOP/WEB:\nHome Page → Glass Order → Select Product → Enter Dimensions → Checkout → Payment\n\n📱 MOBILE APP:\nMenu → Glass Orders → New Order → Fill Details → Confirm → Pay\n\n📋 DASHBOARD ACCESS:\nLogin → Dashboard → Glass Orders → Place New Order\n\n🔗 QUICK LINK: /glass-order (if logged in)\n\n📞 NEED HELP? Contact support at +94 72 104 6048`;
  }

  else if (msg === 'my glass orders' || msg === 'track my glass orders') {
    category = 'glass';
    const glassOrders = await getUserGlassOrders(userId, userEmail);
    if (glassOrders.length > 0) {
      let ordersList = glassOrders.map(order => {
        const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown';
        const itemCount = order.items ? order.items.length : 0;
        let statusIcon = order.status === 'pending' ? '⏳' : order.status === 'processing' ? '🔄' : order.status === 'dispatched' ? '📦' : order.status === 'ontheway' ? '🚚' : '✅';
        return `• ${statusIcon} ${order.orderId} - ${orderDate} - ${itemCount} items - ${order.status.toUpperCase()} - $${(order.grandTotal || 0).toFixed(2)}`;
      }).join('\n');
      response = `🥤 Your Glass Orders:\n\n${ordersList}\n\n📊 STATUS FLOW: pending → processing → dispatched → ontheway → delivered\n\n📍 TO TRACK: Dashboard → Glass Orders → Select Order → View Details\n\n📞 Need help? Call +94 72 104 6048`;
    } else {
      response = `🥤 You don't have any glass orders yet.\n\n📋 TO PLACE YOUR FIRST ORDER:\n📍 PATH: Dashboard → Glass Order → Place New Order\n\n❓ Type "how to order glass" for step-by-step guide!`;
    }
  }

  else if (msg === 'my quotes' || msg === 'my quotations' || msg === 'view my quotes') {
    category = 'quotes';
    const aluQuotations = await getUserQuotations(userId, userEmail);
    const itemQuotations = await getUserItemQuotations(userId);
    
    if (aluQuotations.length > 0 || itemQuotations.length > 0) {
      let quotesList = '';
      if (aluQuotations.length > 0) {
        quotesList += '\n📋 Aluminum Quotations:\n';
        quotesList += aluQuotations.map(q => {
          let statusIcon = q.status === 'Pending' ? '⏳' : q.status === 'Reviewed' ? '👀' : q.status === 'Quoted' ? '💰' : '✅';
          return `   ${statusIcon} ${q.quotationId || 'Quote'} - ${q.projectTitle?.substring(0, 30)} - ${q.status}${q.quotedPrice ? ` - $${q.quotedPrice}` : ''}`;
        }).join('\n');
      }
      if (itemQuotations.length > 0) {
        quotesList += '\n\n🛒 Product Quotations:\n';
        quotesList += itemQuotations.map(q => {
          let statusIcon = q.status === 'pending' ? '⏳' : q.status === 'approved' ? '✅' : q.status === 'rejected' ? '❌' : '📋';
          return `   ${statusIcon} ${q.quotationId || 'Quote'} - ${q.items?.length || 0} items - ${q.status} - $${(q.totalAmount || 0).toFixed(2)}`;
        }).join('\n');
      }
      response = `📋 Your Quotations:\n${quotesList}\n\n📊 STATUS GUIDE:\n⏳ Pending → 👀 Reviewed → 💰 Quoted → ✅ Approved\n\n📍 TO VIEW DETAILS: Dashboard → My Quotations\n\n❓ Need a new quote? Type "how to request a quote"!`;
    } else {
      response = `📋 You don't have any quotations yet.\n\n📝 TO REQUEST YOUR FIRST QUOTE:\n📍 PATH: Dashboard → Aluminum Quotation System → New Request\n\n❓ Type "how to request a quote" for step-by-step instructions!`;
    }
  }

  else if (msg === 'how to request a quote' || msg === 'send quotation request' || msg === 'get a quote') {
    category = 'quotes';
    response = `📋 How to Request a Quotation:\n\n📍 PATH: Dashboard → Aluminum Quotation System → New Request\n\n📝 STEP-BY-STEP:\n1. Click "New Quotation Request"\n2. Fill in your personal details:\n   - Full name\n   - Email address\n   - Phone number\n3. Enter project information:\n   - Project title\n   - Detailed project description\n   - Material type (aluminum type)\n   - Color preference\n4. Upload supporting documents:\n   - Design files (images, PDFs)\n   - Reference images\n   - Technical drawings (optional)\n5. Submit your request\n6. Wait for admin review (24-48 hours)\n7. Receive price quote via email\n8. Approve quote to proceed\n\n📊 STATUS TRACKING:\n• Pending - Request received\n• Reviewed - Admin is checking\n• Quoted - Price available\n\n📧 You'll receive email notifications at each stage!`;
  }

  else if (msg === 'quotation request details' || msg === 'what details for quotation') {
    category = 'quotes';
    response = `📋 Quotation Request - Required Details:\n\n📝 PERSONAL INFORMATION:\n• Full Name (required)\n• Email Address (required)\n• Phone Number (required)\n\n📋 PROJECT INFORMATION:\n• Project Title (required)\n• Project Description (required) - Be specific\n• Material Type (required) - Aluminum type\n• Color Preference (required)\n\n📎 FILE UPLOADS:\n• Design Files/Images (required)\n• Additional References (optional)\n• Technical Drawings (optional)\n\n📏 FILE LIMITS:\n• Max file size: 5MB each\n• Max files: 10\n• Allowed types: JPG, PNG, PDF\n\n💡 TIPS FOR FASTER QUOTES:\n• Include clear project descriptions\n• Upload detailed images/drawings\n• Specify quantity and dimensions\n• Mention special requirements\n\n⏱️ Get your quote within 24-48 hours!`;
  }

  else if (msg === 'item marketplace' || msg === 'item market' || msg === 'marketplace items') {
    category = 'itemmarket';
    const items = await getAllItemMarketplaceItems();
    const categories = await getItemCategories();
    
    if (items.length > 0) {
      const itemsList = items.slice(0, 10).map(i => `• ${i.name} - $${i.price}/${i.unit} - ${i.category} - ${i.inStock ? '✅ In Stock' : '❌ Out of Stock'}${i.featured ? ' ⭐' : ''}`).join('\n');
      response = `🛒 Item Marketplace:\n\n📂 CATEGORIES:\n${categories.slice(0, 10).map(c => `• ${c}`).join(', ')}\n\n📦 LATEST ITEMS:\n${itemsList}\n\n📊 TOTAL ITEMS: ${items.length}\n\n📍 TO VIEW MORE: Dashboard → Item Marketplace → Browse All\n\n❓ Type "how to order items" to learn how to purchase!`;
    } else {
      response = `🛒 No items available in marketplace yet.\n\n📂 AVAILABLE CATEGORIES:\n${(await getItemCategories()).slice(0, 10).join(', ')}\n\n🔄 Check back soon for new products!\n\n📍 PATH: Dashboard → Item Marketplace → Browse All`;
    }
  }

  else if (msg === 'how to order items' || msg === 'order from marketplace') {
    category = 'itemmarket';
    response = `🛒 How to Order Items from Marketplace:\n\n📍 PATH: Dashboard → Item Marketplace → Browse Items\n\n📋 STEP-BY-STEP GUIDE:\n1. Browse items by category or search\n2. Click on any item to view details\n3. Select quantity, color, and size (if available)\n4. Click "Add to Cart"\n5. Continue shopping or go to cart\n6. Review items in cart\n7. Proceed to checkout\n8. Enter shipping address\n9. Select payment method\n10. Complete payment\n\n✅ You'll receive:\n• Order confirmation email\n• Tracking information\n• Estimated delivery date\n\n❓ Type "my cart" to view your cart items!`;
  }

  else if (msg === 'my cart' || msg === 'view my cart' || msg === 'shopping cart') {
    category = 'itemmarket';
    if (!userId) {
      response = `🛒 Please login to view your cart.\n\n📍 PATH: Login → Dashboard → My Cart\n\n🔐 Once logged in, you can view, update, and checkout your items.`;
    } else {
      const cart = await getUserItemCart(userId);
      if (cart && cart.items && cart.items.length > 0) {
        const cartItems = cart.items.map((item, index) => {
          const productPrice = item.discountedPrice || item.price;
          return `• ${item.name} x${item.quantity} - $${(productPrice * item.quantity).toFixed(2)}`;
        }).join('\n');
        response = `🛒 Your Shopping Cart:\n\n${cartItems}\n\n💰 SUBTOTAL: $${cart.totalAmount?.toFixed(2) || '0.00'}\n\n📍 TO CHECKOUT: Dashboard → Cart → Proceed to Checkout\n\n❓ Need help? Type "how to order items" for instructions!`;
      } else {
        response = `🛒 Your cart is empty!\n\n📦 TO ADD ITEMS:\n1. Browse marketplace (type "item marketplace")\n2. Click "Add to Cart" on products\n3. View your cart anytime with "my cart"\n\n🛍️ Start shopping now! Type "item marketplace" to see available products.`;
      }
    }
  }

  else if (msg === 'item categories' || msg === 'product categories') {
    category = 'itemmarket';
    const categories = await getItemCategories();
    response = `📂 Item Marketplace Categories:\n\n${categories.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n📊 TOTAL: ${categories.length} categories\n\n🛒 Type "item marketplace" to browse products in any category!`;
  }

  else if (msg === 'buy and sell items' || msg === 'buy sell marketplace') {
    category = 'buyandsell';
    const items = await getAllBuyAndSellItems();
    
    if (items.length > 0) {
      const itemsList = items.slice(0, 10).map(i => `• ${i.name} - $${i.price} - ${i.type} (${i.condition}) - ${i.status}`).join('\n');
      response = `💼 Buy & Sell - Second Hand Items:\n\n📊 ACTIVE LISTINGS: ${items.length}\n\n📦 LATEST ITEMS:\n${itemsList}\n\n📂 CATEGORIES: Doors, Windows, Pan-Light, Glass, Others\n\n❓ Type "how to sell items" to list your item or "how to buy second hand" to purchase!`;
    } else {
      response = `💼 No second hand items available yet.\n\n📝 BE THE FIRST TO SELL!\n📍 PATH: Dashboard → Buy & Sell → Add New Item\n\n✅ BENEFITS: Free listing, no commission, local buyers!\n\n❓ Type "how to sell items" to learn more!`;
    }
  }

  else if (msg === 'how to sell items' || msg === 'list item for sale') {
    category = 'buyandsell';
    response = `💼 How to Sell Items on Buy & Sell:\n\n📍 PATH: Dashboard → Buy & Sell → Add New Item\n\n📋 REQUIRED DETAILS:\n• Product name\n• Description\n• Price\n• Category (Doors, Windows, Pan-Light, Glass, Others)\n• Condition (New, Like New, Good, Fair, Poor)\n• Address for pickup\n• Phone number\n• Main image (required - JPG, PNG)\n• Additional images (up to 5 - optional)\n\n✅ YOUR ITEM WILL BE VISIBLE IMMEDIATELY!\n\n💡 TIPS FOR FASTER SALES:\n• Take clear, well-lit photos\n• Write detailed descriptions\n• Price competitively\n• Respond quickly to inquiries\n• Keep listing updated\n\n❓ Type "sell benefits" to learn advantages of selling on ALUX!`;
  }

  else if (msg === 'sell benefits' || msg === 'benefits of selling') {
    category = 'buyandsell';
    response = `✅ Benefits of Selling on ALUX:\n\n💰 FINANCIAL BENEFITS:\n✓ Free to list - No fees!\n✓ No commission - Keep 100%\n✓ No hidden charges\n✓ Quick payments\n\n👥 AUDIENCE BENEFITS:\n✓ Local buyers\n✓ Community focused\n✓ Verified users\n✓ High visibility\n\n📋 CONVENIENCE BENEFITS:\n✓ Easy listing process\n✓ Mobile friendly\n✓ Multiple photos\n✓ Instant publishing\n✓ Easy management\n\n📈 SALES BENEFITS:\n✓ Quick turnaround\n✓ Best prices\n✓ Repeat customers\n✓ No shipping - Local pickup\n\n📊 STATISTICS:\n• Average listing sells within 7 days\n• 500+ active users monthly\n• 90% seller satisfaction\n\n🚀 Start selling today! Type "how to sell items" to list your first product!`;
  }

  else if (msg === 'training program' || msg === 'aluminum training') {
    category = 'training';
    response = `🎓 ALUX Aluminum Training Program:\n\n📚 PROGRAM OVERVIEW:\nComprehensive training in aluminum recycling, processing, and sustainable management.\n\n🎯 PROGRAM BENEFITS:\n• Industry-recognized certification\n• Hands-on aluminum recycling training\n• Networking with industry professionals\n• Career placement assistance\n• Exclusive alumni events\n• 10% discount on future courses\n\n📖 TRAINING MODULES:\n1. Basic Aluminum Recycling (2 days) - $49\n2. Advanced Processing (5 days) - $199\n3. Sustainable Management (3 days) - $99\n4. Innovation Lab (ongoing) - $299\n\n🏆 CERTIFICATION:\n• ALUX Certified Recycler (Basic)\n• ALUX Advanced Processor (Advanced)\n• ALUX Sustainability Expert (Management)\n\n📅 Next session starts in 2 weeks!\n❓ Type "how to register for training" to enroll!`;
  }

  else if (msg === 'how to register for training' || msg === 'alumni registration') {
    category = 'training';
    response = `📝 How to Register for Training:\n\n📍 PATH: Dashboard → Alumni → Register Now\n\n📋 REQUIRED DETAILS:\n• Full name\n• ID number\n• Address\n• Birthday\n• Gender\n• Email address\n• Phone number\n• ID photo upload (JPG/PNG)\n• CV/Resume (optional - PDF/Word)\n\n📋 REGISTRATION PROCESS:\n1. Fill out registration form\n2. Upload required documents\n3. Submit application\n4. Wait for admin approval (24-48 hours)\n5. Receive welcome email upon approval\n\n⏳ STATUS TRACKING:\n• Pending - Application received\n• Approved - Welcome to ALUX Alumni!\n• Rejected - Contact support for details\n\n❓ Type "alumni benefits" to learn about membership advantages!`;
  }

  else if (msg === 'alumni benefits' || msg === 'training benefits') {
    category = 'training';
    response = `🎓 ALUX Alumni Benefits:\n\n🎓 PROFESSIONAL BENEFITS:\n✓ Industry-recognized certification\n✓ Priority job notifications\n✓ Exclusive workshops\n✓ Guest speaker events\n\n🤝 NETWORKING BENEFITS:\n✓ Connect with 500+ alumni\n✓ Industry meetups\n✓ Mentorship program\n✓ Collaboration opportunities\n\n📚 LEARNING BENEFITS:\n✓ Free quarterly webinars\n✓ Resource library access\n✓ Skill development courses\n✓ Latest industry trends\n\n💰 EXCLUSIVE DISCOUNTS:\n✓ 10% off future training\n✓ 15% off ALUX store products\n✓ Partner business offers\n✓ Event ticket discounts\n\n🌍 COMMUNITY BENEFITS:\n✓ Volunteer opportunities\n✓ Sustainability initiatives\n✓ Recycling awareness programs\n\nJoin our growing community of 500+ recycling professionals!`;
  }

  else if (msg === 'alux projects' || msg === 'view projects' || msg === 'project gallery') {
    category = 'projects';
    const projects = await getAllProjects();
    if (projects.length > 0) {
      const projectsList = projects.slice(0, 10).map(p => `• ${p.title} - ${p.projectType}${p.featured ? ' ⭐ Featured' : ''} - ${p.location || 'Location not specified'}`).join('\n');
      response = `📁 ALUX Projects Gallery:\n\n${projectsList}\n\n📊 TOTAL PROJECTS: ${projects.length}\n\n📍 TO VIEW DETAILS: Dashboard → Projects → View All\n\n❓ Type "project types" to see available categories!\n\n📤 Want to share your work? Type "upload project" to add your project!`;
    } else {
      response = `📁 No projects available yet.\n\n📤 BE THE FIRST TO SHARE!\n📍 PATH: Dashboard → Projects → Add New Project\n\n❓ Type "upload project" to learn what details to include!`;
    }
  }

  else if (msg === 'upload project' || msg === 'add project' || msg === 'share project') {
    category = 'projects';
    response = `📤 How to Upload a Project:\n\n📍 PATH: Dashboard → Projects → Add New Project\n\n📋 REQUIRED DETAILS:\n• Project title (required)\n• Description (required)\n• Project type (required)\n• Location (required)\n• Project date (required)\n• Cover image (required - JPG/PNG)\n• Gallery images (up to 10 - optional)\n\n📂 AVAILABLE PROJECT TYPES:\n1. Aluminum Doors\n2. Aluminum Windows\n3. Aluminum Pantry Cupboards\n4. Sivilims (Structural Glazing)\n5. Other Custom Work\n\n🎯 PROJECT PURPOSE:\n• Showcase your aluminum work\n• Inspire other community members\n• Build your professional portfolio\n• Gain recognition\n• Get featured on ALUX homepage\n\n✅ Projects get reviewed within 24 hours!\n\n❓ Type "project types" to see categories in detail!`;
  }

  else if (msg === 'project types' || msg === 'what project types') {
    category = 'projects';
    response = `📂 ALUX Project Types:\n\n🏠 1. Aluminum Doors\n   • Sliding doors, French doors, Commercial doors\n\n🪟 2. Aluminum Windows\n   • Casement windows, Sliding windows, Full house aluminum\n\n🗄️ 3. Aluminum Pantry Cupboards\n   • Kitchen cabinets, Storage units, Pantry organizers\n\n🏗️ 4. Sivilims (Structural Glazing)\n   • Curtain walls, Facade systems, Skylights\n\n🔧 5. Other Custom Work\n   • Railings, Partitions, Aluminum furniture\n\n📋 PROJECT REQUIREMENTS:\n• Clear title and description\n• Quality photos (cover + gallery)\n• Location and date\n\n✨ Featured projects get promoted on homepage and social media!\n\n❓ Type "upload project" to share your work!`;
  }

  else if (msg === 'hello' || msg === 'hi' || msg === 'hey') {
    category = 'menu';
    response = `👋 Hello! I'm ALUX AI.\n\n💡 I can help with:\n\n💰 Prices & Materials\n📅 Book Pickup\n🥤 Glass Orders\n📋 My Quotes\n🛒 Item Marketplace\n💼 Buy & Sell\n🎓 Training Program\n📁 ALUX Projects\n\n❓ What would you like to know? Type "help" for complete command list!`;
  }

  else if (msg === 'help' || msg === 'what can you do') {
    category = 'menu';
    response = `💡 ALUX AI Help Center\n\n💰 PRICES & MATERIALS:\n• "What is the price per kg?"\n• "price aluminum cans"\n• "What materials are accepted?"\n\n📅 BOOKINGS:\n• "How do I book a pickup?"\n• "Book now"\n• "My bookings"\n• "Available dates"\n• "What areas do you cover?"\n\n🥤 GLASS ORDERS:\n• "Glass prices"\n• "How to order glass"\n• "Glass transport charges"\n• "My glass orders"\n\n📋 QUOTATIONS:\n• "My quotes"\n• "How to request a quote"\n• "Quotation request details"\n\n🛒 ITEM MARKETPLACE:\n• "Item marketplace"\n• "How to order items"\n• "My cart"\n• "Item categories"\n\n💼 BUY & SELL:\n• "Buy and sell items"\n• "How to sell items"\n• "Sell benefits"\n\n🎓 TRAINING:\n• "Training program"\n• "How to register for training"\n• "Alumni benefits"\n\n📁 PROJECTS:\n• "ALUX Projects"\n• "Upload project"\n• "Project types"\n\n📞 CONTACT: +94 72 104 6048\n\nJust type your question naturally!`;
  }

  else {
    category = 'normal';
    response = getNormalAIResponse(message, userName);
  }

  await saveConversation(userId, sessionId, message, response, role, category);
  return { response, category };
}

router.post('/query', async (req, res) => {
  const { message, userRole = 'client', userId = null, sessionId = null, userEmail = null } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const result = await processUserMessage(message, userRole, userId, sessionId || `session_${Date.now()}`, userEmail);
    
    let suggestedQuestions = [];
    
    if (result.category === 'price') {
      suggestedQuestions = ["What is the price per kg?", "price aluminum cans", "price aluminum windows", "price aluminum doors"];
    } 
    else if (result.category === 'booking') {
      suggestedQuestions = ["How do I book a pickup?", "Book now", "My bookings", "Available dates", "What areas do you cover?"];
    }
    else if (result.category === 'materials') {
      suggestedQuestions = ["What materials are accepted?", "Can I recycle aluminum foil?", "Are aluminum windows accepted?", "What is NOT accepted?"];
    }
    else if (result.category === 'areas') {
      suggestedQuestions = ["What areas do you cover?", "Find collection locations", "Where to drop off scrap?", "Service areas near me"];
    }
    else if (result.category === 'glass') {
      suggestedQuestions = ["Glass prices", "How to order glass", "Glass transport charges", "Glass navigation path", "My glass orders"];
    }
    else if (result.category === 'quotes') {
      suggestedQuestions = ["My quotes", "How to request a quote", "Quotation request details"];
    }
    else if (result.category === 'itemmarket') {
      suggestedQuestions = ["Item marketplace", "How to order items", "My cart", "Item categories"];
    }
    else if (result.category === 'buyandsell') {
      suggestedQuestions = ["Buy and sell items", "How to sell items", "Sell benefits"];
    }
    else if (result.category === 'training') {
      suggestedQuestions = ["Training program", "How to register for training", "Alumni benefits"];
    }
    else if (result.category === 'projects') {
      suggestedQuestions = ["ALUX Projects", "Upload project", "Project types"];
    }
    else if (result.category === 'menu') {
      suggestedQuestions = ["What is the price per kg?", "How do I book a pickup?", "Glass prices", "Item marketplace", "Training program", "ALUX Projects"];
    }
    else {
      suggestedQuestions = ["What is the price per kg?", "How do I book a pickup?", "Glass prices", "Item marketplace", "Buy and sell items", "ALUX Projects", "Training program"];
    }

    res.json({ response: result.response, roleDetected: userRole, suggestedQuestions, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ response: "Sorry, I'm having trouble. Please try again.", suggestedQuestions: [] });
  }
});

router.post('/book', async (req, res) => {
  const { date, timeSlot, address, weight, material, userName, userEmail, userPhone, userId } = req.body;

  if (!date || !timeSlot || !address) {
    return res.status(400).json({ error: 'Date, timeSlot, and address required' });
  }

  const availableDates = getAvailableDates();
  const dateExists = availableDates.some(d => d.date === date);
  if (!dateExists) {
    return res.status(400).json({ error: 'Selected date not available' });
  }

  if (!timeSlots.includes(timeSlot)) {
    return res.status(400).json({ error: 'Selected time slot not available' });
  }

  const bookingCode = `ALUX${Date.now()}${Math.floor(Math.random() * 1000)}`;

  try {
    const bookingData = {
      bookingId: bookingCode,
      selectedDate: new Date(date),
      timeSlotId: timeSlot,
      serviceAreaId: 'default',
      pickupLocation: address,
      contactDetails: { name: userName || 'Guest', email: userEmail || '', phone: userPhone || '' },
      status: 'confirmed',
      estimatedWeight: weight || 0
    };
    if (userId) bookingData.userId = userId;

    await Booking.create(bookingData);

    let estimatedPrice = 0;
    if (weight) {
      const priceData = await ScrapPrice.findOne({ material: { $regex: material || 'mixed', $options: 'i' } });
      if (priceData) estimatedPrice = weight * priceData.price;
      else estimatedPrice = weight * 1.20;
    }

    res.json({
      success: true,
      booking: { id: bookingCode, date, timeSlot, address, weight, material, status: 'confirmed' },
      estimatedPayout: estimatedPrice > 0 ? `$${estimatedPrice.toFixed(2)}` : 'Calculated at pickup',
      nextSteps: "Our driver will arrive within 30 minutes of your time slot. Please have your scrap ready!"
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

router.get('/prices', async (req, res) => {
  try {
    const prices = await ScrapPrice.find({});
    if (prices.length > 0) {
      res.json({ prices, lastUpdated: new Date().toISOString() });
    } else {
      const scrapTypes = await ScrapType.find({ isActive: true });
      res.json({ prices: scrapTypes, lastUpdated: new Date().toISOString() });
    }
  } catch (error) {
    res.json({ prices: [], lastUpdated: new Date().toISOString() });
  }
});

router.get('/areas', async (req, res) => {
  try {
    const areas = await ServiceArea.find({ isActive: true });
    res.json({ areas });
  } catch (error) {
    const defaultAreas = ['Downtown', 'Westside', 'Eastside', 'North Industrial Park', 'South Residential', 'Green Valley'];
    res.json({ areas: defaultAreas.map(city => ({ city, pickupFee: 0 })) });
  }
});

router.get('/slots', (req, res) => {
  res.json({ availableDates: getAvailableDates(), timeSlots });
});

router.get('/stats', async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const totalPrices = await ScrapPrice.countDocuments();
  const totalItems = await Item.countDocuments();
  const totalBuySell = await BuyAndSellItem.countDocuments();
  res.json({ success: true, data: { totalBookings, totalPrices, totalItems, totalBuySell } });
});

router.get('/marketplace-items', async (req, res) => {
  try {
    const items = await Item.find({ inStock: true }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: items });
  } catch (error) {
    res.json({ success: false, data: [] });
  }
});

router.get('/buy-sell-items', async (req, res) => {
  try {
    const items = await BuyAndSellItem.find({ status: 'active' }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: items });
  } catch (error) {
    res.json({ success: false, data: [] });
  }
});

module.exports = router;