// 最佳化結果顯示元件

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
    <Card title="最佳化建議" className="mb-6">
      {/* 結果摘要 */}
      {isOptimal ? (
        <Alert variant="success" className="mb-6">
          <p className="font-medium">恭喜！您目前的契約容量已是最佳選擇。</p>
        </Alert>
      ) : (
        <Alert variant="info" className="mb-6">
          <p>
            建議將契約容量
            {needsIncrease ? (
              <span className="font-medium text-blue-700"> 調高 </span>
            ) : (
              <span className="font-medium text-blue-700"> 調低 </span>
            )}
            至 <span className="font-bold">{optimalCapacity.toLocaleString()} kW</span>
          </p>
        </Alert>
      )}

      {/* 比較表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 目前 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-500 mb-3">目前契約</h4>
          <p className="text-lg font-bold text-gray-900 mb-1">
            {currentCapacity.toLocaleString()} kW
          </p>
          <p className="text-2xl font-bold text-gray-700">
            {Math.round(currentFee).toLocaleString()} 元/年
          </p>
        </div>

        {/* 最佳 */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-600 mb-3">建議契約</h4>
          <p className="text-lg font-bold text-green-800 mb-1">
            {optimalCapacity.toLocaleString()} kW
          </p>
          <p className="text-2xl font-bold text-green-700">
            {Math.round(optimalFee).toLocaleString()} 元/年
          </p>
        </div>
      </div>

      {/* 節省金額 */}
      {hasSavings && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-700 mb-1">💰 優化後一年可節省金額</p>
          <p className="text-3xl font-bold text-yellow-600">
            {Math.round(savings).toLocaleString()} 元
          </p>
          <p className="text-sm text-yellow-600 mt-1">
            📆 平均每個月可節省金額：{Math.round(savings / 12).toLocaleString()} 元
          </p>
        </div>
      )}

      {/* 調整說明 */}
      {!isOptimal && (
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-medium mb-2">調整說明：</p>
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
