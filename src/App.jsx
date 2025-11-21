import { useCalculator } from './hooks/useCalculator';
import { Card } from './components/ui/Card';
import { CalculatorForm } from './components/form/CalculatorForm';
import { CurrentStatus } from './components/results/CurrentStatus';
import { OptimizationResult } from './components/results/OptimizationResult';
import { FeeChart } from './components/results/FeeChart';
import { IntroSection } from './components/content/IntroSection';
import { FAQSection } from './components/content/FAQSection';

function App() {
  const calculator = useCalculator();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁首 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            OptiPower 契約容量最佳化計算器
          </h1>
          <p className="mt-2 text-gray-600">
            輸入您的用電資料，找出最省錢的契約容量
          </p>
        </div>
      </header>

      {/* 主內容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
            </>
          )}

          {/* FAQ 常見問題 */}
          <FAQSection />
        </div>
      </main>

      {/* 頁尾 */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>OptiPower 契約容量最佳化計算器</p>
          <p className="mt-1">
            依據台電電價表計算，僅供參考
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
