// 月需量輸入元件 - 現代精緻風格

import { MONTH_NAMES, SUMMER_MONTHS } from '../../utils/constants';

export function MonthlyDemandInputs({ values, onChange, errors = [] }) {
  // 將錯誤轉換為以月份為 key 的物件
  const errorMap = errors.reduce((acc, err) => {
    if (err.month) acc[err.month] = err.error;
    return acc;
  }, {});

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        輸入1~12月的最高需量（千瓦）
      </label>
      <p className="text-xs text-gray-500 mb-4">
        通常在電費帳單➞最高需量(千瓦)➞經常(尖峰)需量
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {MONTH_NAMES.map((month, index) => {
          const monthNum = index + 1;
          const isSummer = SUMMER_MONTHS.includes(monthNum);
          const hasError = errorMap[monthNum];

          return (
            <div key={index} className="relative group">
              <label
                htmlFor={`demand-${index}`}
                className={`
                  block text-xs font-semibold mb-1.5
                  ${isSummer ? 'text-orange-600' : 'text-gray-600'}
                `}
              >
                {month}
                {isSummer && <span className="ml-1">☀</span>}
              </label>
              <input
                type="number"
                id={`demand-${index}`}
                value={values[index]}
                onChange={(e) => onChange(index, e.target.value)}
                className={`
                  w-full px-3 py-2.5 text-sm
                  bg-white/80 backdrop-blur-sm
                  border-2 rounded-lg
                  shadow-sm
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  hover:border-gray-300
                  transition-all duration-200
                  font-medium
                  placeholder:text-gray-400 placeholder:font-normal
                  ${hasError
                    ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    : isSummer
                      ? 'border-orange-200 bg-gradient-to-br from-orange-50/80 to-amber-50/80'
                      : 'border-gray-200'
                  }
                `}
                placeholder="kW"
                min="0"
                step="1"
              />
              {hasError && (
                <p className="mt-1 text-xs text-red-600 font-medium">{hasError}</p>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-gray-500 flex items-center gap-1">
        <span className="text-orange-500 font-medium">☀ 夏月</span>
        <span>（6-9月）電費費率較高</span>
      </p>
    </div>
  );
}

export default MonthlyDemandInputs;
