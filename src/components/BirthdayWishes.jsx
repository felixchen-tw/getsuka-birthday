import React, { useState } from 'react';
import { Heart, Sparkles, Gift, Cake } from 'lucide-react';
import './BirthdayWishes.css';

const BirthdayWishes = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCelebrate = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  return (
    <div className="birthday-wishes">
      <div className={`wishes-header ${isAnimating ? 'celebrate' : ''}`}>
        <div className="sparkles-container">
          <Sparkles className="sparkle sparkle-1" />
          <Sparkles className="sparkle sparkle-2" />
          <Sparkles className="sparkle sparkle-3" />
        </div>
        
        <h1 className="birthday-title">
          <Cake className="cake-icon" />
          生日快樂！
          <Gift className="gift-icon" />
        </h1>
        
        <p className="birthday-subtitle">
          願你的每一天都充滿歡樂與驚喜
        </p>
        
        <button 
          className="celebrate-btn"
          onClick={handleCelebrate}
          disabled={isAnimating}
        >
          <Heart className="heart-icon" />
          {isAnimating ? '慶祝中...' : '點擊慶祝'}
          <Heart className="heart-icon" />
        </button>
      </div>
      
      <div className="wishes-content">
        <div className="wish-card">
          <h3>🎈 祝福語</h3>
          <p>
            在這個特別的日子裡，<br />
            願所有的美好都與你相遇，<br />
            願所有的夢想都能成真！
          </p>
        </div>
        
        <div className="wish-card">
          <h3>🌟 心願</h3>
          <p>
            希望你永遠保持那顆<br />
            純真善良的心，<br />
            繼續發光發熱！
          </p>
        </div>
        
        <div className="wish-card">
          <h3>🎂 祝願</h3>
          <p>
            生日蛋糕甜甜的，<br />
            生活也要甜甜的，<br />
            每天都有新的收穫！
          </p>
        </div>
      </div>
    </div>
  );
};

export default BirthdayWishes;