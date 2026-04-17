const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

const aluQuotationSchema = new mongoose.Schema({
  quotationId: { type: String, unique: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  projectTitle: { type: String, required: true, trim: true },
  projectDescription: { type: String, required: true, trim: true },
  materialType: { type: String, required: true },
  color: { type: String, required: true },
  files: [fileSchema],
  status: { type: String, enum: ['Pending', 'Reviewed', 'Quoted'], default: 'Pending' },
  quotedPrice: { type: Number, min: 0, default: null },
  adminNotes: { type: String, default: '' },
  adminFiles: [fileSchema],
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

aluQuotationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isNew && !this.quotationId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.quotationId = `ALQ-${year}${month}${day}-${random}`;
  }
  next();
});

module.exports = mongoose.model('AluQuotation', aluQuotationSchema);