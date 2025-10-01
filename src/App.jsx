import React from 'react';
import BirthdayWishes from './components/BirthdayWishes';
import Timeline from './components/Timeline';
import InteractiveElements from './components/InteractiveElements';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="site-title">🎉 生日祝福網站</h1>
          <p className="site-subtitle">記錄美好時光，分享溫暖祝福</p>
        </div>
      </header>

      <main className="app-main">
        {/* 生日祝福區域 */}
        <section className="section">
          <BirthdayWishes />
        </section>

        {/* 互動元素區域 */}
        <section className="section">
          <InteractiveElements />
        </section>

        {/* 時間軸區域 */}
        <section className="section">
          <Timeline />
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>💝 用心製作的生日祝福網站</p>
          <p className="footer-note">
            每一個回憶都值得被珍藏 ✨
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
