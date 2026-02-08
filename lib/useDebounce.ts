import { useState, useEffect } from 'react';

/**
 * Debounce a value — the returned value only updates after `delay` ms
 * of inactivity. Useful for search inputs to avoid hitting the API
 * on every keystroke.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
