// 計算器自訂 Hook

import { useState, useCallback } from 'react';
import {
  calculateAnnualFee,
  findOptimalCapacity,
  getFeeDistribution,
  calculateSavings,
} from '../utils/calculator';
import { validateAllInputs } from '../utils/validators';

/**
 * 計算器 Hook
 * 管理輸入狀態、驗證和計算結果
 */
export function useCalculator() {
  // 輸入狀態
  const [capacity, setCapacity] = useState('');
  const [monthlyDemands, setMonthlyDemands] = useState(Array(12).fill(''));

  // 結果狀態
  const [results, setResults] = useState(null);

  // 錯誤狀態
  const [errors, setErrors] = useState({
    capacity: null,
    demands: [],
  });

  // 警告狀態
  const [warnings, setWarnings] = useState([]);

  // 計算狀態
  const [isCalculating, setIsCalculating] = useState(false);

  /**
   * 更新單月需量
   */
  const updateDemand = useCallback((index, value) => {
    setMonthlyDemands((prev) => {
      const newDemands = [...prev];
      newDemands[index] = value;
      return newDemands;
    });

    // 清除該月份的錯誤
    setErrors((prev) => ({
      ...prev,
      demands: prev.demands.filter((e) => e.month !== index + 1),
    }));
  }, []);

  /**
   * 更新契約容量
   * 同時自動填入 12 個月份的預設值（契約容量的 0.8 倍）
   */
  const updateCapacity = useCallback((value) => {
    setCapacity(value);

    // 當有輸入數值時，自動填入 12 個月份的預設值
    const numValue = Number(value);
    if (value !== '' && !isNaN(numValue) && numValue > 0) {
      const defaultDemand = Math.round(numValue * 0.8);
      setMonthlyDemands(Array(12).fill(String(defaultDemand)));
    }

    // 清除容量錯誤
    setErrors((prev) => ({
      ...prev,
      capacity: null,
    }));
  }, []);

  /**
   * 重置所有輸入
   */
  const reset = useCallback(() => {
    setCapacity('');
    setMonthlyDemands(Array(12).fill(''));
    setResults(null);
    setErrors({ capacity: null, demands: [] });
    setWarnings([]);
  }, []);

  /**
   * 執行計算
   */
  const calculate = useCallback(() => {
    setIsCalculating(true);

    // 驗證輸入
    const validation = validateAllInputs(capacity, monthlyDemands);

    if (!validation.isValid) {
      setErrors({
        capacity: validation.capacityError,
        demands: validation.demandErrors,
      });
      setWarnings(validation.demandWarnings);
      setResults(null);
      setIsCalculating(false);
      return false;
    }

    // 設定警告
    setWarnings(validation.demandWarnings);

    // 清除錯誤
    setErrors({ capacity: null, demands: [] });

    // 轉換為數字
    const capacityNum = Number(capacity);
    const demandsNum = monthlyDemands.map((d) => (d === '' ? 0 : Number(d)));

    // 計算目前費用
    const currentResult = calculateAnnualFee(capacityNum, demandsNum);

    // 尋找最佳容量
    const optimal = findOptimalCapacity(demandsNum);

    // 計算最佳容量的詳細費用
    const optimalResult = calculateAnnualFee(optimal.optimalCapacity, demandsNum);

    // 計算節省金額
    const savings = calculateSavings(currentResult.totalFee, optimal.minFee);

    // 取得圖表資料
    const chartData = getFeeDistribution(demandsNum, capacityNum);

    // 設定結果
    setResults({
      // 目前狀況
      currentCapacity: capacityNum,
      currentFee: currentResult.totalFee,
      currentMonthlyDetails: currentResult.monthlyDetails,

      // 最佳化結果
      optimalCapacity: optimal.optimalCapacity,
      optimalFee: optimal.minFee,
      optimalMonthlyDetails: optimalResult.monthlyDetails,

      // 節省金額
      savings: savings.savings,
      savingsRate: savings.savingsRate,

      // 圖表資料
      chartData,

      // 搜尋範圍（用於參考）
      searchRange: optimal.searchRange,
    });

    setIsCalculating(false);
    return true;
  }, [capacity, monthlyDemands]);

  /**
   * 檢查是否可以計算
   */
  const canCalculate = useCallback(() => {
    if (!capacity || Number(capacity) <= 0) return false;

    const hasValidDemand = monthlyDemands.some((d) => d !== '' && Number(d) > 0);

    return hasValidDemand;
  }, [capacity, monthlyDemands]);

  return {
    // 輸入值
    capacity,
    monthlyDemands,

    // 輸入更新方法
    setCapacity: updateCapacity,
    setMonthlyDemands,
    updateDemand,

    // 結果
    results,

    // 錯誤與警告
    errors,
    warnings,

    // 操作方法
    calculate,
    reset,
    canCalculate,

    // 狀態
    isCalculating,
  };
}

export default useCalculator;
