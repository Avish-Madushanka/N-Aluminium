const Project = require('../models/Project');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');
const path = require('path');

const UPLOADS_BASE_DIR = path.join(__dirname, '..', 'uploads');

const deleteFileFromUploads = (filePathSegment) => {
    if (!filePathSegment) return;
    const cleanPath = filePathSegment.startsWith('/') ? filePathSegment.substring(1) : filePathSegment;
    const fullPath = path.join(UPLOADS_BASE_DIR, cleanPath);
    if (fs.existsSync(fullPath)) {
        try {
            fs.unlinkSync(fullPath);
        } catch (err) {
            console.error(`Error deleting ${fullPath}:`, err);
        }
    }
};

exports.createProject = asyncHandler(async (req, res, next) => {
    const {
        title,
        description,
        projectType,
        location,
        projectDate,
        featured,
        coverImageIndex
    } = req.body;

    if (!title || !description || !projectType) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => deleteFileFromUploads(`projects/${file.filename}`));
        }
        return next(new ErrorResponse('Please provide title, description, and project type.', 400));
    }

    if (!req.files || req.files.length === 0) {
        return next(new ErrorResponse('Please upload at least one image for the project.', 400));
    }

    if (req.files.length > 10) {
        req.files.forEach(file => deleteFileFromUploads(`projects/${file.filename}`));
        return next(new ErrorResponse('Maximum 10 images allowed.', 400));
    }

    const galleryImages = req.files.map(file => `/uploads/projects/${file.filename}`);
    const coverIndex = parseInt(coverImageIndex) || 0;
    const coverImage = galleryImages[coverIndex] || galleryImages[0];

    const projectData = {
        title: title.trim(),
        description: description.trim(),
        projectType,
        location: location?.trim() || '',
        projectDate: projectDate || '',
        featured: featured === 'true' || featured === true,
        coverImage,
        galleryImages,
        userId: req.user.id,
        userModel: req.user.constructor.modelName
    };

    const project = await Project.create(projectData);

    res.status(201).json({
        success: true,
        message: 'Project created successfully.',
        data: project
    });
});

exports.getAllProjects = asyncHandler(async (req, res, next) => {
    let queryFilters = {};
    
    if (req.query.projectType && req.query.projectType !== 'All') {
        const categoryMap = {
            'Windows': ['Aluminum Windows', 'Full House Aluminum'],
            'Doors': ['Aluminum Doors'],
            'Pantry Cupboards': ['Other'],
            'Sivilims': ['Structural Glazing', 'Curtain Walls'],
            'Others': ['Curtain Walls', 'Facade Systems', 'Skylights', 'Structural Glazing', 'Other']
        };
        const mappedTypes = categoryMap[req.query.projectType] || [req.query.projectType];
        queryFilters.projectType = { $in: mappedTypes };
    }
    
    if (req.query.userId) {
        queryFilters.userId = req.query.userId;
    }
    
    if (req.query.featured === 'true') {
        queryFilters.featured = true;
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const projects = await Project.find(queryFilters)
        .populate('userId', 'name email businessName ownerName')
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
    
    const total = await Project.countDocuments(queryFilters);
    
    res.status(200).json({
        success: true,
        count: projects.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: projects
    });
});

exports.getProjectById = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id)
        .populate('userId', 'name email businessName ownerName');

    if (!project) {
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
        success: true,
        data: project
    });
});

exports.getProjectsByCategory = asyncHandler(async (req, res, next) => {
    const { category } = req.params;
    
    let projectTypeFilter = [];
    
    const categoryMap = {
        'Windows': ['Aluminum Windows', 'Full House Aluminum'],
        'Doors': ['Aluminum Doors'],
        'Pantry Cupboards': ['Other'],
        'Sivilims': ['Structural Glazing', 'Curtain Walls'],
        'Others': ['Curtain Walls', 'Facade Systems', 'Skylights', 'Structural Glazing', 'Other']
    };
    
    if (category === 'All') {
        projectTypeFilter = [
            'Aluminum Doors', 'Aluminum Windows', 'Full House Aluminum',
            'Curtain Walls', 'Facade Systems', 'Skylights', 'Structural Glazing', 'Other'
        ];
    } else {
        projectTypeFilter = categoryMap[category] || [category];
    }
    
    const projects = await Project.find({ projectType: { $in: projectTypeFilter } })
        .populate('userId', 'name email businessName ownerName')
        .sort({ featured: -1, createdAt: -1 });
    
    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
});

exports.getFeaturedProjects = asyncHandler(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 6;
    
    const projects = await Project.find({ featured: true })
        .populate('userId', 'name email businessName ownerName')
        .sort({ createdAt: -1 })
        .limit(limit);
    
    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
});

exports.updateProject = asyncHandler(async (req, res, next) => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => deleteFileFromUploads(`projects/${file.filename}`));
        }
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    if (project.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => deleteFileFromUploads(`projects/${file.filename}`));
        }
        return next(new ErrorResponse('Not authorized to update this project.', 403));
    }

    const {
        title,
        description,
        projectType,
        location,
        projectDate,
        featured,
        imagesToDelete,
        coverImageIndex
    } = req.body;
    
    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (projectType !== undefined) updates.projectType = projectType;
    if (location !== undefined) updates.location = location.trim();
    if (projectDate !== undefined) updates.projectDate = projectDate;
    if (featured !== undefined) updates.featured = featured === 'true' || featured === true;

    let currentGalleryImages = [...project.galleryImages];

    if (imagesToDelete) {
        const imagesToDeleteArray = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
        imagesToDeleteArray.forEach(imgPath => {
            deleteFileFromUploads(imgPath);
            currentGalleryImages = currentGalleryImages.filter(p => p !== imgPath);
        });
    }

    if (req.files && req.files.length > 0) {
        const newImagePaths = req.files.map(file => `/uploads/projects/${file.filename}`);
        currentGalleryImages.push(...newImagePaths);
    }
    
    updates.galleryImages = currentGalleryImages;

    if (updates.galleryImages.length === 0) {
        return next(new ErrorResponse('Project must have at least one image.', 400));
    }

    const coverIndex = parseInt(coverImageIndex) !== undefined 
        ? parseInt(coverImageIndex) 
        : project.galleryImages.indexOf(project.coverImage);
    
    const newCoverImage = updates.galleryImages[coverIndex] || updates.galleryImages[0];
    updates.coverImage = newCoverImage;

    const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
    ).populate('userId', 'name email businessName ownerName');

    res.status(200).json({
        success: true,
        message: 'Project updated successfully.',
        data: updatedProject
    });
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    if (project.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to delete this project.', 403));
    }

    if (project.galleryImages && project.galleryImages.length > 0) {
        project.galleryImages.forEach(imgPath => {
            deleteFileFromUploads(imgPath);
        });
    }

    await project.deleteOne();
    
    res.status(200).json({
        success: true,
        message: 'Project deleted successfully.',
        data: { id: project._id }
    });
});

exports.getProjectStats = asyncHandler(async (req, res, next) => {
    const total = await Project.countDocuments();
    const featured = await Project.countDocuments({ featured: true });
    
    const byType = await Project.aggregate([
        { $group: { _id: '$projectType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
        success: true,
        data: {
            total,
            featured,
            byType
        }
    });
});