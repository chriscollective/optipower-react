// 電費計算核心邏輯

import {
  BASIC_FEE_NON_SUMMER,
  BASIC_FEE_SUMMER,
  SUMMER_MONTHS,
  PENALTY_RATE_UNDER_10,
  PENALTY_RATE_OVER_10,
  SEARCH_STEP,
} from './constants';

/**
 * 判斷是否為夏月
 * @param {number} month - 月份 (1-12)
 * @returns {boolean} 是否為夏月
 */
export function isSummerMonth(month) {
  return SUMMER_MONTHS.includes(month);
}

/**
 * 取得該月份的基本電費費率
 * @param {number} month - 月份 (1-12)
 * @returns {number} 基本電費費率 (元/千瓦)
 */
export function getBasicFeeRate(month) {
  return isSummerMonth(month) ? BASIC_FEE_SUMMER : BASIC_FEE_NON_SUMMER;
}

/**
 * 計算單月基本電費
 * @param {number} capacity - 契約容量 (kW)
 * @param {number} demand - 當月最高需量 (kW)
 * @param {number} month - 月份 (1-12)
 * @returns {Object} { baseFee, penaltyFee, totalFee, overRate }
 */
export function calculateMonthlyFee(capacity, demand, month) {
  const rate = getBasicFeeRate(month);

  // 基本電費 = 契約容量 × 費率
  const baseFee = capacity * rate;

  // 計算超約情況
  let penaltyFee = 0;
  let overRate = 0;

  if (demand > capacity) {
    const overAmount = demand - capacity;
    overRate = (overAmount / capacity) * 100;

    if (overRate <= 10) {
      // 超出 10% 以內：超出部分 × 2 倍費率
      penaltyFee = overAmount * rate * PENALTY_RATE_UNDER_10;
    } else {
      // 超出 10% 以上：
      // 前 10% 部分 × 2 倍費率
      // 超過 10% 部分 × 3 倍費率
      const first10Percent = capacity * 0.1;
      const overFirst10 = overAmount - first10Percent;

      penaltyFee =
        first10Percent * rate * PENALTY_RATE_UNDER_10 + overFirst10 * rate * PENALTY_RATE_OVER_10;
    }
  }

  const totalFee = baseFee + penaltyFee;

  return {
    baseFee: Math.round(baseFee * 100) / 100,
    penaltyFee: Math.round(penaltyFee * 100) / 100,
    totalFee: Math.round(totalFee * 100) / 100,
    overRate: Math.round(overRate * 100) / 100,
  };
}

/**
 * 計算年度總費用
 * @param {number} capacity - 契約容量 (kW)
 * @param {number[]} monthlyDemands - 12 個月需量陣列
 * @returns {Object} { totalFee, monthlyDetails }
 */
export function calculateAnnualFee(capacity, monthlyDemands) {
  const monthlyDetails = [];
  let totalFee = 0;

  for (let i = 0; i < 12; i++) {
    const month = i + 1;
    const demand = monthlyDemands[i] || 0;
    const monthResult = calculateMonthlyFee(capacity, demand, month);

    monthlyDetails.push({
      month,
      demand,
      ...monthResult,
    });

    totalFee += monthResult.totalFee;
  }

  return {
    totalFee: Math.round(totalFee * 100) / 100,
    monthlyDetails,
  };
}

/**
 * 尋找最佳契約容量
 * @param {number[]} monthlyDemands - 12 個月需量陣列
 * @returns {Object} { optimalCapacity, minFee, searchRange }
 */
export function findOptimalCapacity(monthlyDemands) {
  // 過濾無效數據
  const validDemands = monthlyDemands.filter((d) => d > 0);

  if (validDemands.length === 0) {
    return {
      optimalCapacity: 0,
      minFee: 0,
      searchRange: { min: 0, max: 0 },
    };
  }

  // 決定搜尋範圍
  const maxDemand = Math.max(...validDemands);
  const minDemand = Math.min(...validDemands);

  // 搜尋範圍：從最小需量的 40% 到最大需量的 170%
  const searchMin = Math.max(1, Math.floor(minDemand * 0.4));
  const searchMax = Math.ceil(maxDemand * 1.7);

  let optimalCapacity = searchMin;
  let minFee = Infinity;

  // 遍歷所有可能的契約容量
  for (let capacity = searchMin; capacity <= searchMax; capacity += SEARCH_STEP) {
    const { totalFee } = calculateAnnualFee(capacity, monthlyDemands);

    if (totalFee < minFee) {
      minFee = totalFee;
      optimalCapacity = capacity;
    }
  }

  return {
    optimalCapacity,
    minFee: Math.round(minFee * 100) / 100,
    searchRange: { min: searchMin, max: searchMax },
  };
}

/**
 * 取得費用分布資料（供圖表使用）
 * @param {number[]} monthlyDemands - 12 個月需量陣列
 * @param {number} currentCapacity - 目前契約容量（可選）
 * @returns {Object} { capacities, fees, optimalIndex, currentIndex }
 */
export function getFeeDistribution(monthlyDemands, currentCapacity = null) {
  const { optimalCapacity, searchRange } = findOptimalCapacity(monthlyDemands);

  if (searchRange.max === 0) {
    return {
      capacities: [],
      fees: [],
      optimalIndex: -1,
      currentIndex: -1,
    };
  }

  const capacities = [];
  const fees = [];

  // 為了圖表美觀，使用較大的步長
  const step = Math.max(1, Math.floor((searchRange.max - searchRange.min) / 50));

  for (let capacity = searchRange.min; capacity <= searchRange.max; capacity += step) {
    const { totalFee } = calculateAnnualFee(capacity, monthlyDemands);
    capacities.push(capacity);
    fees.push(totalFee);
  }

  // 確保最佳容量在陣列中
  if (!capacities.includes(optimalCapacity)) {
    const { totalFee } = calculateAnnualFee(optimalCapacity, monthlyDemands);
    const insertIndex = capacities.findIndex((c) => c > optimalCapacity);
    if (insertIndex === -1) {
      capacities.push(optimalCapacity);
      fees.push(totalFee);
    } else {
      capacities.splice(insertIndex, 0, optimalCapacity);
      fees.splice(insertIndex, 0, totalFee);
    }
  }

  // 確保目前容量在陣列中
  if (currentCapacity && !capacities.includes(currentCapacity)) {
    const { totalFee } = calculateAnnualFee(currentCapacity, monthlyDemands);
    const insertIndex = capacities.findIndex((c) => c > currentCapacity);
    if (insertIndex === -1) {
      capacities.push(currentCapacity);
      fees.push(totalFee);
    } else {
      capacities.splice(insertIndex, 0, currentCapacity);
      fees.splice(insertIndex, 0, totalFee);
    }
  }

  return {
    capacities,
    fees,
    optimalIndex: capacities.indexOf(optimalCapacity),
    currentIndex: currentCapacity ? capacities.indexOf(currentCapacity) : -1,
  };
}

/**
 * 計算節省金額
 * @param {number} currentFee - 目前費用
 * @param {number} optimalFee - 最佳費用
 * @returns {Object} { savings, savingsRate }
 */
export function calculateSavings(currentFee, optimalFee) {
  const savings = currentFee - optimalFee;
  const savingsRate = currentFee > 0 ? (savings / currentFee) * 100 : 0;

  return {
    savings: Math.round(savings * 100) / 100,
    savingsRate: Math.round(savingsRate * 100) / 100,
  };
}
