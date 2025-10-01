# 生日祝福網站

一個使用 React + Firebase 開發的生日祝福網站，包含生日祝福元素、縱向時間軸和互動功能。

## ✨ 功能特色

### 🎂 生日祝福元素
- 動畫祝福卡片
- 互動慶祝按鈕  
- 美麗的視覺效果
- 響應式設計

### 🕰️ 縱向時間軸
- Firebase 實時數據同步
- 支持多種媒體類型（影片、照片、音頻、文字）
- 可添加地點、連結、標籤
- 時間軸項目的動態顯示

### 🎈 互動元素
- 點讚、愛心、收藏功能
- 祝福留言系統
- 分享功能
- 本地數據存儲
- 動畫效果

## 🛠️ 技術架構

- **前端框架**: React 19.1.1
- **構建工具**: Vite 7.1.7  
- **數據庫**: Firebase Firestore
- **圖標**: Lucide React
- **樣式**: CSS3 + CSS 變量

## 📁 項目結構

```
src/
├── components/           # React 組件
│   ├── BirthdayWishes.jsx      # 生日祝福組件
│   ├── BirthdayWishes.css      # 祝福組件樣式
│   ├── Timeline.jsx            # 時間軸組件
│   ├── Timeline.css           # 時間軸樣式
│   ├── InteractiveElements.jsx # 互動元素組件
│   ├── InteractiveElements.css # 互動元素樣式
│   ├── AddTimelineForm.jsx     # 添加時間軸表單
│   └── AddTimelineForm.css     # 表單樣式
├── hooks/               # 自定義 Hooks
│   └── useTimeline.js          # 時間軸數據管理
├── firebase.ts          # Firebase 配置
├── App.jsx             # 主應用組件
├── App.css             # 主應用樣式
├── index.css           # 全局樣式
└── main.jsx            # 應用入口
```

## 🎯 Firebase 數據結構

### Timeline 集合
```json
{
  "title": "生日聚會",
  "date": "2024-03-21T12:00:00Z",
  "mediaType": "video",
  "link": "https://www.youtube.com/watch?v=example",
  "location": "台北 101",
  "description": "和朋友一起慶祝生日的美好時光",
  "tags": ["生日", "朋友", "慶祝"],
  "createdAt": "serverTimestamp"
}
```

### 支持的媒體類型
- `video` - 影片
- `image` - 照片  
- `audio` - 音頻
- `text` - 文字

## 🚀 開始使用

### 1. 安裝依賴
```bash
npm install
```

### 2. Firebase 配置
確保 `src/firebase.ts` 中的 Firebase 配置正確設置。

### 3. 啟動開發服務器
```bash
npm run dev
```

### 4. 構建生產版本
```bash
npm run build
```

## 🎨 設計特點

### 視覺設計
- 漸變背景和卡片設計
- 流暢的動畫效果
- 現代化的 UI 組件
- 一致的色彩系統

### 用戶體驗
- 直觀的操作界面
- 實時數據更新
- 本地數據持久化
- 移動端適配

### 擴展性
- 模塊化組件設計
- 可配置的樣式系統
- 靈活的數據結構
- 易於添加新功能

## 🔧 自定義配置

### 顏色主題
在 `src/index.css` 中修改 CSS 變量：
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  /* 更多變量... */
}
```

### Firebase 規則
建議的 Firestore 安全規則：
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /timeline/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 響應式支持

- 桌面端：完整功能體驗
- 平板端：優化的佈局
- 移動端：觸摸友好的交互

## 🎁 特色功能

1. **實時同步**: 使用 Firebase 實現多設備實時同步
2. **離線存儲**: 互動數據本地存儲，刷新不丟失  
3. **動畫效果**: 豐富的 CSS 動畫提升用戶體驗
4. **分享功能**: 支持原生分享 API 和備用方案
5. **無障礙設計**: 良好的鍵盤導航和屏幕閱讀器支持

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request 來改進這個項目！

## 📄 授權

MIT License
