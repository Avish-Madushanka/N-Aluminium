const Project = require('../models/Project');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');
const path = require('path');

const UPLOADS_BASE_DIR = path.join(__dirname, '..', 'uploads'); 

const deleteFileFromUploads = (filePathSegment) => {
    const fullPath = path.join(UPLOADS_BASE_DIR, filePathSegment);
    if (fs.existsSync(fullPath)) {
        try {
            fs.unlinkSync(fullPath);
            console.log(`[FileUtil] Deleted: ${fullPath}`);
        } catch (err) {
            console.error(`[FileUtil] Error deleting ${fullPath}:`, err);
        }
    } else {
        console.warn(`[FileUtil] File not found for deletion: ${fullPath} (from segment: ${filePathSegment})`);
    }
};


exports.createProject = asyncHandler(async (req, res, next) => {
    const { title, description, projectType } = req.body;

    if (!title || !description || !projectType) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => deleteFileFromUploads(`projects/${file.filename}`));
        }
        return next(new ErrorResponse('Please provide title, description, and project type.', 400));
    }

    if (!req.files || req.files.length === 0) {
        return next(new ErrorResponse('Please upload at least one image for the project.', 400));
    }

    const images = req.files.map(file => `/projects/${file.filename}`);

    const projectData = {
        title,
        description,
        projectType,
        images,
        userId: req.user.id,
        userModel: req.user.constructor.modelName
    };

    const project = await Project.create(projectData);
    console.log(`[ProjectCtrl Create] Project created: ${project._id} by User ${req.user.id}`);
    res.status(201).json({
        success: true,
        message: 'Project created successfully.',
        data: project
    });
});

exports.getAllProjects = asyncHandler(async (req, res, next) => {
    let queryFilters = {};
    if (req.query.projectType) {
        queryFilters.projectType = req.query.projectType;
    }
    if (req.query.userId) { 
        queryFilters.userId = req.query.userId;
    }

    const projects = await Project.find(queryFilters)
        .populate('userId', 'name email businessName')
        .sort({ createdAt: -1 });

    console.log(`[ProjectCtrl GetAll] Found ${projects.length} projects.`);
    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
});

exports.getProjectById = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id)
        .populate('userId', 'name email businessName');

    if (!project) {
        console.warn(`[ProjectCtrl GetById] Project not found: ${req.params.id}`);
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }
    console.log(`[ProjectCtrl GetById] Project found: ${project._id}`);
    res.status(200).json({
        success: true,
        data: project
    });
});

exports.updateProject = asyncHandler(async (req, res, next) => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => deleteFileFromUploads(`projects/${file.filename}`));
        }
        console.warn(`[ProjectCtrl Update] Project not found for update: ${req.params.id}`);
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    if (project.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => deleteFileFromUploads(`projects/${file.filename}`));
        }
        console.warn(`[ProjectCtrl Update] Unauthorized attempt to update project ${project._id} by user ${req.user.id}`);
        return next(new ErrorResponse('Not authorized to update this project.', 403));
    }

    const { title, description, projectType, imagesToDelete } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (projectType !== undefined) updates.projectType = projectType;

    let currentImagePaths = [...project.images];

    if (imagesToDelete) {
        const imagesToDeleteArray = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
        imagesToDeleteArray.forEach(imgPath => {
            deleteFileFromUploads(imgPath.startsWith('/') ? imgPath.substring(1) : imgPath); // Remove leading '/' if present
            currentImagePaths = currentImagePaths.filter(p => p !== imgPath);
        });
        console.log(`[ProjectCtrl Update] Images after deletion for project ${project._id}:`, currentImagePaths.length);
    }
    
    if (req.files && req.files.length > 0) {
        const newImagePaths = req.files.map(file => `/projects/${file.filename}`);
        currentImagePaths.push(...newImagePaths);
        console.log(`[ProjectCtrl Update] Added ${newImagePaths.length} new images for project ${project._id}.`);
    }
    
    updates.images = currentImagePaths;

    if (updates.images.length === 0) {
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => deleteFileFromUploads(`projects/${file.filename}`));
        }
        console.warn(`[ProjectCtrl Update] Attempt to update project ${project._id} to have no images.`);
        return next(new ErrorResponse('A project must have at least one image.', 400));
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
    }).populate('userId', 'name email businessName');

    console.log(`[ProjectCtrl Update] Project updated: ${updatedProject._id}`);
    res.status(200).json({
        success: true,
        message: 'Project updated successfully.',
        data: updatedProject
    });
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        console.warn(`[ProjectCtrl Delete] Project not found for deletion: ${req.params.id}`);
        return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    if (project.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        console.warn(`[ProjectCtrl Delete] Unauthorized attempt to delete project ${project._id} by user ${req.user.id}`);
        return next(new ErrorResponse('Not authorized to delete this project.', 403));
    }

    if (project.images && project.images.length > 0) {
        project.images.forEach(imgPath => {
             deleteFileFromUploads(imgPath.startsWith('/') ? imgPath.substring(1) : imgPath);
        });
        console.log(`[ProjectCtrl Delete] Deleted images for project ${project._id}.`);
    }

    await project.deleteOne();
    console.log(`[ProjectCtrl Delete] Project deleted from DB: ${project._id}`);
    res.status(200).json({
        success: true,
        message: 'Project deleted successfully.',
        data: { id: project._id }
    });
});