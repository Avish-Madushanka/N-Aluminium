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
    return scrapTypes;
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
      const priceList = allPrices.slice(0, 8).map(p => `• ${p.material || p.name}: $${p.price} ${p.unit || 'USD/kg'}`).join('\n');
      response = `Current Scrap Prices (USD/kg):\n\n${priceList}`;
    } else {
      response = `Current Scrap Prices (USD/kg):\n\n• Aluminum cans: $1.20\n• Aluminum windows: $1.50\n• Aluminum doors: $1.40\n• Aluminum sheets: $1.30\n• Mixed aluminum: $1.00\n• Cast aluminum: $0.90`;
    }
  }

  else if (msg.includes('price') && msg !== 'what is the price per kg?' && msg !== 'price per kg' && msg !== 'check prices' && msg !== 'scrap prices' && msg !== 'price') {
    category = 'price';
    const materialMatch = msg.replace('price', '').trim();
    if (materialMatch && materialMatch.length > 2) {
      const estimate = await getPriceEstimate(materialMatch);
      if (estimate.found) {
        const priceValue = estimate.data.price;
        const unitValue = estimate.data.unit || 'USD/kg';
        const nameValue = estimate.data.material || estimate.data.name;
        response = `${nameValue}: $${priceValue} ${unitValue}`;
      } else {
        response = `Sorry, I couldn't find pricing for "${materialMatch}". Try: aluminum cans, aluminum windows, aluminum doors, aluminum sheets, mixed aluminum, or cast aluminum.`;
      }
    } else {
      response = `Please specify a material. Example: "price aluminum cans"`;
    }
  }

  else if (msg === 'how do i book a pickup?' || msg === 'booking guide' || msg === 'how to book') {
    category = 'booking';
    const dates = getAvailableDates();
    response = `How to Book a Pickup:\n\nPath: Dashboard → Book Pickup → Schedule New Pickup\n\nSteps:\n1. Login to your ALUX account\n2. Click "Book Pickup"\n3. Enter your pickup address\n4. Choose date: ${dates.slice(0, 3).map(d => d.display).join(', ')}\n5. Select time: ${timeSlots.join(', ')}\n6. Enter scrap type and weight\n7. Confirm booking\n\nFree pickup for 50kg+ orders!`;
  }

  else if (msg === 'book now' || msg === 'booknow' || msg === 'start booking') {
    category = 'booking';
    const dates = getAvailableDates();
    response = `Book Your Pickup:\n\nPath: Dashboard → Book Pickup → Schedule New Pickup\n\nAvailable Dates:\n${dates.slice(0, 7).map(d => `• ${d.display}`).join('\n')}\n\nTime Slots: ${timeSlots.join(', ')}\n\nTo book, go to Dashboard → Book Pickup or provide your address, weight, and material type.`;
  }

  else if (msg === 'my bookings' || msg === 'my booking' || msg === 'my pickups') {
    category = 'booking';
    if (!userId) {
      response = `Please login to view your bookings. Path: Login → Dashboard → My Bookings`;
    } else {
      const userBookings = await getUserBookingsFromDB(userId);
      if (userBookings.length > 0) {
        let bookingsList = userBookings.map((b, index) => {
          const bookingDate = b.selectedDate ? new Date(b.selectedDate).toLocaleDateString() : 'Date TBD';
          return `${index + 1}. ${b.bookingId || 'Booking'} - ${bookingDate} at ${b.timeSlotId || 'Time TBD'} - ${b.status.toUpperCase()}`;
        }).join('\n');
        response = `Your Bookings:\n\n${bookingsList}\n\nTo modify or cancel, go to Dashboard → My Bookings → Select booking → Edit/Cancel`;
      } else {
        response = `You don't have any bookings yet. To book a pickup: Dashboard → Book Pickup → Schedule New Pickup`;
      }
    }
  }

  else if (msg === 'available dates' || msg === 'pickup dates' || msg === 'what dates are available') {
    category = 'booking';
    const dates = getAvailableDates();
    response = `Available Pickup Dates:\n\n${dates.slice(0, 10).map(d => `• ${d.display} - ${timeSlots.join(', ')}`).join('\n')}\n\nTo book, go to Dashboard → Book Pickup`;
  }

  else if (msg === 'what materials are accepted?' || msg === 'accepted materials' || msg === 'what can i recycle') {
    category = 'materials';
    response = `Accepted Aluminum Materials:\n\n• Aluminum cans (beverage) - $1.20/kg\n• Aluminum windows (frames only) - $1.50/kg\n• Aluminum doors (without hinges) - $1.40/kg\n• Aluminum sheets (clean) - $1.30/kg\n• Aluminum siding - $1.30/kg\n• Aluminum gutters - $1.30/kg\n• Aluminum foil (clean, balled) - $0.85/kg\n• Aluminum rims - $1.60/kg\n• Cast aluminum - $0.90/kg\n\nNot accepted: Items with plastic/wood, contaminated with oil/paint, mixed metals, aerosol cans.`;
  }

  else if (msg === 'what areas do you cover?' || msg === 'service areas' || msg === 'coverage') {
    category = 'areas';
    response = `Service Areas & Collection Locations:\n\nPath: Home → Services → Scraps Collection → Find Collection Locations\n\nActive Service Areas:\n• Downtown - Free pickup\n• Westside - $5 fee\n• Eastside - $5 fee\n• North Industrial Park - Free pickup\n• South Residential - $8 fee\n• Green Valley - $10 fee\n\nFree pickup for 50kg+ orders. Small quantity fee applies under 50kg.`;
  }

  else if (msg === 'find collection locations' || msg === 'collection locations' || msg === 'where to drop off') {
    category = 'areas';
    response = `Find Collection Locations:\n\nPath: Home → Services → Scraps Collection → Find Collection Locations\n\nMain Location:\nALUX Panadura\nAlubomulla, Panadura, Sri Lanka\nPhone: +94 72 104 6048`;
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
      response = `Glass Prices (USD per sq ft):\n${glassList}\n\nPrices vary by thickness and quality. Contact us for bulk order discounts!`;
    } else {
      response = `Glass Prices (USD per sq ft):\n\n• Clear Float Glass: 4mm-$130, 6mm-$210, 8mm-$290, 10mm-$350, 12mm-$500\n• Tempered Glass: 5mm-$375, 6mm-$450, 8mm-$540, 12mm-$630\n• Laminated Glass: 10mm-$500, 15mm-$900, 20mm-$1400\n• Tinted Glass: 4mm-$370, 6mm-$450, 8mm-$600\n\nStandard vs Premium quality options available.`;
    }
  }

  else if (msg === 'how to order glass' || msg === 'place glass order' || msg === 'glass ordering guide') {
    category = 'glass';
    response = `How to Order Glass:\n\nPath: Dashboard → Glass Order → Place New Order\n\nStep-by-Step Guide:\n1. Select glass type (Clear Float, Tempered, Laminated, Tinted)\n2. Choose quality (Standard or Premium)\n3. Enter width and height in feet\n4. Select quantity\n5. System calculates area (sq ft) and price\n6. Choose pickup or delivery\n7. For delivery: Enter delivery address\n8. Review order summary\n9. Select payment method\n10. Complete payment\n\nYou'll receive order confirmation email with tracking!`;
  }

  else if (msg === 'glass transport charges' || msg === 'glass delivery cost' || msg === 'how much for glass delivery') {
    category = 'glass';
    response = `Glass Transport Charges:\n\nDelivery Fee Structure:\n• First 5 kilometers: ${transportRates.first5km} ${transportRates.currency}\n• Each additional kilometer: ${transportRates.additionalKm} ${transportRates.currency}\n\nExample Calculations:\n• 5km delivery = ${transportRates.first5km} ${transportRates.currency}\n• 10km delivery = ${transportRates.first5km + (5 * transportRates.additionalKm)} ${transportRates.currency}\n• 20km delivery = ${transportRates.first5km + (15 * transportRates.additionalKm)} ${transportRates.currency}\n\nAdditional Charges:\n• Urgent delivery: +25% of base fare\n• Insurance: 2% of glass value (optional)\n\nFree pickup available from our store location!`;
  }

  else if (msg === 'glass navigation path' || msg === 'glass ordering path') {
    category = 'glass';
    response = `Glass Order Navigation Path:\n\nHome Page → Glass Order → Select Product → Enter Dimensions → Checkout → Payment\n\nDashboard Access:\nLogin → Dashboard → Glass Orders → Place New Order\n\nNeed help? Contact +94 72 104 6048`;
  }

  else if (msg === 'my glass orders' || msg === 'track my glass orders') {
    category = 'glass';
    const glassOrders = await getUserGlassOrders(userId, userEmail);
    if (glassOrders.length > 0) {
      let ordersList = glassOrders.map(order => {
        const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown';
        const itemCount = order.items ? order.items.length : 0;
        return `• ${order.orderId} - ${orderDate} - ${itemCount} items - ${order.status.toUpperCase()} - $${(order.grandTotal || 0).toFixed(2)}`;
      }).join('\n');
      response = `Your Glass Orders:\n\n${ordersList}\n\nStatus Flow: pending → processing → dispatched → ontheway → delivered`;
    } else {
      response = `You don't have any glass orders yet. To place an order: Dashboard → Glass Order → Place New Order`;
    }
  }

  else if (msg === 'my quotes' || msg === 'my quotations' || msg === 'view my quotes') {
    category = 'quotes';
    const aluQuotations = await getUserQuotations(userId, userEmail);
    const itemQuotations = await getUserItemQuotations(userId);
    
    if (aluQuotations.length > 0 || itemQuotations.length > 0) {
      let quotesList = '';
      if (aluQuotations.length > 0) {
        quotesList += '\nAluminum Quotations:\n';
        quotesList += aluQuotations.map(q => `• ${q.quotationId || 'Quote'} - ${q.projectTitle?.substring(0, 30)} - ${q.status}${q.quotedPrice ? ` - $${q.quotedPrice}` : ''}`).join('\n');
      }
      if (itemQuotations.length > 0) {
        quotesList += '\n\nProduct Quotations:\n';
        quotesList += itemQuotations.map(q => `• ${q.quotationId || 'Quote'} - ${q.items?.length || 0} items - ${q.status} - $${(q.totalAmount || 0).toFixed(2)}`).join('\n');
      }
      response = `Your Quotations:\n${quotesList}\n\nStatus: Pending → Reviewed → Quoted → Approved`;
    } else {
      response = `You don't have any quotations yet. To request a quote: Dashboard → Aluminum Quotation System → New Request`;
    }
  }

  else if (msg === 'how to request a quote' || msg === 'send quotation request' || msg === 'get a quote') {
    category = 'quotes';
    response = `How to Request a Quotation:\n\nPath: Dashboard → Aluminum Quotation System → New Request\n\nRequired Details:\n• Full name\n• Email address\n• Phone number\n• Project title and description\n• Material type\n• Color preference\n• Upload files (JPG, PNG, PDF - up to 5MB)\n\nYou'll receive a price quote within 24-48 hours via email.`;
  }

  else if (msg === 'quotation request details' || msg === 'what details for quotation') {
    category = 'quotes';
    response = `Quotation Request Details:\n\nRequired Information:\n• Full name\n• Email address\n• Phone number\n• Project title\n• Project description\n• Material type (aluminum type)\n• Color preference\n• Files/images (up to 10 files, max 5MB each)\n\nTips for faster quotes: Include clear images and detailed descriptions!`;
  }

  else if (msg === 'item marketplace' || msg === 'item market' || msg === 'marketplace items' || msg === 'shop items') {
    category = 'itemmarket';
    const items = await getAllItemMarketplaceItems();
    const categories = await getItemCategories();
    
    if (items.length > 0) {
      const itemsList = items.slice(0, 10).map(i => `• ${i.name} - $${i.price}/${i.unit} - ${i.category} - ${i.inStock ? 'In Stock' : 'Out of Stock'}${i.featured ? ' ⭐' : ''}`).join('\n');
      response = `🛒 Item Marketplace:\n\nAvailable Categories:\n${categories.slice(0, 10).map(c => `• ${c}`).join(', ')}\n\nLatest Items:\n${itemsList}\n\nTotal Items: ${items.length}\n\nTo view more: Dashboard → Item Marketplace → Browse All\n\nType "how to order items" to learn how to purchase!`;
    } else {
      response = `No items available in marketplace yet.\n\nCategories available: ${(await getItemCategories()).slice(0, 10).join(', ')}\n\nCheck back soon for new products!`;
    }
  }

  else if (msg === 'how to order items' || msg === 'order from marketplace' || msg === 'buy items') {
    category = 'itemmarket';
    response = `How to Order Items from Marketplace:\n\nPath: Dashboard → Item Marketplace → Browse Items\n\nStep-by-Step Guide:\n1. Browse items by category or search\n2. Click on any item to view details\n3. Select quantity, color, and size (if available)\n4. Click "Add to Cart"\n5. Continue shopping or go to cart\n6. Review items in cart\n7. Proceed to checkout\n8. Enter shipping address\n9. Select payment method\n10. Complete payment\n\nYou'll receive order confirmation and tracking information via email!`;
  }

  else if (msg === 'my cart' || msg === 'view my cart' || msg === 'shopping cart') {
    category = 'itemmarket';
    if (!userId) {
      response = `Please login to view your cart. Path: Login → Dashboard → My Cart`;
    } else {
      const cart = await getUserItemCart(userId);
      if (cart && cart.items && cart.items.length > 0) {
        const cartItems = cart.items.map((item, index) => {
          const productPrice = item.discountedPrice || item.price;
          return `• ${item.name} x${item.quantity} - $${(productPrice * item.quantity).toFixed(2)}`;
        }).join('\n');
        response = `Your Shopping Cart:\n\n${cartItems}\n\nSubtotal: $${cart.totalAmount?.toFixed(2) || '0.00'}\n\nTo checkout: Dashboard → Cart → Proceed to Checkout`;
      } else {
        response = `Your cart is empty. Browse items: Dashboard → Item Marketplace → Browse All`;
      }
    }
  }

  else if (msg === 'item categories' || msg === 'product categories') {
    category = 'itemmarket';
    const categories = await getItemCategories();
    response = `Item Marketplace Categories:\n\n${categories.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nTotal: ${categories.length} categories\n\nType "item marketplace" to browse products in any category!`;
  }

  else if (msg === 'buy and sell items' || msg === 'buy sell marketplace' || msg === 'second hand items') {
    category = 'buyandsell';
    const items = await getAllBuyAndSellItems();
    
    if (items.length > 0) {
      const itemsList = items.slice(0, 10).map(i => `• ${i.name} - $${i.price} - ${i.type} (${i.condition})`).join('\n');
      response = `Buy & Sell Second Hand Items:\n\nActive Listings: ${items.length}\n\nLatest Items:\n${itemsList}\n\nCategories: Doors, Windows, Pan-Light, Glass, Others\n\nType "how to sell items" to list your item or "how to buy second hand" to purchase!`;
    } else {
      response = `No second hand items available yet.\n\nBe the first to sell! Path: Dashboard → Buy & Sell → Add New Item\n\nBenefits: Free listing, no commission, local buyers!`;
    }
  }

  else if (msg === 'how to sell items' || msg === 'list item for sale' || msg === 'sell second hand') {
    category = 'buyandsell';
    response = `How to Sell Items on Buy & Sell:\n\nPath: Dashboard → Buy & Sell → Add New Item\n\nRequired Details:\n• Product name\n• Description\n• Price\n• Category (Doors, Windows, Pan-Light, Glass, Others)\n• Condition (New, Like New, Good, Fair, Poor)\n• Address for pickup\n• Phone number\n• Main image (required)\n• Additional images (up to 5)\n\nYour item will be visible to all users immediately!\n\nTips: Clear photos and detailed descriptions sell faster!`;
  }

  else if (msg === 'how to buy second hand' || msg === 'buy used items') {
    category = 'buyandsell';
    response = `How to Buy Second Hand Items:\n\nPath: Dashboard → Buy & Sell → Browse Items\n\nSteps:\n1. Browse available items by category\n2. Click on item to view details\n3. Contact seller using provided phone number\n4. Negotiate price if needed\n5. Arrange pickup or delivery\n6. Inspect item before payment\n7. Complete payment directly with seller\n\nNote: ALUX connects buyers and sellers. Payment is between both parties.`;
  }

  else if (msg === 'my listings' || msg === 'my sell items') {
    category = 'buyandsell';
    if (!userId) {
      response = `Please login to view your listings. Path: Login → Dashboard → My Listings`;
    } else {
      const userItems = await getUserBuyAndSellItems(userId);
      if (userItems.length > 0) {
        const itemsList = userItems.map((i, idx) => `• ${i.name} - $${i.price} - ${i.status} - ${i.type}`).join('\n');
        response = `Your Sell Listings:\n\n${itemsList}\n\nTo add more: Dashboard → Buy & Sell → Add New Item`;
      } else {
        response = `You don't have any listings yet. To sell: Dashboard → Buy & Sell → Add New Item`;
      }
    }
  }

  else if (msg === 'sell benefits' || msg === 'benefits of selling') {
    category = 'buyandsell';
    response = `Benefits of Selling on ALUX:\n\n💰 Free to list - No fees!\n✓ No commission - Keep 100%\n✓ Local buyers - Community focused\n✓ Easy process - Simple form\n✓ Quick sales - Fast turnaround\n✓ No shipping - Local pickup only\n\nStart selling today! Type "how to sell items" to list your first product!`;
  }

  else if (msg === 'training program' || msg === 'aluminum training' || msg === 'alumni training') {
    category = 'training';
    response = `ALUX Aluminum Training Program:\n\nProgram Benefits:\n• Industry certification\n• Hands-on training\n• Networking opportunities\n• Career placement assistance\n• Exclusive alumni events\n\nTraining Modules:\n1. Basic Aluminum Recycling (2 days) - $49\n2. Advanced Processing (5 days) - $199\n3. Sustainable Management (3 days) - $99\n4. Innovation Lab (ongoing) - $299\n\nNext session starts in 2 weeks! Type "how to register for training" to enroll.`;
  }

  else if (msg === 'how to register for training' || msg === 'alumni registration') {
    category = 'training';
    response = `How to Register for Training:\n\nPath: Dashboard → Alumni → Register Now\n\nRequired Details:\n• Full name\n• ID number\n• Address\n• Birthday\n• Gender\n• Email address\n• Phone number\n• ID photo upload (JPG/PNG)\n• CV/Resume (optional)\n\nProcess: Submit → Pending Review → Approved → Welcome Email\n\nType "alumni benefits" to learn about membership advantages!`;
  }

  else if (msg === 'alumni benefits' || msg === 'training benefits') {
    category = 'training';
    response = `ALUX Alumni Benefits:\n\n🎓 Professional:\n• Industry certification\n• Priority job notifications\n• Exclusive workshops\n\n🤝 Networking:\n• Connect with 500+ alumni\n• Industry meetups\n• Mentorship program\n\n💰 Discounts:\n• 10% off future training\n• Partner business offers\n\nJoin our growing community of recycling professionals!`;
  }

  else if (msg === 'alux projects' || msg === 'view projects' || msg === 'project gallery') {
    category = 'projects';
    const projects = await getAllProjects();
    if (projects.length > 0) {
      const projectsList = projects.slice(0, 10).map(p => `• ${p.title} - ${p.projectType}${p.featured ? ' ⭐ Featured' : ''}`).join('\n');
      response = `ALUX Projects Gallery:\n\n${projectsList}\n\nTotal Projects: ${projects.length}\n\nType "upload project" to share your work or "project types" to see categories!`;
    } else {
      response = `No projects available yet. Be the first to share your aluminum project! Path: Dashboard → Projects → Add New Project`;
    }
  }

  else if (msg === 'upload project' || msg === 'add project' || msg === 'share project') {
    category = 'projects';
    response = `How to Upload a Project:\n\nPath: Dashboard → Projects → Add New Project\n\nRequired Details:\n• Project title\n• Description\n• Project type\n• Location\n• Project date\n• Cover image\n• Gallery images (up to 10)\n\nProject Types: Aluminum Doors, Aluminum Windows, Aluminum Pantry Cupboards, Sivilims, Other\n\nPurpose: Showcase your work, inspire others, build portfolio, get featured!`;
  }

  else if (msg === 'project types' || msg === 'what project types') {
    category = 'projects';
    response = `ALUX Project Types:\n\n1. Aluminum Doors\n2. Aluminum Windows\n3. Aluminum Pantry Cupboards\n4. Sivilims (Structural Glazing)\n5. Other Custom Work\n\nChoose your project type when uploading to help others find your work!`;
  }

  else if (msg === 'hello' || msg === 'hi' || msg === 'hey') {
    category = 'menu';
    response = `Hello! I'm ALUX AI. I can help with:\n\n💰 Prices\n📅 Book Pickup\n🥤 Glass Orders\n📋 My Quotes\n🛒 Item Marketplace\n💼 Buy & Sell\n🎓 Training Program\n📁 ALUX Projects\n\nWhat would you like to know?`;
  }

  else if (msg === 'help' || msg === 'what can you do') {
    category = 'menu';
    response = `I can help with:\n\n1. What is the price per kg?\n2. How do I book a pickup?\n3. Book now\n4. My bookings\n5. Available dates\n6. What materials are accepted?\n7. What areas do you cover?\n8. Glass prices\n9. How to order glass\n10. Glass transport charges\n11. My glass orders\n12. My quotes\n13. Item marketplace\n14. How to order items\n15. My cart\n16. Item categories\n17. Buy and sell items\n18. How to sell items\n19. My listings\n20. Training program\n21. How to register for training\n22. Alumni benefits\n23. ALUX Projects\n24. Upload project\n25. Project types\n\nJust type your question!`;
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
      suggestedQuestions = ["What is the price per kg?", "price aluminum cans", "price aluminum windows"];
    } 
    else if (result.category === 'booking') {
      suggestedQuestions = ["How do I book a pickup?", "Book now", "My bookings", "Available dates"];
    }
    else if (result.category === 'materials') {
      suggestedQuestions = ["What materials are accepted?", "Can I recycle aluminum foil?"];
    }
    else if (result.category === 'areas') {
      suggestedQuestions = ["What areas do you cover?", "Find collection locations"];
    }
    else if (result.category === 'glass') {
      suggestedQuestions = ["Glass prices", "How to order glass", "Glass transport charges", "My glass orders"];
    }
    else if (result.category === 'quotes') {
      suggestedQuestions = ["My quotes", "How to request a quote", "Quotation request details"];
    }
    else if (result.category === 'itemmarket') {
      suggestedQuestions = ["Item marketplace", "How to order items", "My cart", "Item categories"];
    }
    else if (result.category === 'buyandsell') {
      suggestedQuestions = ["Buy and sell items", "How to sell items", "My listings", "Sell benefits"];
    }
    else if (result.category === 'training') {
      suggestedQuestions = ["Training program", "How to register for training", "Alumni benefits"];
    }
    else if (result.category === 'projects') {
      suggestedQuestions = ["ALUX Projects", "Upload project", "Project types"];
    }
    else if (result.category === 'menu') {
      suggestedQuestions = ["What is the price per kg?", "How do I book a pickup?", "Glass prices", "Item marketplace", "Training program"];
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
      nextSteps: "Our driver will arrive within 30 min of your time slot."
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