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
          <h1 className="site-title">玥華生日網站</h1>
          <p className="site-subtitle">記錄玥華大小事</p>
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
          <p>Made by Felix</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
