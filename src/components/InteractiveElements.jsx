import React, { useState, useEffect } from 'react';
import { MessageCircle, Share2, Smile, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './InteractiveElements.css';

const InteractiveElements = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [messages, setMessages] = useState([]);
  const [showMessageBoard, setShowMessageBoard] = useState(true);

  // 載入 Firebase 留言數據並實時監聽
  useEffect(() => {
    const messagesRef = collection(db, 'getsuka-wishes');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString('zh-TW') || '剛剛'
      }));
      setMessages(messageList);
    }, (error) => {
      console.error('載入留言失敗:', error);
      // 如果 Firebase 失敗，回退到 localStorage
      const savedData = localStorage.getItem('birthdayMessages');
      if (savedData) {
        const data = JSON.parse(savedData);
        setMessages(data.messages || []);
      }
    });

    return () => unsubscribe();
  }, []);

  // 保存留言到 Firebase
  const saveMessage = async (messageData) => {
    try {
      await addDoc(collection(db, 'getsuka-wishes'), {
        ...messageData,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('保存留言失敗:', error);
      // 如果 Firebase 失敗，回退到 localStorage
      const savedData = localStorage.getItem('birthdayMessages');
      const existingMessages = savedData ? JSON.parse(savedData).messages || [] : [];
      const newMessages = [{
        ...messageData,
        id: Date.now(),
        timestamp: new Date().toLocaleString('zh-TW')
      }, ...existingMessages];
      localStorage.setItem('birthdayMessages', JSON.stringify({ messages: newMessages }));
      setMessages(newMessages);
    }
  };

  const handleAddMessage = async () => {
    if (message.trim()) {
      const messageData = {
        text: message.trim(),
        author: isAnonymous ? '匿名' : authorName.trim() || '匿名',
        isAnonymous: isAnonymous
      };
      
      await saveMessage(messageData);
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
            <h4>🌟 祝福留言牆 ({messages.length})</h4>
            <button className="collapse-btn">
              {showMessageBoard ? 
                <ChevronUp size={20} /> : 
                <ChevronDown size={20} />
              }
            </button>
          </div>
          
          {showMessageBoard && (
            <div className="message-wall">
              {messages.map(msg => (
                <div key={msg.id} className="message-card">
                  <div className="message-card-header">
                    <div className="author-info">
                      <div className="author-avatar">
                        <img 
                          src="/yuyuefan.png" 
                          alt="Avatar" 
                          className="avatar-image"
                          onError={(e) => {
                            // 如果圖片載入失敗，顯示預設圖標
                            e.target.style.display = 'none';
                            const fallbackIcon = document.createElement('div');
                            fallbackIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9,9h.01"></path><path d="m15,9h.01"></path><circle cx="12" cy="15" r="3"></circle></svg>';
                            fallbackIcon.className = 'avatar-fallback';
                            e.target.parentNode.appendChild(fallbackIcon);
                          }}
                        />
                      </div>
                      <div className="author-details">
                        <span className={`author-name ${msg.isAnonymous ? 'anonymous' : 'named'}`}>
                          {msg.author}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="message-card-content">
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
