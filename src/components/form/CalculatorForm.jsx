// 計算器表單元件

import { CapacityInput } from './CapacityInput';
import { MonthlyDemandInputs } from './MonthlyDemandInputs';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export function CalculatorForm({
  capacity,
  setCapacity,
  monthlyDemands,
  updateDemand,
  errors,
  warnings,
  onSubmit,
  onReset,
  isCalculating,
  canCalculate,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // 檢查是否有通用錯誤（非特定月份）
  const generalError = errors.demands?.find((e) => e.month === null);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 契約容量輸入 */}
      <CapacityInput value={capacity} onChange={setCapacity} error={errors.capacity} />

      {/* 月需量輸入 */}
      <MonthlyDemandInputs
        values={monthlyDemands}
        onChange={updateDemand}
        errors={errors.demands}
      />

      {/* 通用錯誤訊息 */}
      {generalError && (
        <Alert variant="error" className="mt-4">
          {generalError.error}
        </Alert>
      )}

      {/* 警告訊息 */}
      {warnings && warnings.length > 0 && (
        <Alert variant="warning" title="提醒" className="mt-4">
          <ul className="list-disc list-inside">
            {warnings.map((w, i) => (
              <li key={i}>
                {w.month ? `${w.month}月：` : ''}
                {w.warning}
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* 按鈕區 */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isCalculating}
          disabled={!canCalculate()}
          className="flex-1"
        >
          🔍 開始計算最佳容量
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={onReset}>
          重置
        </Button>
      </div>
    </form>
  );
}

export default CalculatorForm;
