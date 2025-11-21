// 電費費率常數

// 基本電費 (元/千瓦)
export const BASIC_FEE_NON_SUMMER = 173.2; // 非夏月基本電費
export const BASIC_FEE_SUMMER = 236.2; // 夏月基本電費

// 夏月月份 (6月至9月)
export const SUMMER_MONTHS = [6, 7, 8, 9];

// 超約罰款倍率
export const PENALTY_RATE_UNDER_10 = 2; // 超出 10% 以內
export const PENALTY_RATE_OVER_10 = 3; // 超出 10% 以上

// 輸入限制
export const MIN_CAPACITY = 1; // 最小契約容量 (kW)
export const MAX_CAPACITY = 10000; // 最大契約容量 (kW)
export const MIN_DEMAND = 0; // 最小需量 (kW)
export const MAX_DEMAND = 50000; // 最大需量 (kW)

// 月份名稱
export const MONTH_NAMES = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

// 搜尋範圍設定
export const SEARCH_STEP = 1; // 搜尋步長 (kW)
