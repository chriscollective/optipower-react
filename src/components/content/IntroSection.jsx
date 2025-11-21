// 介紹說明區塊元件

import { Card } from '../ui/Card';

export function IntroSection() {
  return (
    <Card className="mb-6">
      <div className="prose prose-sm max-w-none">
        {/* 介紹文字 */}
        <p className="text-gray-600 mb-4">
          只要輸入近 12 個月的最高需量，OptiPower
          就能即時計算出最省錢的契約容量，並估算每年可節省的基本電費與潛在罰款。適合社區大樓管理委員會、企業管理部門，以及所有想降低固定用電成本的用戶。
        </p>

        {/* 為什麼需要重新檢視契約容量 */}
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <h3 className="text-base font-medium text-red-800 mb-2">
            為什麼需要重新檢視契約容量？
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• 契約容量設定過高，等同每月多繳固定電費。</li>
            <li>• 夏月與非夏月用電差異大，容易在淡季造成資源浪費。</li>
            <li>• 未預估到尖峰用電時的罰款，導致被動支出增加。</li>
            <li>• 台電申請流程繁雜，缺乏透明的計算依據。</li>
          </ul>
        </div>

        {/* OptiPower 能帶來的價值 */}
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <h3 className="text-base font-medium text-green-800 mb-2">OptiPower 能帶來的價值</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• 即時呈現不同契約容量下的年費用比較。</li>
            <li>• 自動比對浪費與罰款，快速找到最佳平衡點。</li>
            <li>• 清楚的圖表與報表，協助向住戶或主管說明決策依據。</li>
            <li>• 全中文介面，符合台灣電價制與低壓電力規範。</li>
          </ul>
        </div>

        {/* 使用步驟 */}
        <h3 className="text-base font-medium text-gray-800 mb-2">使用步驟</h3>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>準備電費帳單上過去 12 個月的最高需量（經常／尖峰）。</li>
          <li>在下方表單輸入目前契約容量與逐月需量。</li>
          <li>送出後，即可看到最佳方案、節省金額與視覺化圖表。</li>
          <li>評估後即可向台電提出調整申請，減少固定電費支出。</li>
        </ol>
      </div>
    </Card>
  );
}

export default IntroSection;
