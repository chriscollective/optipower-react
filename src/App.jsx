import { useCalculator } from './hooks/useCalculator';
import { Card } from './components/ui/Card';
import { CalculatorForm } from './components/form/CalculatorForm';
import { CurrentStatus } from './components/results/CurrentStatus';
import { OptimalStatus } from './components/results/OptimalStatus';
import { OptimizationResult } from './components/results/OptimizationResult';
import { FeeChart } from './components/results/FeeChart';
import { IntroSection } from './components/content/IntroSection';
import { FAQSection } from './components/content/FAQSection';
import { Sidebar } from './components/layout/Sidebar';

function App() {
  const calculator = useCalculator();

  return (
    <div className="min-h-screen">
      {/* 頁首 */}
      <header className="sticky top-0 z-50 border-b border-gray-200/30">
        {/* 漸層背景層 */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-white/90 to-slate-50/95 backdrop-blur-md"></div>
        {/* 裝飾線條 */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"></div>
        {/* 內容 */}
        <div className="relative w-full px-4 py-5 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            ⚡ 契約容量最佳化計算工具｜OptiPower
          </h1>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            專為台灣低壓電力用戶打造的免費電費最佳化試算
          </p>
        </div>
      </header>

      {/* 主內容區域 */}
      <div className="flex">
        {/* 左側固定側邊欄 */}
        <div className="hidden lg:block fixed left-0 top-[4.5rem] bottom-0 w-[40rem] p-4 overflow-y-auto">
          <Sidebar />
        </div>

        {/* 右側主內容 - 置中 */}
        <main className="flex-1 lg:ml-[40rem]">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* 手機版側邊欄 */}
            <div className="lg:hidden mb-6">
              <Sidebar />
            </div>

            {/* 介紹說明 */}
            <IntroSection />

            {/* 計算表單 */}
            <Card title="輸入資料" className="mb-6">
              <CalculatorForm
                capacity={calculator.capacity}
                setCapacity={calculator.setCapacity}
                monthlyDemands={calculator.monthlyDemands}
                updateDemand={calculator.updateDemand}
                errors={calculator.errors}
                warnings={calculator.warnings}
                onSubmit={calculator.calculate}
                onReset={calculator.reset}
                isCalculating={calculator.isCalculating}
                canCalculate={calculator.canCalculate}
              />
            </Card>

            {/* 計算結果 */}
            {calculator.results && (
              <>
                {/* 最佳化建議 */}
                <OptimizationResult
                  currentCapacity={calculator.results.currentCapacity}
                  currentFee={calculator.results.currentFee}
                  optimalCapacity={calculator.results.optimalCapacity}
                  optimalFee={calculator.results.optimalFee}
                  savings={calculator.results.savings}
                  savingsRate={calculator.results.savingsRate}
                />

                {/* 費用分布圖 */}
                <FeeChart
                  chartData={calculator.results.chartData}
                  currentCapacity={calculator.results.currentCapacity}
                  optimalCapacity={calculator.results.optimalCapacity}
                />

                {/* 目前狀況明細 */}
                <CurrentStatus
                  capacity={calculator.results.currentCapacity}
                  totalFee={calculator.results.currentFee}
                  monthlyDetails={calculator.results.currentMonthlyDetails}
                />

                {/* 變更後契約狀況 */}
                <OptimalStatus
                  capacity={calculator.results.optimalCapacity}
                  totalFee={calculator.results.optimalFee}
                  monthlyDetails={calculator.results.optimalMonthlyDetails}
                />
              </>
            )}

            {/* FAQ 常見問題 */}
            <FAQSection />
          </div>

          {/* 頁尾 */}
          <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 mt-12">
            <div className="max-w-4xl mx-auto px-4 py-6 text-center">
              <p className="text-sm text-gray-500">
                Copyright ©2025 Chris Du. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Made with ❤️ for Taiwan Power Users
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
