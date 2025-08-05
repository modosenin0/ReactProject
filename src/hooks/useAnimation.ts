import { useEffect, useState } from 'react';

export function useAnimation(delay: number = 0) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
}

export function useStaggeredAnimation(items: any[], staggerDelay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<number>(0);

  useEffect(() => {
    if (items.length === 0) return;

    setVisibleItems(0);
    
    const timer = setInterval(() => {
      setVisibleItems(prev => {
        if (prev >= items.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, staggerDelay);

    return () => clearInterval(timer);
  }, [items.length, staggerDelay]);

  return visibleItems;
}
