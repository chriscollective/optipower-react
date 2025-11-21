// 目前狀況顯示元件

import { Card } from '../ui/Card';

export function CurrentStatus({ capacity, totalFee, monthlyDetails }) {
  // 計算超約月份數
  const overMonths = monthlyDetails.filter((m) => m.overRate > 0).length;

  // 計算基本費與超約費總和
  const totalBaseFee = monthlyDetails.reduce((sum, m) => sum + m.baseFee, 0);
  const totalPenaltyFee = monthlyDetails.reduce((sum, m) => sum + m.penaltyFee, 0);

  return (
    <Card title="目前契約狀況" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 契約容量 */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">契約容量</p>
          <p className="text-2xl font-bold text-gray-900">{capacity.toLocaleString()} kW</p>
        </div>

        {/* 年度基本電費 */}
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-600 mb-1">年度基本電費</p>
          <p className="text-2xl font-bold text-blue-700">
            {Math.round(totalFee).toLocaleString()} 元
          </p>
        </div>

        {/* 超約月份 */}
        <div
          className={`rounded-lg p-4 text-center ${overMonths > 0 ? 'bg-red-50' : 'bg-green-50'}`}
        >
          <p className={`text-sm mb-1 ${overMonths > 0 ? 'text-red-600' : 'text-green-600'}`}>
            超約月份
          </p>
          <p className={`text-2xl font-bold ${overMonths > 0 ? 'text-red-700' : 'text-green-700'}`}>
            {overMonths} 個月
          </p>
        </div>
      </div>

      {/* 月度明細表 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-2 font-medium text-gray-600">月份</th>
              <th className="text-right py-2 px-2 font-medium text-gray-600">需量</th>
              <th className="text-right py-2 px-2 font-medium text-gray-600">基本費</th>
              <th className="text-right py-2 px-2 font-medium text-gray-600">超約費</th>
              <th className="text-right py-2 px-2 font-medium text-gray-600">合計</th>
            </tr>
          </thead>
          <tbody>
            {monthlyDetails.map((detail) => (
              <tr
                key={detail.month}
                className={`border-b border-gray-100 ${detail.overRate > 0 ? 'bg-red-50' : ''}`}
              >
                <td className="py-2 px-2">{detail.month}月</td>
                <td className="text-right py-2 px-2">{detail.demand.toLocaleString()} kW</td>
                <td className="text-right py-2 px-2">
                  {Math.round(detail.baseFee).toLocaleString()}
                </td>
                <td className="text-right py-2 px-2 text-red-600">
                  {detail.penaltyFee > 0 ? Math.round(detail.penaltyFee).toLocaleString() : '-'}
                </td>
                <td className="text-right py-2 px-2 font-medium">
                  {Math.round(detail.totalFee).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-medium border-b border-gray-200">
              <td colSpan="2" className="py-2 px-2 text-right">
                小計
              </td>
              <td className="text-right py-2 px-2">
                {Math.round(totalBaseFee).toLocaleString()}
              </td>
              <td className="text-right py-2 px-2 text-red-600">
                {totalPenaltyFee > 0 ? Math.round(totalPenaltyFee).toLocaleString() : '-'}
              </td>
              <td className="text-right py-2 px-2">
                {Math.round(totalFee).toLocaleString()}
              </td>
            </tr>
            <tr className="bg-blue-50 font-bold">
              <td colSpan="4" className="py-2 px-2 text-right">
                年度總計
              </td>
              <td className="text-right py-2 px-2 text-blue-700">
                {Math.round(totalFee).toLocaleString()} 元
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}

export default CurrentStatus;
