// 目前狀況顯示元件 - 現代精緻風格

import { Card } from '../ui/Card';

export function CurrentStatus({ capacity, totalFee, monthlyDetails }) {
  // 計算超約月份數
  const overMonths = monthlyDetails.filter((m) => m.overRate > 0).length;

  // 計算基本費與超約費總和
  const totalBaseFee = monthlyDetails.reduce((sum, m) => sum + m.baseFee, 0);
  const totalPenaltyFee = monthlyDetails.reduce((sum, m) => sum + m.penaltyFee, 0);

  return (
    <Card title="目前契約狀況" className="mb-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 契約容量 */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-4 text-center border border-gray-200/50">
          <p className="text-sm font-semibold text-gray-500 mb-2">契約容量</p>
          <p className="text-2xl font-bold text-gray-800">{capacity.toLocaleString()} kW</p>
        </div>

        {/* 年度基本電費 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 text-center border border-blue-200/50">
          <p className="text-sm font-semibold text-blue-600 mb-2">年度基本電費</p>
          <p className="text-2xl font-bold text-blue-700">
            {Math.round(totalFee).toLocaleString()} 元
          </p>
        </div>

        {/* 超約月份 */}
        <div
          className={`rounded-xl p-4 text-center border ${
            overMonths > 0
              ? 'bg-gradient-to-br from-red-50 to-rose-100 border-red-200/50'
              : 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200/50'
          }`}
        >
          <p className={`text-sm font-semibold mb-2 ${overMonths > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            超約月份
          </p>
          <p className={`text-2xl font-bold ${overMonths > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
            {overMonths} 個月
          </p>
        </div>
      </div>

      {/* 月度明細表 */}
      <div className="overflow-x-auto rounded-xl border border-gray-200/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-slate-100">
              <th className="text-left py-3 px-3 font-semibold text-gray-600">月份</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-600">需量</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-600">基本費</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-600">超約費</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-600">合計</th>
            </tr>
          </thead>
          <tbody>
            {monthlyDetails.map((detail) => (
              <tr
                key={detail.month}
                className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors ${
                  detail.overRate > 0 ? 'bg-red-50/50' : ''
                }`}
              >
                <td className="py-2.5 px-3 font-medium">{detail.month}月</td>
                <td className="text-right py-2.5 px-3">{detail.demand.toLocaleString()} kW</td>
                <td className="text-right py-2.5 px-3">
                  {Math.round(detail.baseFee).toLocaleString()}
                </td>
                <td className="text-right py-2.5 px-3 text-red-600 font-medium">
                  {detail.penaltyFee > 0 ? Math.round(detail.penaltyFee).toLocaleString() : '-'}
                </td>
                <td className="text-right py-2.5 px-3 font-semibold">
                  {Math.round(detail.totalFee).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold border-t-2 border-gray-200">
              <td colSpan="2" className="py-3 px-3 text-right text-gray-600">
                小計
              </td>
              <td className="text-right py-3 px-3">
                {Math.round(totalBaseFee).toLocaleString()}
              </td>
              <td className="text-right py-3 px-3 text-red-600">
                {totalPenaltyFee > 0 ? Math.round(totalPenaltyFee).toLocaleString() : '-'}
              </td>
              <td className="text-right py-3 px-3">
                {Math.round(totalFee).toLocaleString()}
              </td>
            </tr>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-100 font-bold">
              <td colSpan="4" className="py-3 px-3 text-right text-blue-700">
                年度總計
              </td>
              <td className="text-right py-3 px-3 text-blue-700">
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
