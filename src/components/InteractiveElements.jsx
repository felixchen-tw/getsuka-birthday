import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MessageCircle, Share2, Smile, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './InteractiveElements.css';

// 優化：將留言卡片抽取為獨立組件並使用 React.memo
const MessageCard = React.memo(({ message }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="message-card">
      <div className="message-card-header">
        <div className="author-info">
          <div className="author-avatar">
            {!imageError ? (
              <img 
                src="/yuyuefan.png" 
                alt="Avatar" 
                className="avatar-image"
                onError={handleImageError}
              />
            ) : (
              <div className="avatar-fallback">
                <Smile size={18} />
              </div>
            )}
          </div>
          <div className="author-details">
            <span className={`author-name ${message.isAnonymous ? 'anonymous' : 'named'}`}>
              {message.author}
            </span>
          </div>
        </div>
      </div>
      <div className="message-card-content">
        {message.text}
      </div>
    </div>
  );
});

MessageCard.displayName = 'MessageCard';

const InteractiveElements = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [messages, setMessages] = useState([]);
  const [showMessageBoard, setShowMessageBoard] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // 防抖搜索
  const debounceRef = useRef(null);

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
      setLoading(false);
    }, (error) => {
      console.error('載入留言失敗:', error);
      // 如果 Firebase 失敗，回退到 localStorage
      const savedData = localStorage.getItem('birthdayMessages');
      if (savedData) {
        const data = JSON.parse(savedData);
        setMessages(data.messages || []);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 優化：使用 useCallback 避免重新創建函數
  const saveMessage = useCallback(async (messageData) => {
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
  }, []);

  const handleAddMessage = useCallback(async () => {
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
  }, [message, isAnonymous, authorName, saveMessage]);

  const handleShare = useCallback(async () => {
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
  }, []);

  const toggleMessageBoard = useCallback(() => {
    setShowMessageBoard(prev => !prev);
  }, []);

  const openMessageInput = useCallback(() => {
    setShowMessage(true);
  }, []);

  const closeMessageInput = useCallback(() => {
    setShowMessage(false);
    setMessage('');
    setAuthorName('');
  }, []);

  // 優化：防抖輸入處理
  const handleInputChange = useCallback((value, setter) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setter(value);
    }, 150);
  }, []);

  // 優化：使用 useMemo 避免重複計算
  const messageCount = useMemo(() => messages.length, [messages.length]);

  const renderedMessages = useMemo(() => {
    if (loading) {
      return <div className="loading-messages">載入中...</div>;
    }
    return messages.map(msg => (
      <MessageCard key={msg.id} message={msg} />
    ));
  }, [messages, loading]);

  return (
    <div className="interactive-elements">
      <div className="interaction-header">
        <h3>🎈 互動區域</h3>
        <p>留下你的祝福與愛心</p>
      </div>

      <div className="interaction-buttons">
        <button 
          className="interaction-btn message-btn"
          onClick={openMessageInput}
          title="寫下祝福"
        >
          <MessageCircle size={24} />
          <span className="count">{messageCount}</span>
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

      {messageCount > 0 && (
        <div className="messages-section">
          <div 
            className="message-board-header" 
            onClick={toggleMessageBoard}
          >
            <h4>🌟 祝福留言牆 ({messageCount})</h4>
            <button className="collapse-btn">
              {showMessageBoard ? 
                <ChevronUp size={20} /> : 
                <ChevronDown size={20} />
              }
            </button>
          </div>
          
          {showMessageBoard && (
            <div className="message-wall">
              {renderedMessages}
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
              onChange={(e) => {
                const value = e.target.value;
                setMessage(value);
                // 防抖處理字數統計更新
                handleInputChange(value, () => {});
              }}
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
                onClick={closeMessageInput}
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
