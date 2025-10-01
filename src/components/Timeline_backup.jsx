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
      hour: '2-digit',
      minute: '2-digit'
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
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (match) {
        videoId = match[1];
      }
    }
    // 處理一般 YouTube 網址
    else if (url.includes('youtube.com')) {
      const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
      if (match) {
        videoId = match[1];
      }
    }
    
    if (videoId && videoId.length === 11) {
      console.log('Extracted video ID:', videoId);
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    
    console.log('Unable to extract video ID from URL:', url);
    return null;
  };

  const renderMediaContent = (item) => {
    if (item.mediaType === 'youtube' && item.link) {
      const thumbnail = getYouTubeThumbnail(item.link);
      console.log('Processing YouTube link:', item.link);
      console.log('Generated thumbnail URL:', thumbnail);
      
      return (
        <div className="media-content youtube-content">
          <div className="youtube-thumbnail">
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={item.title}
                onLoad={() => console.log('Thumbnail loaded successfully')}
                onError={(e) => {
                  console.error('Thumbnail failed to load:', thumbnail);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="thumbnail-placeholder">
                <Play size={48} fill="white" />
                <p>無法加載縮圖</p>
              </div>
            )}
            <div className="play-overlay" onClick={() => window.open(item.link, '_blank')}>
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

  // 不要因為錯誤就完全不顯示組件，而是顯示錯誤信息但繼續渲染

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2>🕰️ 美好回憶時光軸</h2>
        <p>記錄每一個珍貴的時刻</p>
        
        {/* 顯示錯誤信息但不阻礙功能 */}
        {error && (
          <div className="timeline-notice">
            <p className="notice-text">
              ℹ️ {error}
            </p>
            <details className="firebase-help">
              <summary>如何設置 Firebase 權限？</summary>
              <div className="help-content">
                <p>1. 前往 <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a></p>
                <p>2. 選擇項目 → Firestore Database → Rules</p>
                <p>3. 將規則修改為：</p>
                <pre>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}</pre>
                <p>4. 點擊「發布」按鈕</p>
              </div>
            </details>
          </div>
        )}
        
        <p className="timeline-info">
          📡 數據由 Firebase 實時同步，內容由管理員維護
        </p>
      </div>



      <div className="timeline">
        <div className="timeline-line"></div>
        
        {timelineItems.length === 0 ? (
          <div className="timeline-empty">
            <p>還沒有回憶記錄，快來添加第一個吧！</p>
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
                      <ExternalLink size={16} />
                      {item.mediaType === 'youtube' ? '觀看影片' : '查看內容'}
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