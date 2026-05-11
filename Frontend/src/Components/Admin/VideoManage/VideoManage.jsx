import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './VideoManage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

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

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function VideoManage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [thumbnailError, setThumbnailError] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnail: '',
    duration: '00:00',
  });
  
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
  }, [searchTerm, videos]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/videos`);
      if (response.data.success) {
        setVideos(response.data.data);
        setFilteredVideos(response.data.data);
      }
    } catch (error) {
      console.error('Fetch videos error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolvedThumbnail = (video) => {
    if (thumbnailError[video._id]) return null;
    if (video.thumbnail) return video.thumbnail;
    if (isYouTubeUrl(video.videoUrl)) return getYouTubeThumbnail(video.videoUrl);
    return null;
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB');
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      const duration = formatDuration(video.duration);
      setFormData(prev => ({ ...prev, duration }));
    };
    video.src = URL.createObjectURL(file);

    const videoFormData = new FormData();
    videoFormData.append('title', formData.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    videoFormData.append('videoFile', file);
    if (formData.duration !== '00:00') videoFormData.append('duration', formData.duration);
    if (formData.thumbnail) videoFormData.append('thumbnail', formData.thumbnail);

    try {
      if (editingVideo) {
        const response = await axios.put(`${API_URL}/videos/${editingVideo._id}`, videoFormData, axiosConfig);
        if (response.data.success) {
          await fetchVideos();
          closeForm();
        }
      } else {
        const response = await axios.post(`${API_URL}/videos`, videoFormData, axiosConfig);
        if (response.data.success) {
          await fetchVideos();
          closeForm();
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload video');
    }
    event.target.value = '';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.videoUrl) {
      alert('Please fill in title and video URL');
      return;
    }

    try {
      new URL(formData.videoUrl);
    } catch {
      alert('Please enter a valid video URL');
      return;
    }

    const videoData = new FormData();
    videoData.append('title', formData.title);
    videoData.append('videoUrl', formData.videoUrl);
    videoData.append('duration', formData.duration);
    if (formData.thumbnail) videoData.append('thumbnail', formData.thumbnail);

    try {
      if (editingVideo) {
        const response = await axios.put(`${API_URL}/videos/${editingVideo._id}`, videoData, axiosConfig);
        if (response.data.success) {
          await fetchVideos();
          closeForm();
        }
      } else {
        const response = await axios.post(`${API_URL}/videos`, videoData, axiosConfig);
        if (response.data.success) {
          await fetchVideos();
          closeForm();
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(error.response?.data?.message || 'Failed to save video');
    }
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail || '',
      duration: video.duration,
    });
    setShowForm(true);
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const response = await axios.delete(`${API_URL}/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        await fetchVideos();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Failed to delete video');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingVideo(null);
    setFormData({ title: '', videoUrl: '', thumbnail: '', duration: '00:00' });
  };

  const handleThumbnailError = (videoId) => {
    setThumbnailError((prev) => ({ ...prev, [videoId]: true }));
  };

  if (loading) {
    return <div className="VideoManage-loading">Loading videos...</div>;
  }

  return (
    <div className="VideoManage-library">
      <div className="VideoManage-header">
        <div className="VideoManage-title-section">
          <h1 className="VideoManage-title">Video Management</h1>
          <span className="VideoManage-count">{videos.length} Videos</span>
        </div>

        <div className="VideoManage-header-actions">
          <div className="VideoManage-search-section">
            <div className="VideoManage-search-wrapper">
              <svg className="VideoManage-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-0.59 4.23-1.57L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" fill="#666"/>
              </svg>
              <input
                type="text"
                placeholder="Search videos"
                className="VideoManage-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <button className="VideoManage-add-btn" onClick={() => setShowForm(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Video
          </button>
        </div>
      </div>

      {showForm && (
        <div className="VideoManage-form-overlay">
          <div className="VideoManage-form-container">
            <h2>{editingVideo ? 'Edit Video' : 'Add New Video'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="VideoManage-form-group">
                <label>Video Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div className="VideoManage-form-group">
                <label>Video URL (YouTube or direct MP4) *</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleFormChange}
                  placeholder="https://youtube.com/... or https://example.com/video.mp4"
                  required
                />
              </div>

              <div className="VideoManage-form-group">
                <label>Thumbnail URL (optional)</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleFormChange}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="VideoManage-form-group">
                <label>Duration (MM:SS)</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  placeholder="03:30"
                  pattern="[0-9]{2}:[0-9]{2}"
                />
              </div>

              <div className="VideoManage-form-upload">
                <label className="VideoManage-upload-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  Or Upload Video File (MP4, WebM, up to 100MB)
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleVideoUpload}
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    hidden
                  />
                </label>
              </div>

              <div className="VideoManage-form-actions">
                <button type="submit" className="VideoManage-submit-btn">
                  {editingVideo ? 'Update Video' : 'Add to Library'}
                </button>
                <button type="button" className="VideoManage-cancel-btn" onClick={closeForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="VideoManage-grid">
        {filteredVideos.map((video) => {
          const thumb = resolvedThumbnail(video);
          const bgImage = thumb || video.thumbnail;

          return (
            <div key={video._id} className="VideoManage-card">
              <div
                className="VideoManage-thumbnail"
                style={{
                  backgroundColor: video.color,
                  backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!bgImage && (
                  <div className="VideoManage-thumbnail-fallback">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M18 3v2h2v3h2V3h-4zM8 3H4v6h2V5h2V3zm10 8v3h-2v-3h2zm-2-3h2v2h-2V8zM8 8h2v2H8V8zM4 13h2v-2H4v2zm2 5H4v-2h2v2zm12 0h-2v-2h2v2zm-6 0h-2v-2h2v2zm2-5h-2v2h2v-2zm-6 0h2v2H8v-2z" />
                    </svg>
                  </div>
                )}
                {video.isYouTube && <span className="VideoManage-yt-badge">YouTube</span>}
                <span className="VideoManage-duration">{video.duration}</span>
                <div className="VideoManage-card-actions">
                  <button className="VideoManage-edit-btn" onClick={() => handleEditVideo(video)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button className="VideoManage-delete-btn" onClick={() => handleDeleteVideo(video._id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <p className="VideoManage-video-title">{video.title}</p>
            </div>
          );
        })}

        {filteredVideos.length === 0 && (
          <div className="VideoManage-no-results">
            {searchTerm ? `No videos found matching "${searchTerm}"` : 'No videos in library. Click "Add Video" to get started!'}
          </div>
        )}
      </div>
    </div>
  );
}