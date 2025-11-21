// 輸入驗證邏輯

import { MIN_CAPACITY, MAX_CAPACITY, MIN_DEMAND, MAX_DEMAND } from './constants';

/**
 * 驗證契約容量
 * @param {number|string} capacity - 契約容量
 * @returns {Object} { isValid, error }
 */
export function validateCapacity(capacity) {
  const value = Number(capacity);

  if (capacity === '' || capacity === null || capacity === undefined) {
    return { isValid: false, error: '請輸入契約容量' };
  }

  if (isNaN(value)) {
    return { isValid: false, error: '契約容量必須為數字' };
  }

  if (value < MIN_CAPACITY) {
    return { isValid: false, error: `契約容量必須大於 ${MIN_CAPACITY} kW` };
  }

  if (value > MAX_CAPACITY) {
    return { isValid: false, error: `契約容量不能超過 ${MAX_CAPACITY.toLocaleString()} kW` };
  }

  return { isValid: true, error: null };
}

/**
 * 驗證單月需量
 * @param {number|string} demand - 需量
 * @param {number} month - 月份 (1-12)
 * @returns {Object} { isValid, error, warning }
 */
export function validateDemand(demand, month) {
  const value = Number(demand);

  // 允許空值（表示該月無資料）
  if (demand === '' || demand === null || demand === undefined) {
    return { isValid: true, error: null, warning: null };
  }

  if (isNaN(value)) {
    return { isValid: false, error: '需量必須為數字', warning: null };
  }

  if (value < MIN_DEMAND) {
    return { isValid: false, error: '需量不能為負數', warning: null };
  }

  if (value > MAX_DEMAND) {
    return {
      isValid: false,
      error: `需量不能超過 ${MAX_DEMAND.toLocaleString()} kW`,
      warning: null,
    };
  }

  // 警告：需量為 0 可能是未填寫
  if (value === 0) {
    return {
      isValid: true,
      error: null,
      warning: '需量為 0，請確認是否正確',
    };
  }

  return { isValid: true, error: null, warning: null };
}

/**
 * 驗證月需量陣列
 * @param {Array<number|string>} demands - 12 個月需量陣列
 * @returns {Object} { isValid, errors, warnings, hasData }
 */
export function validateMonthlyDemands(demands) {
  const errors = [];
  const warnings = [];
  let validCount = 0;

  for (let i = 0; i < 12; i++) {
    const demand = demands[i];
    const month = i + 1;
    const result = validateDemand(demand, month);

    if (!result.isValid) {
      errors.push({ month, error: result.error });
    } else if (result.warning) {
      warnings.push({ month, warning: result.warning });
    }

    // 計算有效數據數量
    if (demand !== '' && demand !== null && demand !== undefined && Number(demand) > 0) {
      validCount++;
    }
  }

  // 檢查是否有足夠的數據
  const hasData = validCount > 0;
  if (!hasData && errors.length === 0) {
    errors.push({ month: null, error: '請至少輸入一個月份的需量資料' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    hasData,
    validCount,
  };
}

/**
 * 驗證所有輸入
 * @param {number|string} capacity - 契約容量
 * @param {Array<number|string>} monthlyDemands - 12 個月需量陣列
 * @returns {Object} { isValid, capacityError, demandErrors, demandWarnings }
 */
export function validateAllInputs(capacity, monthlyDemands) {
  const capacityResult = validateCapacity(capacity);
  const demandsResult = validateMonthlyDemands(monthlyDemands);

  return {
    isValid: capacityResult.isValid && demandsResult.isValid,
    capacityError: capacityResult.error,
    demandErrors: demandsResult.errors,
    demandWarnings: demandsResult.warnings,
    hasData: demandsResult.hasData,
  };
}

/**
 * 格式化數字輸入
 * @param {string} value - 輸入值
 * @returns {string} 格式化後的值
 */
export function formatNumberInput(value) {
  // 移除非數字字元（保留小數點）
  const cleaned = value.replace(/[^\d.]/g, '');

  // 只保留第一個小數點
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }

  return cleaned;
}
