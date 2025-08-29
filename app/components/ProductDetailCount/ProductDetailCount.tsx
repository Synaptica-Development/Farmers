'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductDetailCount.module.scss';

interface ProductDetailCountProps {
  initialCount: number;
  maxCount: number;
  minCount: number;
  onChange: (newCount: number) => void;
}

const ProductDetailCount = ({
  initialCount,
  maxCount,
  minCount,
  onChange,
}: ProductDetailCountProps) => {
  const [count, setCount] = useState<number>(initialCount);
  const holdInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onChange(count);
  }, [count, onChange]);

  const updateCount = (newCount: number) => {
    if (newCount < minCount) newCount = minCount;
    if (newCount > maxCount) newCount = maxCount;
    setCount(newCount);
  };

  const increment = () => updateCount(count + 1);
  const decrement = () => updateCount(count - 1);

const handleHoldStart = (action: 'increment' | 'decrement') => {
  if (action === 'increment') {
    increment();
  } else {
    decrement();
  }

  holdInterval.current = setInterval(() => {
    setCount((prev) => {
      let newCount = prev;
      if (action === 'increment' && prev < maxCount) {
        newCount = prev + 1;
      }
      if (action === 'decrement' && prev > minCount) {
        newCount = prev - 1;
      }
      return newCount; 
    });
  }, 150);
};


  const handleHoldEnd = () => {
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = minCount;
    updateCount(value);
  };

  return (
    <div className={styles.counterWrapper}>
      <div className={styles.counter}>
        <Image
          src="/whiteMinus.svg"
          alt="minus icon"
          width={24}
          height={24}
          onMouseDown={() => handleHoldStart('decrement')}
          onMouseUp={handleHoldEnd}
          onMouseLeave={handleHoldEnd}
          onTouchStart={() => handleHoldStart('decrement')}
          onTouchEnd={handleHoldEnd}
        />
        <input
          type="number"
          value={count}
          onChange={handleInputChange}
          className={styles.counterInput}
          style={{ width: `${String(count).length + 1}ch` }}
          min={minCount}
          max={maxCount}
        />
        <Image
          src="/whitePluse.svg"
          alt="plus icon"
          width={22}
          height={22}
          onMouseDown={() => handleHoldStart('increment')}
          onMouseUp={handleHoldEnd}
          onMouseLeave={handleHoldEnd}
          onTouchStart={() => handleHoldStart('increment')}
          onTouchEnd={handleHoldEnd}
        />
      </div>
    </div>
  );
};

export default ProductDetailCount;
