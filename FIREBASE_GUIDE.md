# Firebase 數據管理指南

## 📋 數據結構

在 Firestore 中創建 `timeline` 集合，每個文檔包含以下字段：

### 實際字段結構
- `title` (string): 標題
- `date` (timestamp): 日期時間
- `mediaType` (string): 媒體類型
- `link` (string): 連結 URL

## 🎯 支持的媒體類型

### YouTube 影片範例 (`mediaType: 'youtube'`)
```json
{
  "title": "出道",
  "date": "March 21, 2024 at 9:00:00 PM UTC+8",
  "mediaType": "youtube",
  "link": "https://youtu.be/gZPIG8xRXw"
}
```

### 其他可能的 mediaType 值
- `youtube`: YouTube 影片
- `video`: 一般影片
- `image`: 圖片
- `audio`: 音頻
- `text`: 純文字

## 🔧 Firebase Console 操作

### 1. 訪問 Firestore
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇項目 `getsuka-birthday`
3. 點擊左側菜單 "Firestore Database"

### 2. 創建數據
1. 點擊 "開始集合"
2. 集合 ID 輸入：`timeline`
3. 添加第一個文檔
4. 填入上述字段和數據

### 3. 安全規則設置 - 禁止前端寫入
在 "Rules" 標籤中設置以下規則，**完全禁止前端寫入**：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 只允許讀取，完全禁止前端寫入
    match /timeline/{document} {
      allow read: if true;           // 允許讀取
      allow write: if false;         // 禁止所有寫入操作
      allow create: if false;        // 禁止創建
      allow update: if false;        // 禁止更新
      allow delete: if false;        // 禁止刪除
    }
  }
}
```

**重要提醒**：
- 只有 Firebase Console 或後端服務器可以修改數據
- 前端網頁完全無法進行任何寫入操作
- 這確保了數據的安全性和完整性

## 📸 圖片託管建議

### 選項 1: Firebase Storage
1. 在 Firebase Console 中啟用 Storage
2. 上傳圖片獲得下載 URL
3. 在 Firestore 中使用該 URL

### 選項 2: 第三方服務
- **Unsplash**: 免費高質量圖片
  - 格式：`https://images.unsplash.com/photo-{ID}?w=500&h=300&fit=crop`
- **Cloudinary**: 圖片處理服務
- **Imgur**: 圖片託管

### 選項 3: 自己的服務器
將圖片上傳到您的服務器，使用絕對 URL

## 🎥 YouTube 影片支持

系統會自動：
1. 從 YouTube URL 提取影片 ID
2. 生成縮圖 URL：`https://img.youtube.com/vi/{VIDEO_ID}/mqdefault.jpg`
3. 顯示播放按鈕覆蓋層
4. 點擊後導向 YouTube 原始影片

支持的 YouTube URL 格式：
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### YouTube 疑難排解

如果 YouTube 影片無法正確顯示：

1. **檢查影片 ID 格式**：
   - 標準 YouTube 影片 ID 應該是 11 個字符
   - 例如：dQw4w9WgXcQ

2. **更新影片連結**：
   - ✅ 正確的影片連結：https://youtu.be/gZPl4G8xRXw
   - ❌ 舊的錯誤連結：https://youtu.be/gZPIG8xRXw （缺少字符）

3. **測試縮圖可用性**：
   ```bash
   curl -I "https://img.youtube.com/vi/您的影片ID/mqdefault.jpg"
   ```

4. **支援的 URL 格式**：
   - https://youtu.be/影片ID
   - https://www.youtube.com/watch?v=影片ID

### 如何更新 Firebase 中的影片連結

請按照以下步驟更新 Firebase Firestore 中的影片連結：

1. **登入 Firebase Console**：
   - 訪問 https://console.firebase.google.com/
   - 選擇您的專案

2. **進入 Firestore Database**：
   - 點擊左側選單的 "Firestore Database"
   - 找到 `timeline` 集合

3. **找到影片文件**：
   - 在 timeline 集合中找到包含 YouTube 影片的文件
   - 通常文件 ID 類似 `2024-12-24` 或其他日期格式

4. **更新影片連結**：
   - 點擊要編輯的文件
   - 找到 `media` 或 `youtubeUrl` 欄位
   - 將舊連結 `https://youtu.be/gZPIG8xRXw` 更新為 `https://youtu.be/gZPl4G8xRXw`
   - 點擊 "更新" 按鈕儲存變更

5. **驗證變更**：
   - 重新整理您的網站
   - 應該可以看到正確的 YouTube 縮圖和連結

## 📱 前端顯示效果

### YouTube 影片
- 顯示影片縮圖
- 播放按鈕覆蓋層
- 懸停縮放效果
- 點擊跳轉到 YouTube

### 圖片
- 響應式圖片顯示
- 懸停輕微縮放
- 加載失敗自動隱藏
- 統一尺寸比例

### 其他信息
- 標題和媒體類型徽章
- 日期時間格式化
- 地點信息
- 描述文字
- 標籤雲
- 外部連結

## 🔄 數據同步

- 使用 Firebase 實時監聽器
- 數據更新自動同步到前端
- 無需刷新頁面
- 支持多設備同時查看

## ⚠️ 注意事項

1. **安全性**: 前端無法修改數據，只能讀取
2. **性能**: 圖片建議壓縮後上傳
3. **格式**: 日期使用 ISO 8601 格式
4. **順序**: 按日期降序排列顯示
5. **錯誤**: 圖片加載失敗會自動隱藏

## 🚀 快速添加示例數據

### ⚠️ 當前影片問題
您的影片 `gZPIG8xRXw` 似乎不存在或不可用。建議：

1. **檢查原始影片**：訪問 https://youtu.be/gZPIG8xRXw 確認影片狀態
2. **使用測試影片**：先用已知有效的影片測試功能

### 🔧 臨時測試用影片

在 Firebase Console 中可以添加以下**有效的測試影片**：

```javascript
// 測試用影片 1 - Rick Astley (經典測試影片)
{
  title: "Never Gonna Give You Up",
  date: new Date("2024-03-21T21:00:00+08:00"),
  mediaType: "youtube",
  link: "https://youtu.be/dQw4w9WgXcQ"
}

// 測試用影片 2 - 短影片
{
  title: "YouTube Shorts 測試",
  date: new Date("2024-03-20T15:30:00+08:00"),
  mediaType: "youtube",
  link: "https://youtu.be/jNQXAC9IVRw"
}

// 您的原始影片 (目前有問題)
{
  title: "出道",
  date: new Date("2024-03-21T21:00:00+08:00"),
  mediaType: "youtube",
  link: "https://youtu.be/gZPIG8xRXw"  // ⚠️ 可能無效
}
```

### 🛠️ 替換步驟

1. 在 Firebase Console 中編輯您的文檔
2. 將 `link` 字段暫時改為測試影片
3. 確認功能正常後，再查找正確的影片連結