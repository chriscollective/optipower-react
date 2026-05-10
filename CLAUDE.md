# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案簡介

OptiPower 是一個給台灣「低壓電力／非時間電價」用戶使用的契約容量最佳化試算工具（社區大樓、中小企業）。使用者輸入過去 12 個月最高需量與目前契約容量，工具透過暴力搜尋找出年度基本電費最低的契約容量，並產生比較圖表與 PDF 報告。

線上版本：https://optipower.vercel.app

這是從原本的 Streamlit (Python) 版本遷移而來的 React SPA。`REFACTOR_PLAN.md` 是當時的遷移計畫文件（多數已完成，僅作歷史參考，不要當成現況描述）。

## 常用指令

```bash
npm run dev       # 啟動 Vite dev server
npm run build     # 產生 dist/ 給 Vercel
npm run lint      # ESLint（flat config）
npm run preview   # 預覽 build 後的 dist/
```

沒有測試框架。若要新增測試，需自行加入 vitest 或類似工具——請勿假設可以直接 `npm test`。

## 技術棧重點

- **React 19 + Vite 7**，純 JSX（**沒有 TypeScript**），ES modules
- **Tailwind CSS v4**：採用 CSS-first 設定，入口在 `src/index.css` 的 `@import "tailwindcss"`，**不存在 `tailwind.config.js`**。新增主題或 plugin 要透過 CSS 內的 `@theme`、`@plugin` 指令，不要建傳統 config 檔。
- **PostCSS** 用 `@tailwindcss/postcss`（非舊版 `tailwindcss` plugin）
- **Chart.js + react-chartjs-2** 處理圖表
- **jspdf + html2canvas** 處理 PDF 匯出
- **Firebase Realtime Database** 僅用於記錄瀏覽人數（`src/lib/firebase.js`）
- **@vercel/analytics** 透過 `<Analytics />`（在 `src/main.jsx`）載入
- 部署目標 **Vercel**，`vercel.json` 將所有路由 rewrite 到 `index.html`（SPA fallback）

### Firebase 設定注意事項

`src/lib/firebase.js` 的 `firebaseConfig` 包含明文 API key——**這是 Firebase web SDK 的正常用法**，安全性靠 Realtime DB 的 security rules 控制，不是秘密。掃描工具可能會誤報，不要把它移到環境變數。

DB 路徑只用 `visitorCount`（一個整數）。`useVisitorCount` 透過 `sessionStorage` 確保同 session 只 +1 一次。

## 架構

整個 app 的結構非常扁平，沒有路由：

```
main.jsx → <App />
            ├── <Sidebar />              側邊說明欄（手機版內嵌、桌機版固定 left）
            ├── <IntroSection />         介紹文
            ├── <CalculatorForm />       表單（CapacityInput + MonthlyDemandInputs）
            ├── 結果區（calculator.results 存在時才渲染）
            │     <OptimizationResult /> 摘要卡
            │     <FeeChart />           Chart.js 長條圖
            │     <CurrentStatus />      目前狀況逐月明細
            │     <OptimalStatus />      最佳容量逐月明細
            ├── <DownloadButton />       PDF 匯出（抓 #pdf-content）
            └── <FAQSection />
```

### 狀態與計算流程

所有輸入、驗證、計算結果集中在 `src/hooks/useCalculator.js`：

1. `setCapacity` 同時會把 12 個月需量自動填為 `capacity * 0.8`（使用者體驗考量，不要拿掉這個 side effect）
2. `calculate()` 呼叫順序：`validateAllInputs` → `calculateAnnualFee`（目前）→ `findOptimalCapacity`（最佳）→ `calculateAnnualFee`（最佳的明細）→ `calculateSavings` → `getFeeDistribution`（圖表）
3. 結果一律透過 `setResults({...})` 一次寫入；要修改結果欄位請同時更新 `App.jsx` 解構處與所有 `<...Status />` props

### PDF 匯出機制

`src/components/ui/DownloadButton.jsx` 用 `targetId="pdf-content"` 抓取 `App.jsx` 的 `<div id="pdf-content">`。內部 `data-pdf-section="..."` 是分頁切割的標記——新增結果區塊時若希望進入 PDF，要包進 `#pdf-content` 並加 `data-pdf-section`。

### 計算核心（`src/utils/calculator.js`）

- 夏月 = 6~9 月，費率寫死在 `constants.js`（`BASIC_FEE_SUMMER` / `BASIC_FEE_NON_SUMMER`）
- 超約罰款：超出 10% 以內 ×2，超出 10% 以上前 10% ×2、其餘 ×3（台電低壓非時間電價規則）
- `findOptimalCapacity`：搜尋範圍 = `[floor(minDemand*0.4), ceil(maxDemand*1.7)]`，步長 1 kW（`SEARCH_STEP`）。直接遍歷而非微積分求極值，因為罰款分段函數有不連續點。
- `getFeeDistribution`：給圖表用，會自適應步長控制在 ~50 個資料點，並強制把 `optimalCapacity` 與 `currentCapacity` 插入點集裡，避免標記點對不上長條。
- 所有金額用 `Math.round(x * 100) / 100` 四捨五入到分；如果改用其他精度方式，要同步更新 `validators.js` 的測試假設。

**法規／費率變動風險**：費率常數（`constants.js`）來自台電官方公告。若要更新，請以全國法規資料庫或台電官網的時刻電價表為唯一依據——不要採用部落格或新聞稿的數字。

## 編碼慣例

- **語言**：UI 文字、註解、commit message 全用繁體中文（參考既有 commit 與 `CONTENT.md`）
- **Prettier**：`semi: true`、`singleQuote: true`、`printWidth: 100`、`trailingComma: 'es5'`、2-space indent
- **ESLint** 自訂規則：`no-unused-vars` 允許大寫開頭或 `_` 開頭的變數（`varsIgnorePattern: '^[A-Z_]'`）。新增 React 元件 import 後就算暫未用到也不會報錯。
- **檔案組織**：`components/` 下按用途分群（`form/`、`results/`、`content/`、`layout/`、`ui/`），不是按型別分；新元件請依此分群放置
- **命名 export**：所有元件、hooks、util 都用 named export（`export function Foo`），App 是少數例外用 default

## UI 文字來源

`CONTENT.md` 是所有畫面文字、FAQ、側邊欄說明的「文案 source of truth」。要改文案時：

1. 先更新 `CONTENT.md`
2. 再去對應的元件（`components/content/`、`components/layout/Sidebar.jsx` 等）改 JSX

費率、月份、罰款分段這類「文字＋計算邏輯」雙邊都有的內容，**程式邏輯以 `src/utils/constants.js` 為準**，文件以 `CONTENT.md` 為準，更新時兩邊都要同步。

## Vercel 部署

`vercel.json` 已是最簡設定（framework=vite、SPA rewrite）。不要為這個 SPA 加入 `vercel.ts`、middleware、或 functions——除非有實際需要 server 端邏輯，目前完全是靜態前端 + 第三方服務（Firebase/Analytics）。
