const AluQuotation = require('../models/AluQuotation');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/quotations');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const saveFile = async (file, prefix = 'client') => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()  * 1E9);
  const ext = path.extname(file.originalname);
  const filename = `${prefix}-${uniqueSuffix}${ext}`;
  const filepath = path.join(uploadDir, filename);
  
  fs.writeFileSync(filepath, file.buffer);
  
  return {
    name: file.originalname,
    url: `/uploads/quotations/${filename}`,
    mimetype: file.mimetype,
    size: file.size
  };
};

const deleteFileFromDisk = (url) => {
  if (!url) return;
  const filename = path.basename(url);
  const filepath = path.join(uploadDir, filename);
  if (fs.existsSync(filepath)) {
    try {
      fs.unlinkSync(filepath);
    } catch (err) {
      console.error(`Error deleting file: ${err.message}`);
    }
  }
};

exports.createQuotationRequest = async (req, res) => {
  try {
    console.log('=== CREATE QUOTATION REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files ? req.files.length : 0);
    console.log('Request user:', req.user);
    console.log('User email from token:', req.user.email);

    const { fullName, email, phone, projectTitle, projectDescription, materialType, color } = req.body;

    const userEmail = req.user.email || email;

    const validationErrors = {};
    if (!fullName) validationErrors.fullName = 'Full name is required';
    if (!userEmail) validationErrors.email = 'Email is required';
    if (!phone) validationErrors.phone = 'Phone is required';
    if (!projectTitle) validationErrors.projectTitle = 'Project title is required';
    if (!projectDescription) validationErrors.projectDescription = 'Project description is required';
    if (!materialType) validationErrors.materialType = 'Material type is required';
    if (!color) validationErrors.color = 'Color is required';
    
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: validationErrors });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one file is required' });
    }

    const savedFiles = [];
    for (const file of req.files) {
      const savedFile = await saveFile(file, 'client');
      savedFiles.push(savedFile);
    }

    const quotation = new AluQuotation({
      fullName: fullName.trim(),
      email: userEmail.toLowerCase().trim(),
      phone: phone.trim(),
      projectTitle: projectTitle.trim(),
      projectDescription: projectDescription.trim(),
      materialType: materialType,
      color: color,
      files: savedFiles,
      status: 'Pending'
    });

    await quotation.save();
    console.log('Quotation saved successfully:', quotation._id);
    console.log('Saved with email:', quotation.email);

    res.status(201).json({
      success: true,
      message: 'Quotation request submitted successfully',
      data: quotation
    });
  } catch (error) {
    console.error('Create quotation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyQuotationRequests = async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log('=== GET MY REQUESTS ===');
    console.log('User email from token:', userEmail);
    console.log('User role:', req.user.role);
    console.log('User ID:', req.user._id);
    
    const requests = await AluQuotation.find({ email: userEmail.toLowerCase() })
      .sort({ submittedAt: -1 });

    console.log(`Found ${requests.length} requests for email: ${userEmail}`);
    console.log('Requests:', requests.map(r => ({ id: r._id, title: r.projectTitle, email: r.email, status: r.status })));

    res.status(200).json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllQuotationRequests = async (req, res) => {
  try {
    console.log('=== GET ALL REQUESTS ===');
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const requests = await AluQuotation.find(query)
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await AluQuotation.countDocuments(query);
    
    console.log(`Found ${requests.length} total requests`);

    res.status(200).json({
      success: true,
      data: requests,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuotationRequestById = async (req, res) => {
  try {
    const request = await AluQuotation.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (req.user.role !== 'admin' && request.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quotedPrice, adminNotes } = req.body;
    
    console.log('Updating quotation:', id);
    console.log('Update data:', { status, quotedPrice, adminNotes });
    
    const request = await AluQuotation.findById(id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (status && !['Pending', 'Reviewed', 'Quoted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (status) request.status = status;
    if (quotedPrice !== undefined) request.quotedPrice = parseFloat(quotedPrice);
    if (adminNotes !== undefined) request.adminNotes = adminNotes;
    
    if (req.files && req.files.length > 0) {
      const savedFiles = [];
      for (const file of req.files) {
        const savedFile = await saveFile(file, 'admin');
        savedFiles.push(savedFile);
      }
      request.adminFiles.push(...savedFiles);
    }
    
    await request.save();
    console.log('Quotation updated successfully');

    res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuotationRequest = async (req, res) => {
  try {
    const request = await AluQuotation.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (req.user.role !== 'admin' && request.email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    for (const file of request.files) {
      deleteFileFromDisk(file.url);
    }
    
    for (const file of request.adminFiles) {
      deleteFileFromDisk(file.url);
    }

    await request.deleteOne();
    
    res.status(200).json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuotationStats = async (req, res) => {
  try {
    const total = await AluQuotation.countDocuments();
    const pending = await AluQuotation.countDocuments({ status: 'Pending' });
    const reviewed = await AluQuotation.countDocuments({ status: 'Reviewed' });
    const quoted = await AluQuotation.countDocuments({ status: 'Quoted' });
    
    const revenueResult = await AluQuotation.aggregate([
      { $match: { status: 'Quoted', quotedPrice: { $ne: null } } },
      { $group: { _id: null, total: { $sum: '$quotedPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    res.status(200).json({
      success: true,
      data: { total, pending, reviewed, quoted, totalRevenue }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};