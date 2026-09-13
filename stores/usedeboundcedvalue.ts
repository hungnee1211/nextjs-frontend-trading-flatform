import { useEffect, useState } from 'react';

/**
 * Trì hoãn cập nhật giá trị cho tới khi người dùng ngừng gõ trong `delay` ms.
 * Giúp tránh việc filter lại toàn bộ danh sách asset trên mỗi keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}