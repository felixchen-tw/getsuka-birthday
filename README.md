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
- 祝福留言系統（Firebase 實時同步）
- 分享功能
- 跨設備留言共享
- 實時留言更新
- 動畫效果

## 🛠️ 技術架構

- **前端框架**: React 19.1.1
- **構建工具**: Vite 7.1.7  
- **資料庫**: Firebase Firestore
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
├── index.css           # 全域樣式
└── main.jsx            # 應用入口
```

## 🎯 Firebase 資料結構

### Timeline 集合 (getsuka-timeline)
```json
{
  "title": "生日聚會",
  "date": "2024-03-21T12:00:00Z", 
  "mediaType": "youtube",
  "link": "https://www.youtube.com/watch?v=example"
}

// 圖片範例
{
  "title": "生日蛋糕",
  "date": "2024-03-21T15:30:00Z",
  "mediaType": "image", 
  "link": "https://example.com/birthday-cake.jpg"
}

// 文字記錄範例  
{
  "title": "生日感想",
  "date": "2024-03-21T20:00:00Z",
  "mediaType": "record",
  "link": ""
}
```

### Wishes 集合 (getsuka-wishes)
```json
{
  "text": "祝你生日快樂！🎂🎉",
  "author": "小明",
  "isAnonymous": false,
  "timestamp": "Timestamp (serverTimestamp)"
}
```

### 支持的媒體類型
- `video` - 影片
- `image` - 照片
- `record` - 文字

## 🚀 開始使用

### 1. 安裝依賴
```bash
npm install
```

### 2. 環境變數設置
```bash
# 複製環境變數範例檔案
cp .env.example .env.local

# 編輯 .env.local 填入你的 Firebase 配置
```

### 3. Firebase 配置
在 `.env.local` 中設置你的 Firebase 配置值，而非直接修改程式碼。

### 4. 啟動開發服務器
```bash
npm run dev
```

### 5. 構建生產版本
```bash
npm run build
```

## 🔒 安全部署

### 環境變數保護
- 敏感的 Firebase 配置已移至環境變數
- `.env.local` 已加入 `.gitignore`，不會被推送到 GitHub
- 詳細部署指南請參考 `DEPLOYMENT.md`

### Zeabur 部署
```bash
# 確保環境變數已設置
# 推送到 GitHub 後在 Zeabur Dashboard 配置環境變數
# 詳細步驟請參考 DEPLOYMENT.md
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
2. **離線儲存**: 互動數據本地存儲，刷新不丟失  
3. **動畫效果**: 豐富的 CSS 動畫提升用戶體驗
4. **分享功能**: 支持原生分享 API 和備用方案
