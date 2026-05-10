// PDF 下載次數計數器 Hook
import { useCallback, useEffect, useState } from 'react';
import { watchCounter, incrementCounter } from '../lib/counters';

const COUNTER_PATH = 'pdfDownloadCount';

export function useDownloadCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    return watchCounter(COUNTER_PATH, setCount);
  }, []);

  const increment = useCallback(() => {
    incrementCounter(COUNTER_PATH);
  }, []);

  return { count, increment };
}
