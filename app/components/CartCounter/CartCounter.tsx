'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './CartCounter.module.scss';
import api from '@/lib/axios';

interface CartCounterProps {
  cartItemID: string;
  initialCount: number;
  onChange: (newCount: number) => void;
}

const CartCounter = ({ initialCount, onChange, cartItemID }: CartCounterProps) => {
  const [count, setCount] = useState<number>(initialCount);
  const holdInterval = useRef<NodeJS.Timeout | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerDebouncedChange = (newCount: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      onChange(newCount);
      api.put('/api/Cart/change-product-count', null, {
        params: {
          productID: cartItemID,
          count: newCount,
        },
      })
        .then(() => console.log('Count updated successfully on server'))
        .catch((err) => console.error('Failed to update count:', err));
    }, 500);
  };


  const updateCount = (newCount: number, debounce = true) => {
    if (newCount < 1) newCount = 1;
    setCount(newCount);
    if (debounce) triggerDebouncedChange(newCount);
  };

  const increment = () => updateCount(count + 1);
  const decrement = () => updateCount(count > 1 ? count - 1 : 1);

  const handleHoldStart = (action: 'increment' | 'decrement') => {
    if (action === 'increment') {
      increment();
    } else {
      decrement();
    }

    holdInterval.current = setInterval(() => {
      setCount((prev) => {
        const newCount = action === 'increment' ? prev + 1 : Math.max(1, prev - 1);
        triggerDebouncedChange(newCount);
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
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) updateCount(value);
  };

  return (
    <div className={styles.counterWrapper}>
      <div className={styles.counter}>
        <Image
          src="/cartMinus.svg"
          alt="minus icon"
          width={34}
          height={34}
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
          min={1}
        />
        <Image
          src="/cartPluse.svg"
          alt="plus icon"
          width={34}
          height={34}
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

export default CartCounter;
