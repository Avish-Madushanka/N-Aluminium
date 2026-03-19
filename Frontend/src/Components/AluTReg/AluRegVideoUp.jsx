import React, { useState, useEffect, useRef } from 'react';
import './AluRegVideoUp.css';

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

const getYouTubeEmbedUrl = (url = '') => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
};

const getYouTubeThumbnail = (url = '') => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};

export default function AluRegVideoUp() {
  const [videos] = useState([
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

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [thumbnailError, setThumbnailError] = useState({});
  const videoPlayerRef = useRef(null);

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

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowPlayer(true);
  };

  const closePlayer = () => {
    if (videoPlayerRef.current) videoPlayerRef.current.pause();
    setShowPlayer(false);
    setSelectedVideo(null);
  };

  const handleThumbnailError = (videoId) => {
    setThumbnailError((prev) => ({ ...prev, [videoId]: true }));
  };

  return (
    <div className="AluRegVideoUp-library">
      <div className="AluRegVideoUp-header">
        <div className="AluRegVideoUp-title-section">
          <h1 className="AluRegVideoUp-title">Your VideoPress library</h1>
          <span className="AluRegVideoUp-count">{videos.length} Videos</span>
        </div>

        <div className="AluRegVideoUp-search-section1">
          <div className="AluRegVideoUp-search-wrapper1">
            <svg
              className="AluRegVideoUp-search-icon1"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-0.59 4.23-1.57L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
                fill="#666"
              />
            </svg>
            <input
              type="text"
              placeholder="Search your library"
              className="AluRegVideoUp-search-input1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="AluRegVideoUp-filters-btn">Filters</button>
        </div>
      </div>

      {showPlayer && selectedVideo && (
        <div className="AluRegVideoUp-player-overlay">
          <div className="AluRegVideoUp-player-container">
            {isYouTubeUrl(selectedVideo.videoUrl) ? (
              <iframe
                key={selectedVideo.videoUrl}
                className="AluRegVideoUp-video-player"
                src={getYouTubeEmbedUrl(selectedVideo.videoUrl)}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoPlayerRef}
                key={selectedVideo.videoUrl}
                className="AluRegVideoUp-video-player"
                controls
                autoPlay
                controlsList="nodownload"
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="AluRegVideoUp-player-info">
              <span className="AluRegVideoUp-player-title">
                {selectedVideo.title}
              </span>
              <button
                className="AluRegVideoUp-close-player"
                onClick={closePlayer}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="AluRegVideoUp-grid">
        {filteredVideos.map((video) => {
          const thumb = resolvedThumbnail(video);
          const ytThumb =
            !thumb && isYouTubeUrl(video.videoUrl)
              ? getYouTubeThumbnail(video.videoUrl)
              : null;
          const bgImage = thumb || ytThumb;

          return (
            <div
              key={video.id}
              className="AluRegVideoUp-card"
              onClick={() => handleVideoClick(video)}
            >
              <div
                className="AluRegVideoUp-thumbnail"
                style={{
                  backgroundColor: video.color,
                  backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!bgImage && (
                  <div className="AluRegVideoUp-thumbnail-fallback">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M18 3v2h2v3h2V3h-4zM8 3H4v6h2V5h2V3zm10 8v3h-2v-3h2zm-2-3h2v2h-2V8zM8 8h2v2H8V8zM4 13h2v-2H4v2zm2 5H4v-2h2v2zm12 0h-2v-2h2v2zm-6 0h-2v-2h2v2zm2-5h-2v2h2v-2zm-6 0h2v2H8v-2z" />
                    </svg>
                  </div>
                )}
                {isYouTubeUrl(video.videoUrl) && (
                  <span className="AluRegVideoUp-yt-badge">▶ YT</span>
                )}
                <span className="AluRegVideoUp-duration">{video.duration}</span>
              </div>
              <p className="AluRegVideoUp-video-title">{video.title}</p>
            </div>
          );
        })}

        {filteredVideos.length === 0 && (
          <div className="AluRegVideoUp-no-results">
            No videos found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}