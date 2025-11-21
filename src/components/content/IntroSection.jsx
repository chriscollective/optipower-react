// 介紹說明區塊元件

import { Card } from '../ui/Card';

export function IntroSection() {
  return (
    <Card className="mb-6">
      <div className="prose prose-sm max-w-none">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">什麼是契約容量？</h2>

        <p className="text-gray-600 mb-4">
          契約容量是您與台電約定的最高用電需求（kW）。每月基本電費依契約容量計算，
          若實際用電超過契約容量則需支付超約罰款。
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="text-base font-medium text-blue-800 mb-2">費率說明</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>非夏月</strong>（1-5月、10-12月）：173.2 元/kW
            </li>
            <li>
              • <strong>夏月</strong>（6-9月）：236.2 元/kW
            </li>
          </ul>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 mb-4">
          <h3 className="text-base font-medium text-orange-800 mb-2">超約罰款計算</h3>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• 超出契約容量 10% 以內：超出部分 × 2 倍費率</li>
            <li>• 超出契約容量 10% 以上：超出 10% 部分 × 2 倍 + 超過 10% 部分 × 3 倍費率</li>
          </ul>
        </div>

        <h3 className="text-base font-medium text-gray-800 mb-2">如何使用本工具？</h3>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>輸入您目前的契約容量（kW）</li>
          <li>輸入過去 12 個月的最高需量數據</li>
          <li>點擊「計算最佳契約容量」</li>
          <li>查看建議的契約容量與預估節省金額</li>
        </ol>
      </div>
    </Card>
  );
}

export default IntroSection;
