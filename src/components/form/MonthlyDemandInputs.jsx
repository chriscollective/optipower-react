// 月需量輸入元件

import { MONTH_NAMES, SUMMER_MONTHS } from '../../utils/constants';

export function MonthlyDemandInputs({ values, onChange, errors = [] }) {
  // 將錯誤轉換為以月份為 key 的物件
  const errorMap = errors.reduce((acc, err) => {
    if (err.month) acc[err.month] = err.error;
    return acc;
  }, {});

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        輸入1~12月的最高需量（千瓦）
      </label>
      <p className="text-xs text-gray-500 mb-3">
        通常在電費帳單➞最高需量(千瓦)➞經常(尖峰)需量
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {MONTH_NAMES.map((month, index) => {
          const monthNum = index + 1;
          const isSummer = SUMMER_MONTHS.includes(monthNum);
          const hasError = errorMap[monthNum];

          return (
            <div key={index} className="relative">
              <label
                htmlFor={`demand-${index}`}
                className={`
                  block text-xs font-medium mb-1
                  ${isSummer ? 'text-orange-600' : 'text-gray-600'}
                `}
              >
                {month}
                {isSummer && <span className="ml-1 text-orange-400">☀</span>}
              </label>
              <input
                type="number"
                id={`demand-${index}`}
                value={values[index]}
                onChange={(e) => onChange(index, e.target.value)}
                className={`
                  w-full px-3 py-2 text-sm border rounded-md shadow-sm
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-colors duration-200
                  ${hasError ? 'border-red-500' : isSummer ? 'border-orange-200 bg-orange-50' : 'border-gray-300'}
                `}
                placeholder="kW"
                min="0"
                step="0.1"
              />
              {hasError && <p className="mt-1 text-xs text-red-600">{hasError}</p>}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        <span className="text-orange-600">☀ 夏月</span>（6-9月）電費費率較高
      </p>
    </div>
  );
}

export default MonthlyDemandInputs;
