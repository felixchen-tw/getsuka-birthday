import React, { useState, useEffect } from 'react';
import { MessageCircle, Share2, Smile, ChevronDown, ChevronUp } from 'lucide-react';
import './InteractiveElements.css';

const InteractiveElements = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [messages, setMessages] = useState([]);
  const [showMessageBoard, setShowMessageBoard] = useState(true);

  // 載入儲存的數據
  useEffect(() => {
    const savedData = localStorage.getItem('birthdayMessages');
    if (savedData) {
      const data = JSON.parse(savedData);
      setMessages(data.messages || []);
    }
  }, []);

  // 儲存留言數據
  const saveMessages = (newMessages) => {
    localStorage.setItem('birthdayMessages', JSON.stringify({ messages: newMessages }));
  };

  const handleAddMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message.trim(),
        author: isAnonymous ? '匿名' : authorName.trim() || '匿名',
        isAnonymous: isAnonymous,
        timestamp: new Date().toLocaleString('zh-TW')
      };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      saveMessages(newMessages);
      setMessage('');
      setAuthorName('');
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

      <div className="interaction-buttons">
        <button 
          className="interaction-btn message-btn"
          onClick={() => setShowMessage(true)}
          title="寫下祝福"
        >
          <MessageCircle size={24} />
          <span className="count">{messages.length}</span>
          <span className="label">祝福留言</span>
        </button>

        <button 
          className="interaction-btn share-btn"
          onClick={handleShare}
          title="分享網站"
        >
          <Share2 size={24} />
          <span className="label">分享</span>
        </button>
      </div>

      {messages.length > 0 && (
        <div className="messages-section">
          <div 
            className="message-board-header" 
            onClick={() => setShowMessageBoard(!showMessageBoard)}
          >
            <h4>💬 祝福留言板 ({messages.length})</h4>
            <button className="collapse-btn">
              {showMessageBoard ? 
                <ChevronUp size={20} /> : 
                <ChevronDown size={20} />
              }
            </button>
          </div>
          
          {showMessageBoard && (
            <div className="messages-list">
              {messages.map(msg => (
                <div key={msg.id} className="message-item">
                  <div className="message-header">
                    <div className="message-author">
                      <Smile size={16} className="message-icon" />
                      <span className={msg.isAnonymous ? 'anonymous' : 'named'}>
                        {msg.author}
                      </span>
                    </div>
                    <div className="message-time">{msg.timestamp}</div>
                  </div>
                  <div className="message-content">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showMessage && (
        <div className="message-input-overlay">
          <div className="message-input-modal">
            <h4>✍️ 寫下你的生日祝福</h4>
            
            <div className="author-options">
              <label className="author-option">
                <input
                  type="radio"
                  name="authorType"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(true)}
                />
                <span>匿名祝福</span>
              </label>
              <label className="author-option">
                <input
                  type="radio"
                  name="authorType"
                  checked={!isAnonymous}
                  onChange={() => setIsAnonymous(false)}
                />
                <span>署名祝福</span>
              </label>
            </div>
            
            {!isAnonymous && (
              <div className="name-input">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="請輸入您的姓名"
                  maxLength="20"
                />
              </div>
            )}
            
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
                  setAuthorName('');
                }}
              >
                取消
              </button>
              <button 
                className="send-btn"
                onClick={handleAddMessage}
                disabled={!message.trim()}
              >
                💝 發送祝福
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveElements;
