const Alumni = require('../models/Alumni');
const fs = require('fs');
const path = require('path');
const { sendAlumniStatusUpdateEmail } = require('../utils/emailService');

exports.registerAlumni = async (req, res) => {
  try {
    const { fullName, idNumber, address, birthday, gender, email, phone } = req.body;
    
    if (!fullName || !idNumber || !address || !birthday || !gender || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }
    
    if (!req.files || !req.files.idPhoto) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID photo is required' 
      });
    }
    
    const existingAlumni = await Alumni.findOne({ 
      $or: [{ email: email.toLowerCase() }, { idNumber }] 
    });
    
    if (existingAlumni) {
      if (existingAlumni.email === email.toLowerCase()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      }
      if (existingAlumni.idNumber === idNumber) {
        return res.status(400).json({ 
          success: false, 
          message: 'ID number already registered' 
        });
      }
    }
    
    const idPhotoPath = `/uploads/alumni/${req.files.idPhoto[0].filename}`;
    const cvFilePath = req.files.cvFile ? `/uploads/alumni/${req.files.cvFile[0].filename}` : null;
    
    const newAlumni = new Alumni({
      fullName,
      idNumber,
      address,
      birthday,
      gender,
      email: email.toLowerCase(),
      phone,
      idPhoto: idPhotoPath,
      cvFile: cvFilePath
    });
    
    await newAlumni.save();
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Pending admin approval.',
      data: {
        id: newAlumni._id,
        fullName: newAlumni.fullName,
        email: newAlumni.email,
        status: newAlumni.status
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Duplicate entry detected' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

exports.getAllAlumniRegistrations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = {};
    
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { idNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    const alumni = await Alumni.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Alumni.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: alumni,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching registrations' 
    });
  }
};

exports.getAlumniRegistrationById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    
    if (!alumni) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: alumni 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching registration' 
    });
  }
};

exports.updateAlumniStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const { id } = req.params;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      });
    }
    
    const alumni = await Alumni.findById(id);
    
    if (!alumni) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }
    
    if (alumni.status === status) {
      return res.status(400).json({ 
        success: false, 
        message: `Registration is already ${status}` 
      });
    }
    
    alumni.status = status;
    alumni.updatedAt = Date.now();
    await alumni.save();
    
    await sendAlumniStatusUpdateEmail(alumni, status, reason);
    
    res.status(200).json({
      success: true,
      message: `Registration ${status} successfully`,
      data: alumni
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating status' 
    });
  }
};

exports.deleteAlumniRegistration = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    
    if (!alumni) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }
    
    if (alumni.idPhoto) {
      const photoPath = path.join(__dirname, '..', alumni.idPhoto);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    if (alumni.cvFile) {
      const cvPath = path.join(__dirname, '..', alumni.cvFile);
      if (fs.existsSync(cvPath)) {
        fs.unlinkSync(cvPath);
      }
    }
    
    await alumni.deleteOne();
    
    res.status(200).json({ 
      success: true, 
      message: 'Registration deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error deleting registration' 
    });
  }
};

exports.getAlumniStats = async (req, res) => {
  try {
    const total = await Alumni.countDocuments();
    const pending = await Alumni.countDocuments({ status: 'pending' });
    const approved = await Alumni.countDocuments({ status: 'approved' });
    const rejected = await Alumni.countDocuments({ status: 'rejected' });
    
    res.status(200).json({
      success: true,
      data: { total, pending, approved, rejected }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching stats' 
    });
  }
};

exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status, reason } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of registration IDs' 
      });
    }
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value' 
      });
    }
    
    const result = await Alumni.updateMany(
      { _id: { $in: ids } },
      { $set: { status, updatedAt: Date.now() } }
    );
    
    const updatedAlumni = await Alumni.find({ _id: { $in: ids } });
    
    for (const alumni of updatedAlumni) {
      await sendAlumniStatusUpdateEmail(alumni, status, reason);
    }
    
    res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} registrations`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error performing bulk update' 
    });
  }
};