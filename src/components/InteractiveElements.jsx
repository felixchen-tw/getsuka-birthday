import React, { useState, useEffect } from 'react';
import { Heart, Star, MessageCircle, Share2, ThumbsUp, Smile } from 'lucide-react';
import './InteractiveElements.css';

const InteractiveElements = () => {
  const [likes, setLikes] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [stars, setStars] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showFloatingHearts, setShowFloatingHearts] = useState(false);

  // 載入儲存的數據
  useEffect(() => {
    const savedData = localStorage.getItem('birthdayInteractions');
    if (savedData) {
      const data = JSON.parse(savedData);
      setLikes(data.likes || 0);
      setHearts(data.hearts || 0);
      setStars(data.stars || 0);
      setMessages(data.messages || []);
    }
  }, []);

  // 儲存數據
  const saveData = (newData) => {
    const currentData = JSON.parse(localStorage.getItem('birthdayInteractions') || '{}');
    const updatedData = { ...currentData, ...newData };
    localStorage.setItem('birthdayInteractions', JSON.stringify(updatedData));
  };

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    saveData({ likes: newLikes });
    
    // 觸發點讚動畫
    const button = document.querySelector('.like-btn');
    button.classList.add('liked');
    setTimeout(() => button.classList.remove('liked'), 600);
  };

  const handleHeart = () => {
    const newHearts = hearts + 1;
    setHearts(newHearts);
    saveData({ hearts: newHearts });
    
    // 觸發愛心飄浮動畫
    setShowFloatingHearts(true);
    setTimeout(() => setShowFloatingHearts(false), 2000);
  };

  const handleStar = () => {
    const newStars = stars + 1;
    setStars(newStars);
    saveData({ stars: newStars });
  };

  const handleAddMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message.trim(),
        timestamp: new Date().toLocaleString('zh-TW')
      };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      saveData({ messages: newMessages });
      setMessage('');
      setShowMessage(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '生日祝福 🎉',
          text: '來看看這個特別的生日祝福網站！',
          url: window.location.href
        });
      } catch {
        console.log('分享取消');
      }
    } else {
      // 複製到剪貼板作為備選
      navigator.clipboard.writeText(window.location.href);
      alert('連結已複製到剪貼板！');
    }
  };

  return (
    <div className="interactive-elements">
      <div className="interaction-header">
        <h3>🎈 互動區域</h3>
        <p>留下你的祝福與愛心</p>
      </div>

      {/* 飄浮愛心動畫 */}
      {showFloatingHearts && (
        <div className="floating-hearts">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className={`floating-heart floating-heart-${i + 1}`}
              fill="red"
              color="red"
            />
          ))}
        </div>
      )}

      {/* 互動按鈕 */}
      <div className="interaction-buttons">
        <button 
          className="interaction-btn like-btn"
          onClick={handleLike}
          title="點讚"
        >
          <ThumbsUp size={24} />
          <span className="count">{likes}</span>
          <span className="label">讚</span>
        </button>

        <button 
          className="interaction-btn heart-btn"
          onClick={handleHeart}
          title="愛心"
        >
          <Heart size={24} />
          <span className="count">{hearts}</span>
          <span className="label">愛心</span>
        </button>

        <button 
          className="interaction-btn star-btn"
          onClick={handleStar}
          title="收藏"
        >
          <Star size={24} />
          <span className="count">{stars}</span>
          <span className="label">收藏</span>
        </button>

        <button 
          className="interaction-btn message-btn"
          onClick={() => setShowMessage(true)}
          title="留言"
        >
          <MessageCircle size={24} />
          <span className="count">{messages.length}</span>
          <span className="label">留言</span>
        </button>

        <button 
          className="interaction-btn share-btn"
          onClick={handleShare}
          title="分享"
        >
          <Share2 size={24} />
          <span className="label">分享</span>
        </button>
      </div>

      {/* 留言區域 */}
      {messages.length > 0 && (
        <div className="messages-section">
          <h4>💬 祝福留言</h4>
          <div className="messages-list">
            {messages.map(msg => (
              <div key={msg.id} className="message-item">
                <div className="message-content">
                  <Smile size={16} className="message-icon" />
                  <span>{msg.text}</span>
                </div>
                <div className="message-time">{msg.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 留言輸入框 */}
      {showMessage && (
        <div className="message-input-overlay">
          <div className="message-input-modal">
            <h4>✍️ 寫下你的祝福</h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="在這裡寫下你的生日祝福..."
              rows="4"
              maxLength="200"
            />
            <div className="char-count">
              {message.length}/200
            </div>
            <div className="message-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowMessage(false);
                  setMessage('');
                }}
              >
                取消
              </button>
              <button 
                className="send-btn"
                onClick={handleAddMessage}
                disabled={!message.trim()}
              >
                發送祝福
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 統計顯示 */}
      <div className="interaction-stats">
        <div className="stat-item">
          <span className="stat-number">{likes + hearts + stars}</span>
          <span className="stat-label">總互動</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{messages.length}</span>
          <span className="stat-label">祝福留言</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveElements;