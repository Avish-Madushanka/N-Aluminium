const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');

const getYouTubeId = (url = '') => {
    try {
        const u = new URL(url);
        if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
        const pathMatch = u.pathname.match(/\/(?:embed|live|shorts)\/([^/?&]+)/);
        if (pathMatch) return pathMatch[1];
        return u.searchParams.get('v') || null;
    } catch {
        return null;
    }
};

const isYouTubeUrl = (url = '') => Boolean(getYouTubeId(url));

const getYouTubeThumbnail = (url = '') => {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

const getRandomColor = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#a8e6cf', '#d4a5a5', '#9b59b6', '#3498db', '#e74c3c', '#2ecc71'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find({ status: 'active' })
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'name email fullName');

        const videosWithThumbnails = videos.map(video => {
            const videoObj = video.toObject();
            if (!videoObj.thumbnail && isYouTubeUrl(videoObj.videoUrl)) {
                videoObj.thumbnail = getYouTubeThumbnail(videoObj.videoUrl);
            }
            return videoObj;
        });

        res.status(200).json({
            success: true,
            count: videosWithThumbnails.length,
            data: videosWithThumbnails
        });
    } catch (error) {
        console.error('Get all videos error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch videos',
            error: error.message
        });
    }
};

exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('uploadedBy', 'name email fullName');

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        const videoObj = video.toObject();
        if (!videoObj.thumbnail && isYouTubeUrl(videoObj.videoUrl)) {
            videoObj.thumbnail = getYouTubeThumbnail(videoObj.videoUrl);
        }

        res.status(200).json({
            success: true,
            data: videoObj
        });
    } catch (error) {
        console.error('Get video by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch video',
            error: error.message
        });
    }
};

exports.createVideo = async (req, res) => {
    try {
        const { title, videoUrl, duration, thumbnail } = req.body;

        if (!title || !videoUrl) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(400).json({
                success: false,
                message: 'Title and video URL are required'
            });
        }

        let finalVideoUrl = videoUrl;
        let isYouTube = false;
        let youtubeId = null;
        let localVideoPath = null;
        let finalThumbnail = thumbnail || null;
        let fileSize = 0;

        if (req.file) {
            finalVideoUrl = `/uploads/videos/${req.file.filename}`;
            localVideoPath = finalVideoUrl;
            fileSize = req.file.size;

            const video = require('child_process').spawnSync('ffprobe', [
                '-v', 'error',
                '-show_entries', 'format=duration',
                '-of', 'default=noprint_wrappers=1:nokey=1',
                req.file.path
            ]);
            if (video.stdout) {
                const durationSeconds = parseFloat(video.stdout);
                if (!isNaN(durationSeconds)) {
                    const durationFormatted = formatDuration(durationSeconds);
                    if (!duration || duration === '00:00') {
                        req.body.duration = durationFormatted;
                    }
                }
            }
        } else if (isYouTubeUrl(videoUrl)) {
            isYouTube = true;
            youtubeId = getYouTubeId(videoUrl);
            if (!finalThumbnail) {
                finalThumbnail = getYouTubeThumbnail(videoUrl);
            }
        }

        if (!finalThumbnail && !isYouTubeUrl(videoUrl) && !req.file) {
            finalThumbnail = 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
        }

        const videoData = {
            title: title.trim(),
            videoUrl: finalVideoUrl,
            thumbnail: finalThumbnail,
            duration: duration || '00:00',
            color: getRandomColor(),
            isYouTube,
            youtubeId,
            localVideoPath,
            size: fileSize,
            uploadedBy: req.user._id,
            uploadedByModel: req.user.role === 'admin' ? 'Admin' : req.user.role === 'businessOwner' ? 'BusinessOwner' : 'Client',
            status: 'active'
        };

        const video = await Video.create(videoData);

        res.status(201).json({
            success: true,
            message: 'Video created successfully',
            data: video
        });
    } catch (error) {
        console.error('Create video error:', error);
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, () => {});
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create video',
            error: error.message
        });
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        if (req.user.role !== 'admin' && video.uploadedBy.toString() !== req.user._id.toString()) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this video'
            });
        }

        const { title, videoUrl, duration, thumbnail } = req.body;
        const updates = {};

        if (title !== undefined) updates.title = title.trim();
        if (duration !== undefined) updates.duration = duration;

        if (videoUrl !== undefined && videoUrl !== video.videoUrl) {
            updates.videoUrl = videoUrl;
            updates.isYouTube = isYouTubeUrl(videoUrl);
            updates.youtubeId = getYouTubeId(videoUrl);
            
            if (!thumbnail && updates.isYouTube) {
                updates.thumbnail = getYouTubeThumbnail(videoUrl);
            }
        }

        if (thumbnail !== undefined) updates.thumbnail = thumbnail;

        if (req.file) {
            if (video.localVideoPath && video.localVideoPath.startsWith('/uploads/videos/')) {
                const oldVideoPath = path.join(__dirname, '..', video.localVideoPath);
                if (fs.existsSync(oldVideoPath)) {
                    fs.unlinkSync(oldVideoPath);
                }
            }
            updates.videoUrl = `/uploads/videos/${req.file.filename}`;
            updates.localVideoPath = updates.videoUrl;
            updates.isYouTube = false;
            updates.youtubeId = null;
            updates.size = req.file.size;

            const { execSync } = require('child_process');
            try {
                const durationOutput = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${req.file.path}`);
                const durationSeconds = parseFloat(durationOutput);
                if (!isNaN(durationSeconds)) {
                    updates.duration = formatDuration(durationSeconds);
                }
            } catch (err) {
                console.error('Duration extraction error:', err);
            }
        }

        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('uploadedBy', 'name email fullName');

        res.status(200).json({
            success: true,
            message: 'Video updated successfully',
            data: updatedVideo
        });
    } catch (error) {
        console.error('Update video error:', error);
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, () => {});
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update video',
            error: error.message
        });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        if (req.user.role !== 'admin' && video.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this video'
            });
        }

        if (video.localVideoPath && video.localVideoPath.startsWith('/uploads/videos/')) {
            const videoPath = path.join(__dirname, '..', video.localVideoPath);
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        }

        if (video.thumbnail && video.thumbnail.startsWith('/uploads/videos/')) {
            const thumbnailPath = path.join(__dirname, '..', video.thumbnail);
            if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            }
        }

        await video.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Video deleted successfully'
        });
    } catch (error) {
        console.error('Delete video error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete video',
            error: error.message
        });
    }
};

exports.getVideoStats = async (req, res) => {
    try {
        const total = await Video.countDocuments();
        const active = await Video.countDocuments({ status: 'active' });
        const youTubeVideos = await Video.countDocuments({ isYouTube: true });
        const localVideos = await Video.countDocuments({ isYouTube: false });

        res.status(200).json({
            success: true,
            data: {
                total,
                active,
                youTubeVideos,
                localVideos
            }
        });
    } catch (error) {
        console.error('Get video stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch video statistics',
            error: error.message
        });
    }
};