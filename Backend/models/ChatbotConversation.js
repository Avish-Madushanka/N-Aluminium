const mongoose = require('mongoose');

const chatbotConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String },
  userMessage: { type: String, required: true },
  botResponse: { type: String, required: true },
  roleDetected: { type: String, default: 'client' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatbotConversation', chatbotConversationSchema);