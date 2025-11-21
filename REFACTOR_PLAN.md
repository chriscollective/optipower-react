# OptiPower 重構計畫

## 從 Streamlit (Python) 遷移至 React + Vite + JavaScript + Vercel

---

## 1. 專案概覽

### 1.1 目前技術棧
- **前端框架**: Streamlit
- **程式語言**: Python
- **圖表**: Matplotlib
- **部署**: Streamlit Cloud
- **追蹤**: Google Sheets API

### 1.2 目標技術棧
- **前端框架**: React 18 + Vite
- **程式語言**: JavaScript (ES6+)
- **樣式**: Tailwind CSS
- **圖表**: Chart.js + react-chartjs-2
- **部署**: Vercel
- **追蹤**: Vercel Analytics

### 1.3 遷移目標
- 更好的效能與使用者體驗
- 更靈活的 UI 客製化
- 更快的載入速度
- 更容易維護與擴展

---

## 2. 技術選型詳細說明

### 2.1 核心框架
| 技術 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| Vite | 5.x | 建置工具 |
| React Router | 6.x | 路由（如需要） |

### 2.2 UI 與樣式
| 技術 | 用途 |
|------|------|
| Tailwind CSS | 原子化 CSS 框架 |
| Headless UI | 無樣式元件（Modal、Accordion 等） |
| Heroicons | 圖示庫 |

### 2.3 圖表
| 技術 | 用途 |
|------|------|
| Chart.js | 圖表引擎 |
| react-chartjs-2 | React 封裝 |

### 2.4 工具與品質
| 技術 | 用途 |
|------|------|
| ESLint | 程式碼檢查 |
| Prettier | 程式碼格式化 |

---

## 3. 專案目錄結構

```
optipower-react/
├── public/
│   ├── favicon.ico
│   ├── linepay_qrcode.jpg
│   └── fonts/
│       └── NotoSansTC-Regular.ttf
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── form/
│   │   │   ├── CapacityInput.jsx
│   │   │   ├── MonthlyDemandInputs.jsx
│   │   │   └── CalculateButton.jsx
│   │   ├── results/
│   │   │   ├── CurrentStatus.jsx
│   │   │   ├── OptimizationResult.jsx
│   │   │   └── FeeChart.jsx
│   │   ├── content/
│   │   │   ├── IntroSection.jsx
│   │   │   └── FAQSection.jsx
│   │   └── ui/
│   │       ├── Card.jsx
│   │       ├── Accordion.jsx
│   │       └── Alert.jsx
│   ├── utils/
│   │   ├── calculator.js        # 電費計算核心邏輯
│   │   ├── validators.js        # 輸入驗證
│   │   └── constants.js         # 常數定義
│   ├── hooks/
│   │   └── useCalculator.js     # 計算邏輯 Hook
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                # Tailwind 進入點
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
├── vercel.json
└── README.md
```

---

## 4. 功能遷移對照表

### 4.1 UI 元件對應

| Streamlit 元件 | React 實現 |
|----------------|------------|
| `st.title()` | `<h1 className="...">` |
| `st.markdown()` | JSX 或 `<ReactMarkdown>` |
| `st.number_input()` | `<input type="number">` + 狀態管理 |
| `st.form()` | React controlled form |
| `st.form_submit_button()` | `<button type="submit">` |
| `st.columns()` | Tailwind Grid/Flexbox |
| `st.sidebar` | `<Sidebar>` 元件 |
| `st.expander()` | Headless UI `<Disclosure>` |
| `st.pyplot()` | react-chartjs-2 `<Bar>` |
| `st.success/warning/error()` | 自訂 `<Alert>` 元件 |
| `st.metric()` | 自訂 `<MetricCard>` 元件 |
| `st.session_state` | `useState` / `useReducer` |

### 4.2 核心功能遷移

| 功能 | 原始檔案 | 新檔案 | 備註 |
|------|----------|--------|------|
| 電費計算 | `utils/calculator.py` | `src/utils/calculator.js` | NumPy → 原生 JS |
| 輸入驗證 | `utils/validators.py` | `src/utils/validators.js` | 邏輯相同 |
| 費率常數 | `utils/calculator.py` | `src/utils/constants.js` | 獨立檔案 |
| SEO | `app.py` | `index.html` + React Helmet | Meta tags |

---

## 5. 模組遷移詳細計畫

### 5.1 計算邏輯 (calculator.js)

#### 常數定義 (constants.js)
```javascript
// 費率常數
export const BASIC_FEE_NON_SUMMER = 173.2; // 非夏月基本電費 (元/千瓦)
export const BASIC_FEE_SUMMER = 236.2;      // 夏月基本電費 (元/千瓦)
export const SUMMER_MONTHS = [6, 7, 8, 9];  // 夏月月份

// 超約罰款倍率
export const PENALTY_RATE_UNDER_10 = 2;     // 超出 10% 以內
export const PENALTY_RATE_OVER_10 = 3;      // 超出 10% 以上
```

#### 核心函數
```javascript
// calculator.js

/**
 * 計算單月基本電費
 * @param {number} capacity - 契約容量
 * @param {number} demand - 當月最高需量
 * @param {number} month - 月份 (1-12)
 * @returns {number} 當月基本電費
 */
export function calculateMonthlyFee(capacity, demand, month) {
  // 實現計算邏輯
}

/**
 * 計算年度總費用
 * @param {number} capacity - 契約容量
 * @param {number[]} monthlyDemands - 12 個月需量陣列
 * @returns {number} 年度總費用
 */
export function calculateAnnualFee(capacity, monthlyDemands) {
  // 實現計算邏輯
}

/**
 * 尋找最佳契約容量
 * @param {number[]} monthlyDemands - 12 個月需量陣列
 * @returns {Object} { optimalCapacity, minFee, details }
 */
export function findOptimalCapacity(monthlyDemands) {
  // 實現搜尋邏輯
}

/**
 * 取得費用分布資料（供圖表使用）
 * @param {number[]} monthlyDemands - 12 個月需量陣列
 * @returns {Object} { capacities, fees }
 */
export function getFeeDistribution(monthlyDemands) {
  // 實現分布計算
}
```

### 5.2 輸入驗證 (validators.js)

```javascript
/**
 * 驗證契約容量
 * @param {number} capacity
 * @returns {Object} { isValid, error }
 */
export function validateCapacity(capacity) {
  if (!capacity || capacity <= 0) {
    return { isValid: false, error: '契約容量必須大於 0' };
  }
  if (capacity > 10000) {
    return { isValid: false, error: '契約容量不能超過 10,000 kW' };
  }
  return { isValid: true, error: null };
}

/**
 * 驗證月需量陣列
 * @param {number[]} demands
 * @returns {Object} { isValid, errors, warnings }
 */
export function validateMonthlyDemands(demands) {
  // 實現驗證邏輯
}
```

### 5.3 自訂 Hook (useCalculator.js)

```javascript
import { useState, useMemo } from 'react';
import { calculateAnnualFee, findOptimalCapacity, getFeeDistribution } from '../utils/calculator';
import { validateCapacity, validateMonthlyDemands } from '../utils/validators';

export function useCalculator() {
  const [capacity, setCapacity] = useState('');
  const [monthlyDemands, setMonthlyDemands] = useState(Array(12).fill(''));
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  const calculate = () => {
    // 驗證輸入
    const capacityValidation = validateCapacity(Number(capacity));
    const demandsValidation = validateMonthlyDemands(monthlyDemands.map(Number));

    if (!capacityValidation.isValid || !demandsValidation.isValid) {
      setErrors({ capacity: capacityValidation.error, demands: demandsValidation.errors });
      return;
    }

    // 執行計算
    const currentFee = calculateAnnualFee(Number(capacity), monthlyDemands.map(Number));
    const optimal = findOptimalCapacity(monthlyDemands.map(Number));
    const distribution = getFeeDistribution(monthlyDemands.map(Number));

    setResults({
      currentFee,
      optimalCapacity: optimal.optimalCapacity,
      optimalFee: optimal.minFee,
      savings: currentFee - optimal.minFee,
      chartData: distribution,
    });
  };

  return {
    capacity,
    setCapacity,
    monthlyDemands,
    setMonthlyDemands,
    results,
    errors,
    calculate,
  };
}
```

---

## 6. UI 元件實現範例

### 6.1 主要佈局 (App.jsx)

```jsx
import { Sidebar } from './components/layout/Sidebar';
import { IntroSection } from './components/content/IntroSection';
import { CalculatorForm } from './components/form/CalculatorForm';
import { Results } from './components/results/Results';
import { FAQSection } from './components/content/FAQSection';
import { Footer } from './components/layout/Footer';
import { useCalculator } from './hooks/useCalculator';

function App() {
  const calculator = useCalculator();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 側邊欄 */}
      <Sidebar />

      {/* 主內容 */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <IntroSection />

          <CalculatorForm
            {...calculator}
            onSubmit={calculator.calculate}
          />

          {calculator.results && (
            <Results results={calculator.results} />
          )}

          <FAQSection />
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;
```

### 6.2 輸入表單範例

```jsx
// components/form/MonthlyDemandInputs.jsx
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'];

export function MonthlyDemandInputs({ values, onChange, errors }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {MONTHS.map((month, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {month}
          </label>
          <input
            type="number"
            value={values[index]}
            onChange={(e) => onChange(index, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm
              focus:ring-blue-500 focus:border-blue-500
              ${errors?.[index] ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="kW"
            min="0"
            step="0.1"
          />
          {errors?.[index] && (
            <p className="mt-1 text-sm text-red-600">{errors[index]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 6.3 圖表元件範例

```jsx
// components/results/FeeChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function FeeChart({ data, currentCapacity, optimalCapacity }) {
  const chartData = {
    labels: data.capacities.map(c => `${c} kW`),
    datasets: [
      {
        label: '年度基本電費',
        data: data.fees,
        backgroundColor: data.capacities.map(c =>
          c === optimalCapacity ? 'rgba(34, 197, 94, 0.8)' :
          c === currentCapacity ? 'rgba(59, 130, 246, 0.8)' :
          'rgba(156, 163, 175, 0.5)'
        ),
        borderColor: data.capacities.map(c =>
          c === optimalCapacity ? 'rgb(34, 197, 94)' :
          c === currentCapacity ? 'rgb(59, 130, 246)' :
          'rgb(156, 163, 175)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '不同契約容量的年度費用比較',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y.toLocaleString()} 元`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} 元`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
```

---

## 7. Vercel 部署配置

### 7.1 vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 7.2 環境變數

在 Vercel Dashboard 設定：
- `VITE_SITE_URL` - 網站 URL（用於 SEO）

### 7.3 Vercel Analytics 設定

1. 在 Vercel Dashboard 啟用 Analytics
2. 安裝套件：
   ```bash
   npm install @vercel/analytics
   ```
3. 在 main.jsx 加入：
   ```jsx
   import { Analytics } from '@vercel/analytics/react';

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <App />
       <Analytics />
     </React.StrictMode>
   );
   ```

---

## 8. 開發階段與里程碑

### Phase 1: 專案初始化
- [ ] 建立 Vite + React 專案
- [ ] 設定 Tailwind CSS
- [ ] 設定 ESLint + Prettier
- [ ] 建立目錄結構

### Phase 2: 核心邏輯遷移
- [ ] 遷移 constants.js
- [ ] 遷移 calculator.js（含單元測試）
- [ ] 遷移 validators.js（含單元測試）
- [ ] 建立 useCalculator hook

### Phase 3: UI 元件開發
- [ ] 建立基礎 UI 元件（Card, Alert, Accordion）
- [ ] 建立 Layout 元件（Header, Sidebar, Footer）
- [ ] 建立表單元件
- [ ] 建立結果顯示元件
- [ ] 整合圖表元件

### Phase 4: 內容與樣式
- [ ] 遷移所有文字內容
- [ ] 調整響應式設計
- [ ] 最佳化行動裝置體驗

### Phase 5: SEO 與最佳化
- [ ] 設定 index.html meta tags
- [ ] 加入 Open Graph tags
- [ ] 加入 JSON-LD 結構化資料
- [ ] 最佳化效能（lazy loading 等）

### Phase 6: 部署與監控
- [ ] 設定 Vercel 專案
- [ ] 啟用 Vercel Analytics
- [ ] 設定自訂網域（如有）
- [ ] 測試正式環境

---

## 9. 注意事項與風險

### 9.1 需特別注意

1. **浮點數精度**
   - JavaScript 浮點數運算可能有精度問題
   - 建議使用 `toFixed()` 或專門的數學庫處理金額

2. **表單驗證時機**
   - 需決定即時驗證 vs 提交時驗證
   - 建議：輸入時即時驗證，但錯誤訊息在 blur 後顯示

3. **圖表效能**
   - 當容量範圍很大時，圖表資料點可能很多
   - 考慮限制顯示範圍或採樣

4. **SEO 考量**
   - SPA 的 SEO 較差，但對工具類網站影響不大
   - 如需更好 SEO，可考慮 Next.js

### 9.2 可能的挑戰

1. **NumPy 功能轉換**
   - `np.arange()` → 自己實現或用 lodash `_.range()`
   - `np.argmin()` → 使用 `reduce` 找最小值索引

2. **中文字體載入**
   - 確保字體檔案正確載入
   - 考慮使用 Google Fonts CDN

3. **行動裝置輸入**
   - 12 個月份輸入在手機上較繁瑣
   - 考慮改進 UX（如滑動輸入、複製貼上）

---

## 10. 相關資源

### 官方文件
- [Vite 文件](https://vitejs.dev/)
- [React 文件](https://react.dev/)
- [Tailwind CSS 文件](https://tailwindcss.com/)
- [Chart.js 文件](https://www.chartjs.org/)
- [Vercel 文件](https://vercel.com/docs)

### 有用的工具
- [Tailwind UI](https://tailwindui.com/) - UI 元件範例
- [Headless UI](https://headlessui.com/) - 無樣式元件
- [Heroicons](https://heroicons.com/) - 圖示

---

## 更新紀錄

| 日期 | 版本 | 說明 |
|------|------|------|
| 2025-01-21 | 1.0 | 初版建立 |

