# 部署指南 - Zeabur

## 📋 部署前準備

### 1. 環境變數設置

在部署到 Zeabur 之前，需要設置以下環境變數：

```bash
VITE_FIREBASE_API_KEY=你的_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=你的專案ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的專案ID
VITE_FIREBASE_STORAGE_BUCKET=你的專案ID.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=你的_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=你的_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=你的_MEASUREMENT_ID
```

### 2. 本地開發環境

1. 複製環境變數範例檔：
   ```bash
   cp .env.example .env.local
   ```

2. 編輯 `.env.local` 檔案，填入你的 Firebase 配置值

3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

## 🚀 Zeabur 部署步驟

### 方法一：GitHub 連接部署

1. **推送代碼到 GitHub**：
   ```bash
   git add .
   git commit -m "Add environment variables and deployment config"
   git push origin main
   ```
   
   ⚠️ **注意**：`.env.local` 檔案不會被推送到 GitHub（已在 .gitignore 中忽略）

2. **登入 Zeabur**：
   - 前往 [Zeabur Dashboard](https://dash.zeabur.com/)
   - 使用 GitHub 帳號登入

3. **創建新專案**：
   - 點擊 "New Project"
   - 選擇從 GitHub 匯入
   - 選擇 `getsuka-birthday` 倉庫

4. **配置環境變數**：
   在 Zeabur 專案設置中添加以下環境變數：
   
   - `VITE_FIREBASE_API_KEY`: `你的_Firebase_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`: `getsuka-birthday.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID`: `getsuka-birthday`
   - `VITE_FIREBASE_STORAGE_BUCKET`: `getsuka-birthday.firebasestorage.app`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: `你的_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`: `你的_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`: `你的_MEASUREMENT_ID`

5. **部署**：
   - Zeabur 會自動檢測到這是一個 Vite 專案
   - 自動執行 `npm install` 和 `npm run build`
   - 部署完成後會提供一個公開 URL

### 方法二：CLI 部署

1. **安裝 Zeabur CLI**：
   ```bash
   npm install -g @zeabur/cli
   ```

2. **登入**：
   ```bash
   zeabur auth login
   ```

3. **部署**：
   ```bash
   zeabur deploy
   ```

## 🔒 安全性檢查

### 確認敏感資訊已隱藏

1. **檢查 Git 狀態**：
   ```bash
   git status
   ```
   確認 `.env.local` 不在追蹤列表中

2. **檢查 GitHub 倉庫**：
   - 前往 GitHub 倉庫頁面
   - 確認沒有 `.env.local` 檔案
   - 確認 `src/firebase.ts` 中使用環境變數而非硬編碼值

3. **檢查部署後的網站**：
   - 開啟瀏覽器開發者工具
   - 查看 Network 標籤
   - 確認 Firebase 請求正常運作

## 📝 注意事項

### Firebase 安全規則

確保 Firestore 安全規則設置正確：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /getsuka-timeline/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 環境變數管理

- ✅ **本地開發**：使用 `.env.local`
- ✅ **生產環境**：在 Zeabur Dashboard 設置
- ❌ **不要**：將敏感資訊提交到 Git

### 自動部署

設置完成後，每次推送到 `main` 分支，Zeabur 會自動重新部署網站。

## 🛠️ 故障排除

### 1. Firebase 連接失敗
- 檢查環境變數是否正確設置
- 確認 Firebase 專案狀態
- 檢查網路連接

### 2. 部署失敗
- 檢查 `package.json` 中的構建腳本
- 查看 Zeabur 部署日誌
- 確認所有依賴項已安裝

### 3. 環境變數未生效
- 確認變數名稱以 `VITE_` 開頭
- 重新構建並部署專案
- 檢查 Zeabur 環境變數設置

## 📞 支援

如有部署問題，請參考：
- [Zeabur 官方文檔](https://zeabur.com/docs)
- [Vite 環境變數文檔](https://vitejs.dev/guide/env-and-mode.html)