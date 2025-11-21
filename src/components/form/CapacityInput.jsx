// 契約容量輸入元件 - 現代精緻風格

export function CapacityInput({ value, onChange, error }) {
  return (
    <div className="mb-6">
      <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-1">
        目前契約容量（千瓦）(經常(尖峰)契約)
      </label>
      <p className="text-xs text-gray-500 mb-3">請輸入電費帳單上的契約容量</p>
      <div className="relative">
        <input
          type="number"
          id="capacity"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-3.5 pr-16
            bg-white/80 backdrop-blur-sm
            border-2 rounded-xl
            shadow-sm
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            hover:border-gray-300
            transition-all duration-200
            text-gray-900 font-medium
            placeholder:text-gray-400 placeholder:font-normal
            ${
              error
                ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                : 'border-gray-200'
            }
          `}
          placeholder="例如:25 (KW)"
          min="1"
          max="10000"
          step="1"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default CapacityInput;
