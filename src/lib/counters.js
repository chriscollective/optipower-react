// 共用 Firebase Realtime DB 計數器邏輯
import { ref, onValue, runTransaction } from 'firebase/database';
import { db } from './firebase';

/**
 * 訂閱某個計數器路徑的即時值
 * @param {string} path - DB 路徑（例如 'visitorCount'）
 * @param {(value: number) => void} callback
 * @returns {() => void} unsubscribe
 */
export function watchCounter(path, callback) {
  const counterRef = ref(db, path);
  return onValue(
    counterRef,
    (snapshot) => callback(snapshot.val() || 0),
    (error) => console.error(`[counter:${path}] watch failed:`, error)
  );
}

/**
 * 將某個計數器路徑原子加 1
 * 失敗時印出錯誤但不 throw（計數器壞掉不應該炸掉整個 UI）
 * @param {string} path
 */
export async function incrementCounter(path) {
  try {
    await runTransaction(ref(db, path), (current) => (current || 0) + 1);
  } catch (error) {
    console.error(`[counter:${path}] increment failed:`, error);
  }
}
