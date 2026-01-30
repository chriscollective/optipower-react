// 瀏覽人數計數器 Hook
import { useEffect, useState } from 'react';
import { ref, onValue, runTransaction } from 'firebase/database';
import { db } from '../lib/firebase';

export function useVisitorCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const countRef = ref(db, 'visitorCount');

    // 同一 session 只計數一次
    if (!sessionStorage.getItem('counted')) {
      runTransaction(countRef, (current) => (current || 0) + 1);
      sessionStorage.setItem('counted', '1');
    }

    // 即時監聽計數值
    const unsubscribe = onValue(countRef, (snapshot) => {
      setCount(snapshot.val() || 0);
    });

    return () => unsubscribe();
  }, []);

  return count;
}
