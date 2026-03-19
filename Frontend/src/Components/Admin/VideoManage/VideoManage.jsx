import React, { useState, useRef, useEffect } from 'react';
import './VideoManage.css';

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

export default function VideoManage() {
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Acousticlive show at terraces',
      duration: '03:38',
      thumbnail: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      videoUrl: 'https://www.youtube.com/live/9i2g6fVNocU?si=6cdFLyRN6EKSfhqk',
      color: '#ff6b6b',
    },
    {
      id: 2,
      title: 'Bring it all over videoclip',
      duration: '02:49',
      thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=1159&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      color: '#4ecdc4',
    },
    {
      id: 3,
      title: 'Keep moving!',
      duration: '02:14',
      thumbnail: 'https://images.unsplash.com/photo-1536240474400-95dad987e40e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      color: '#45b7d1',
    },
    {
      id: 4,
      title: 'ADDICT RUE',
      duration: '01:24',
      thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      color: '#f9ca24',
    },
    {
      id: 5,
      title: "Theywon'tcatchme",
      duration: '02:53',
      thumbnail: 'https://images.unsplash.com/photo-1536240474400-95dad987e40e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      color: '#a8e6cf',
    },
    {
      id: 6,
      title: 'Liveperformance',
      duration: '00:36',
      thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      color: '#d4a5a5',
    },
    {
      id: 7,
      title: 'Fastdancing-videoclipdemo',
      duration: '02:14',
      thumbnail: 'https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      color: '#9b59b6',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [thumbnailError, setThumbnailError] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnail: '',
    duration: '00:00',
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(filtered);
  }, [searchTerm, videos]);

  const resolvedThumbnail = (video) => {
    if (thumbnailError[video.id]) return null;
    if (video.thumbnail) return video.thumbnail;
    return getYouTubeThumbnail(video.videoUrl) || null;
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      if (!file.type.startsWith('video/')) return;

      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        const duration = formatDuration(video.duration);
        const videoUrl = URL.createObjectURL(file);

        createVideoThumbnail(file, (thumbnailUrl) => {
          const newVideo = {
            id: Date.now() + Math.random(),
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            duration,
            thumbnail: thumbnailUrl || 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
            videoUrl,
            color: getRandomColor(),
          };
          setVideos((prev) => [...prev, newVideo]);
        });
      };
      video.src = URL.createObjectURL(file);
    });
    event.target.value = '';
  };

  const createVideoThumbnail = (file, callback) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.currentTime = 1;

    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        callback(URL.createObjectURL(blob));
      }, 'image/jpeg', 0.8);
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => callback(null);
    video.src = URL.createObjectURL(file);
  };

  const handleFormSubmit = (e) => {
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

    let thumbnailUrl = formData.thumbnail;
    if (!thumbnailUrl && isYouTubeUrl(formData.videoUrl)) {
      thumbnailUrl = getYouTubeThumbnail(formData.videoUrl);
    }
    if (!thumbnailUrl) {
      thumbnailUrl = 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
    }

    const newVideo = {
      id: Date.now() + Math.random(),
      title: formData.title,
      duration: formData.duration || '00:00',
      thumbnail: thumbnailUrl,
      videoUrl: formData.videoUrl,
      color: getRandomColor(),
    };

    if (!isYouTubeUrl(formData.videoUrl) && formData.duration === '00:00') {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.onloadedmetadata = () => {
        newVideo.duration = formatDuration(tempVideo.duration);
        setVideos((prev) => [...prev, newVideo]);
      };
      tempVideo.src = formData.videoUrl;
    } else {
      setVideos((prev) => [...prev, newVideo]);
    }

    setFormData({ title: '', videoUrl: '', thumbnail: '', duration: '00:00' });
    setShowForm(false);
  };

  const handleDeleteVideo = (videoId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this video?')) {
      setVideos(videos.filter(video => video.id !== videoId));
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRandomColor = () => {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleThumbnailError = (videoId) => {
    setThumbnailError((prev) => ({ ...prev, [videoId]: true }));
  };

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
            <button className="VideoManage-filters-btn">Filters</button>
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
            <h2>Add New Video</h2>
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
                <label>Video URL *</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleFormChange}
                  placeholder="https://example.com/video.mp4 or YouTube URL"
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
                  Or Upload Video File
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
                <button type="submit" className="VideoManage-submit-btn">Add to Library</button>
                <button type="button" className="VideoManage-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="VideoManage-grid">
        {filteredVideos.map((video) => {
          const thumb = resolvedThumbnail(video);
          const ytThumb = !thumb && isYouTubeUrl(video.videoUrl) ? getYouTubeThumbnail(video.videoUrl) : null;
          const bgImage = thumb || ytThumb;

          return (
            <div key={video.id} className="VideoManage-card">
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
                {isYouTubeUrl(video.videoUrl) && <span className="VideoManage-yt-badge">YouTube</span>}
                <span className="VideoManage-duration">{video.duration}</span>
                <button className="VideoManage-delete-btn" onClick={(e) => handleDeleteVideo(video.id, e)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
              <p className="VideoManage-video-title">{video.title}</p>
            </div>
          );
        })}

        {filteredVideos.length === 0 && (
          <div className="VideoManage-no-results">No videos found matching "{searchTerm}"</div>
        )}
      </div>
    </div>
  );
}