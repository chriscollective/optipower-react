// 試算統計：同時寫 RTDB 即時總和（A）+ Firestore 個別紀錄（B）
// 整個流程 fire-and-forget，失敗不影響使用者體驗
import { ref, runTransaction } from 'firebase/database';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, firestore } from './firebase';

const RTDB_TOTAL_CALCULATIONS = 'stats/totalCalculations';
const RTDB_TOTAL_SAVINGS = 'stats/totalSavings';
const FIRESTORE_COLLECTION = 'calculations';

/**
 * 紀錄一筆成功的試算
 * @param {Object} result
 * @param {number} result.currentCapacity
 * @param {number} result.currentFee
 * @param {number} result.optimalCapacity
 * @param {number} result.optimalFee
 * @param {number} result.savings
 * @param {number} result.savingsRate
 */
export function recordCalculation(result) {
  // 不 await，三個寫入並行；失敗各自處理
  bumpTotalCalculations();
  bumpTotalSavings(result.savings);
  saveCalculationDoc(result);
}

async function bumpTotalCalculations() {
  try {
    await runTransaction(ref(db, RTDB_TOTAL_CALCULATIONS), (current) => (current || 0) + 1);
  } catch (error) {
    console.error('[stats] totalCalculations 更新失敗:', error);
  }
}

async function bumpTotalSavings(savings) {
  // 防呆：負值或非數字一律忽略
  if (typeof savings !== 'number' || !Number.isFinite(savings) || savings <= 0) return;

  try {
    await runTransaction(ref(db, RTDB_TOTAL_SAVINGS), (current) => (current || 0) + savings);
  } catch (error) {
    console.error('[stats] totalSavings 更新失敗:', error);
  }
}

async function saveCalculationDoc(result) {
  try {
    await addDoc(collection(firestore, FIRESTORE_COLLECTION), {
      timestamp: serverTimestamp(),
      currentCapacity: result.currentCapacity,
      optimalCapacity: result.optimalCapacity,
      currentFee: result.currentFee,
      optimalFee: result.optimalFee,
      savings: result.savings,
      savingsRate: result.savingsRate,
      // 故意不存 monthlyDemands 原始輸入，避免可被反推使用者
    });
  } catch (error) {
    console.error('[stats] Firestore 紀錄失敗:', error);
  }
}
