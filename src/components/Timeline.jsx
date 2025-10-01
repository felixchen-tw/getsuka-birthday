import React from 'react';
import { Calendar, ExternalLink, Play } from 'lucide-react';
import { useTimeline } from '../hooks/useTimeline';
import './Timeline.css';

const Timeline = () => {
  const { timelineItems, loading, error } = useTimeline();

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case 'youtube':
        return '🎥';
      case 'video':
        return '🎬';
      case 'image':
        return '📸';
      case 'audio':
        return '🎵';
      default:
        return '📝';
    }
  };

  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    
    let videoId = null;
    
    // 處理 youtu.be 短網址
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match) {
        videoId = match[1];
      }
    }
    // 處理一般 YouTube 網址
    else if (url.includes('youtube.com')) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (match) {
        videoId = match[1];
      }
    }
    
    if (videoId) {
      console.log('Extracted video ID:', videoId);
      
      if (videoId.length !== 11) {
        console.warn(`Video ID length is ${videoId.length}, expected 11`);
      }
      
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      return thumbnailUrl;
    }
    
    console.log('Unable to extract video ID from URL:', url);
    return null;
  };



  const renderMediaContent = (item) => {
    if (item.mediaType === 'youtube' && item.link) {
      const thumbnail = getYouTubeThumbnail(item.link);
      console.log('Processing YouTube link:', item.link);
      
      return (
        <div className="media-content youtube-content">
          <div className="youtube-thumbnail">
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={item.title}
                onError={(e) => {
                  console.error('Thumbnail failed to load:', thumbnail);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="thumbnail-placeholder">
                <Play size={48} fill="white" />
              </div>
            )}

            <div className="play-overlay" onClick={() => {
              window.open(item.link, '_blank');
            }}>
              <Play size={32} fill="white" />
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="timeline-loading">
        <div className="loading-spinner"></div>
        <p>載入回憶中...</p>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2>🕰️玥曆</h2>
        
        {error && (
          <div className="timeline-notice">
            <p className="notice-text">
              ⚠️ {error}
            </p>
          </div>
        )}
      </div>

      <div className="timeline">
        <div className="timeline-line"></div>
        
        {timelineItems.length === 0 ? (
          <div className="timeline-empty">
            <p>還沒有回憶記錄，請稍後再試！</p>
          </div>
        ) : (
          timelineItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="timeline-dot">
                <span className="media-icon">
                  {getMediaIcon(item.mediaType)}
                </span>
              </div>
              
              <div className="timeline-content">
                <div className="timeline-card">
                  <div className="card-header">
                    <h3 className="card-title">{item.title}</h3>
                    <span className="media-badge">{item.mediaType}</span>
                  </div>
                  
                  {/* 媒體內容顯示 */}
                  {renderMediaContent(item)}
                  
                  <div className="card-meta">
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                  
                  {item.link && (
                    <a 
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-link"
                    >
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Timeline;