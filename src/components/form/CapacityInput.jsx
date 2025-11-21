// 契約容量輸入元件

export function CapacityInput({ value, onChange, error }) {
  return (
    <div className="mb-6">
      <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
        目前契約容量（千瓦）(經常(尖峰)契約)
      </label>
      <p className="text-xs text-gray-500 mb-2">請輸入電費帳單上的契約容量</p>
      <div className="relative">
        <input
          type="number"
          id="capacity"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-3 pr-16 border rounded-lg shadow-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          `}
          placeholder="25"
          min="1"
          max="10000"
          step="1"
        />
        {/* 只在沒有輸入值時顯示 kW */}
        {!value && (
          <span className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            kW
          </span>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default CapacityInput;
