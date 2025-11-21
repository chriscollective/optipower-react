function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主內容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            OptiPower 契約容量最佳化計算器
          </h1>
          <p className="text-gray-600 mb-8">
            專案初始化完成，準備進入 Phase 2 開發階段。
          </p>

          {/* 測試 Tailwind CSS */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Phase 1 完成項目
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>✅ Vite + React 專案建立</li>
              <li>✅ Tailwind CSS 設定</li>
              <li>✅ ESLint + Prettier 設定</li>
              <li>✅ 目錄結構建立</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
