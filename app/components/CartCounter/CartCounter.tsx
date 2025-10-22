'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './CartCounter.module.scss';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface CartCounterProps {
  cartItemID: string;
  initialCount: number;
  onChange: (newCount: number) => void;
  refetchTotalOfCart: () => void;
  maxCount: number;
  minCount: number;
}

const CartCounter = ({
  initialCount,
  onChange,
  cartItemID,
  refetchTotalOfCart,
  maxCount,
  minCount,
}: CartCounterProps) => {
  const [count, setCount] = useState<number>(initialCount);
  const [toastCooldown, setToastCooldown] = useState(false);

  const holdInterval = useRef<NodeJS.Timeout | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerDebouncedChange = (newCount: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      onChange(newCount);
      api
        .put('/api/Cart/change-product-count', null, {
          params: {
            productID: cartItemID,
            count: newCount,
          },
        })
        .then(() => {
          refetchTotalOfCart();
          console.log('Count updated successfully on server');
        })
        .catch((err) => console.error('Failed to update count:', err));
    }, 500);
  };


  const showToastOnce = (message: string) => {
    if (toastCooldown) return;
    toast.error(message);
    setToastCooldown(true);
    setTimeout(() => setToastCooldown(false), 3000);
  };

  const updateCount = (newCount: number, debounce = true) => {
    if (newCount < minCount) newCount = minCount;
    if (newCount > maxCount) newCount = maxCount;

    setCount(newCount);
    if (debounce) triggerDebouncedChange(newCount);
  };

  const increment = () => {
    if (count >= maxCount) {
      showToastOnce(`მაქსიმალური რაოდენობაა ${maxCount}`);
      return;
    }
    updateCount(count + 1);
  };


  const decrement = () => {
    if (count <= minCount) {
      showToastOnce(`მინიმალური რაოდენობაა ${maxCount}`);
      return;
    }
    updateCount(count - 1);
  };


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
        } else if (action === 'decrement' && prev > minCount) {
          newCount = prev - 1;
        }

        if (newCount !== prev) {
          triggerDebouncedChange(newCount);
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
          min={minCount}
          max={maxCount}
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
