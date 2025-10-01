import React from 'react';
import { Calendar, ExternalLink, Play, Image } from 'lucide-react';
import { useTimeline } from '../hooks/useTimeline';
import './Timeline.css';

const Timeline = () => {
  const { timelineItems, loading, error } = useTimeline();

  // 確保前端也按日期排序（備用排序）
  const sortedItems = timelineItems.sort((a, b) => {
    const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
    const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
    return dateA - dateB; // 升序排列（最舊的在前）
  });

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
      case 'image':
        return '📸';
      case 'record':
        return '📝';
      default:
        return '🎉';
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
    
    // 渲染圖片內容
    if (item.mediaType === 'image' && item.link) {
      return (
        <div className="media-content image-content">
          <div className="image-container">
            <img 
              src={item.link} 
              alt={item.title}
              className="timeline-image"
              onError={(e) => {
                console.error('Image failed to load:', item.link);
                e.target.style.display = 'none';
                // 顯示備用內容
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.innerHTML = '<div class="placeholder-content"><span class="placeholder-icon">🖼️</span><p>無法載入圖片</p></div>';
                e.target.parentNode.appendChild(placeholder);
              }}
              onClick={() => {
                // 點擊圖片放大檢視
                window.open(item.link, '_blank');
              }}
            />
            <div className="image-overlay">
              <ExternalLink size={20} />
              <span>查看大圖</span>
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
        <h2>🗓️ 玥曆</h2>
        
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
        
        {sortedItems.length === 0 ? (
          <div className="timeline-empty">
            <p>還沒有回憶記錄，請稍後再試！</p>
          </div>
        ) : (
          sortedItems.map((item, index) => (
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