// 最佳化結果顯示元件 - 現代精緻風格

import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';

export function OptimizationResult({
  currentCapacity,
  currentFee,
  optimalCapacity,
  optimalFee,
  savings,
  savingsRate,
}) {
  const hasSavings = savings > 0;
  const needsIncrease = optimalCapacity > currentCapacity;
  const needsDecrease = optimalCapacity < currentCapacity;
  const isOptimal = optimalCapacity === currentCapacity;

  return (
    <Card title="最佳化建議" className="mb-6 animate-fadeIn">
      {/* 結果摘要 */}
      {isOptimal ? (
        <Alert variant="success" className="mb-6">
          <p className="font-semibold">恭喜！您目前的契約容量已是最佳選擇。</p>
        </Alert>
      ) : (
        <Alert variant="info" className="mb-6">
          <p>
            建議將契約容量
            {needsIncrease ? (
              <span className="font-bold text-blue-700"> 調高 </span>
            ) : (
              <span className="font-bold text-blue-700"> 調低 </span>
            )}
            至 <span className="font-bold text-lg">{optimalCapacity.toLocaleString()} kW</span>
          </p>
        </Alert>
      )}

      {/* 比較表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 目前 */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-5 border border-gray-200/50">
          <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            目前契約
          </h4>
          <p className="text-xl font-bold text-gray-800 mb-2">
            {currentCapacity.toLocaleString()} kW
          </p>
          <p className="text-3xl font-bold text-gray-700">
            {Math.round(currentFee).toLocaleString()}
            <span className="text-base font-medium text-gray-500 ml-1">元/年</span>
          </p>
        </div>

        {/* 最佳 */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-5 border border-emerald-200/50 shadow-sm shadow-emerald-100">
          <h4 className="text-sm font-semibold text-emerald-600 mb-3 uppercase tracking-wide">
            建議契約
          </h4>
          <p className="text-xl font-bold text-emerald-800 mb-2">
            {optimalCapacity.toLocaleString()} kW
          </p>
          <p className="text-3xl font-bold text-emerald-700">
            {Math.round(optimalFee).toLocaleString()}
            <span className="text-base font-medium text-emerald-600 ml-1">元/年</span>
          </p>
        </div>
      </div>

      {/* 節省金額 */}
      {hasSavings && (
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/60 rounded-xl p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-amber-700 mb-2">
            💰 優化後一年可節省金額
          </p>
          <p className="text-4xl font-bold text-amber-600 mb-2">
            {Math.round(savings).toLocaleString()}
            <span className="text-lg font-medium ml-1">元</span>
          </p>
          <p className="text-sm text-amber-600">
            📆 平均每個月可節省金額：
            <span className="font-bold">{Math.round(savings / 12).toLocaleString()} 元</span>
          </p>
        </div>
      )}

      {/* 調整說明 */}
      {!isOptimal && (
        <div className="mt-5 p-4 bg-gray-50/80 rounded-xl text-sm text-gray-600 leading-relaxed">
          <p className="font-semibold mb-2 text-gray-700">調整說明：</p>
          {needsDecrease && (
            <p>
              目前契約容量較高，導致每月基本電費偏高。建議降低契約容量以減少固定成本。
              即使部分月份可能有輕微超約，整體費用仍較低。
            </p>
          )}
          {needsIncrease && (
            <p>
              目前契約容量不足，導致多月超約受罰。建議提高契約容量以避免超約罰款，
              雖然基本電費會增加，但可省下可觀的超約費用。
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

export default OptimizationResult;
