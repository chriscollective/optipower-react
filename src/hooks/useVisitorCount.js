// 瀏覽人數計數器 Hook
import { useEffect, useState } from 'react';
import { watchCounter, incrementCounter } from '../lib/counters';

const COUNTER_PATH = 'visitorCount';
const SESSION_KEY = 'optipower_visitor_counted';

export function useVisitorCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    // 同一 session 只計數一次
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, '1');
      incrementCounter(COUNTER_PATH);
    }

    return watchCounter(COUNTER_PATH, setCount);
  }, []);

  return count;
}
