// 契約容量輸入元件

export function CapacityInput({ value, onChange, error }) {
  return (
    <div className="mb-6">
      <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
        目前契約容量 (kW)
      </label>
      <div className="relative">
        <input
          type="number"
          id="capacity"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-3 border rounded-lg shadow-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          `}
          placeholder="請輸入契約容量"
          min="1"
          max="10000"
          step="1"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kW</span>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default CapacityInput;
