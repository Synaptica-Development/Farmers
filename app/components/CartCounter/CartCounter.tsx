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
  const holdStartTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

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
        })
        .catch(() => { });
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
      showToastOnce(`მინიმალური რაოდენობაა ${minCount}`);
      return;
    }
    updateCount(count - 1);
  };

  const startHold = (action: 'increment' | 'decrement') => {
    longPressTriggered.current = false;
    if (holdStartTimeout.current) clearTimeout(holdStartTimeout.current);
    holdStartTimeout.current = setTimeout(() => {
      longPressTriggered.current = true;
      holdInterval.current = setInterval(() => {
        setCount((prev) => {
          let next = prev;
          if (action === 'increment' && prev < maxCount) next = prev + 1;
          if (action === 'decrement' && prev > minCount) next = prev - 1;
          if (next !== prev) triggerDebouncedChange(next);
          return next;
        });
      }, 150);
    }, 300);
  };

  const endHold = () => {
    if (holdStartTimeout.current) {
      clearTimeout(holdStartTimeout.current);
      holdStartTimeout.current = null;
    }
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
  };

  const onMinusClick = () => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    decrement();
  };

  const onPlusClick = () => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    increment();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (Number.isNaN(value)) return;
    const fixedValue = Math.floor(value * 10) / 10;
    if (fixedValue < minCount) {
      showToastOnce(`მინიმალური რაოდენობაა ${minCount}`);
      updateCount(minCount);
    } else if (fixedValue > maxCount) {
      showToastOnce(`მაქსიმალური რაოდენობაა ${maxCount}`);
      updateCount(maxCount);
    } else {
      updateCount(fixedValue);
    }
  };

  return (
    <div className={styles.counterWrapper}>
      <div className={styles.counter}>
        <div
          onTouchStart={() => startHold('decrement')}
          onTouchEnd={() => endHold()}
          onMouseDown={() => startHold('decrement')}
          onMouseUp={() => endHold()}
          onMouseLeave={() => endHold()}
          onClick={onMinusClick}
          className={styles.btnImageWrapper}
        >
          <Image
            src="/cartMinus.svg"
            alt="minus icon"
            width={34}
            height={34}
            draggable={false}
          />
        </div>

        <input
          type="number"
          value={count}
          onChange={handleInputChange}
          className={styles.counterInput}
          style={{ width: `${String(count).length + 1}ch` }}
          min={minCount}
          max={maxCount}
        />

        <div
          onTouchStart={() => startHold('increment')}
          onTouchEnd={() => endHold()}
          onMouseDown={() => startHold('increment')}
          onMouseUp={() => endHold()}
          onMouseLeave={() => endHold()}
          onClick={onPlusClick}
          className={styles.btnImageWrapper}

        >
          <Image
            src="/cartPluse.svg"
            alt="plus icon"
            width={34}
            height={34}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CartCounter;
