import React from 'react';
import { Sparkles, Gift, Cake } from 'lucide-react';
import './BirthdayWishes.css';

const BirthdayWishes = () => {
  return (
    <div className="birthday-wishes">
      <div className="wishes-header">
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
          願妳的每一天都充滿歡樂與驚喜
        </p>
      </div>
      
      <div className="wishes-content">
        <div className="wish-card">
          <h3>🎈</h3>
          <p>
            在這個特別的日子裡，<br />
            做一個特別網站<br />
            送給特別的妳
          </p>
        </div>
        
        <div className="wish-card">
          <h3>🌟</h3>
          <p>
            祝福玥華早日達到銀盾，<br />
            開開心心地生活，<br />
            繼續發光發熱！
          </p>
        </div>
        
        <div className="wish-card">
          <h3>🎂</h3>
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