import { useEffect, useState } from 'react';
import { msUntilTomorrow } from './daily';

export type ShareOutcome = 'shared' | 'copied' | 'failed';

export async function shareResult(text: string): Promise<ShareOutcome> {
  try {
    if (navigator.share) {
      await navigator.share({ text });
      return 'shared';
    }
  } catch {
    // Share sheet cancelled or blocked, fall back to copying
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Live "hh:mm:ss" until local midnight
export function useMidnightCountdown(active = true): string {
  const [ms, setMs] = useState(msUntilTomorrow());
  useEffect(() => {
    if (!active) return;
    setMs(msUntilTomorrow());
    const interval = setInterval(() => setMs(msUntilTomorrow()), 1000);
    return () => clearInterval(interval);
  }, [active]);
  return formatCountdown(ms);
}
