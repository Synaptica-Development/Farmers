'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProductDetailCount.module.scss';
import { toast } from 'react-hot-toast';

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
  const [toastCooldown, setToastCooldown] = useState(false);

  const holdInterval = useRef<NodeJS.Timeout | null>(null);
  const holdStartTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onChange(count);
    }, 200);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [count, onChange]);

  const showToastOnce = (message: string) => {
    if (toastCooldown) return;
    toast.error(message);
    setToastCooldown(true);
    setTimeout(() => setToastCooldown(false), 3000);
  };

  const updateCount = (newCount: number) => {
    if (newCount < minCount) newCount = minCount;
    if (newCount > maxCount) newCount = maxCount;
    setCount(newCount);
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

  const onMinusPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startHold('decrement');
  };

  const onPlusPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startHold('increment');
  };

  const onPointerUpOrCancel = (e: React.PointerEvent) => {
    try {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    } catch {}
    endHold();
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

  const onTouchStartPrevent = (handler: () => void, e: React.TouchEvent) => {
    e.preventDefault();
    handler();
  };

  return (
    <div className={styles.counterWrapper}>
      <div className={styles.counter}>
        <button
          type="button"
          aria-label="decrement"
          className={styles.iconButton}
          onPointerDown={onMinusPointerDown}
          onPointerUp={onPointerUpOrCancel}
          onPointerCancel={onPointerUpOrCancel}
          onPointerLeave={onPointerUpOrCancel}
          onClick={onMinusClick}
          onTouchStart={(e) => onTouchStartPrevent(() => startHold('decrement'), e)}
          onTouchEnd={endHold}
        >
          <Image src="/whiteMinus.svg" alt="minus icon" width={24} height={24} draggable={false} />
        </button>

        <input
          type="number"
          value={count}
          onChange={handleInputChange}
          className={styles.counterInput}
          style={{ width: `${String(count).length + 1}ch` }}
          min={minCount}
          max={maxCount}
        />

        <button
          type="button"
          aria-label="increment"
          className={styles.iconButton}
          onPointerDown={onPlusPointerDown}
          onPointerUp={onPointerUpOrCancel}
          onPointerCancel={onPointerUpOrCancel}
          onPointerLeave={onPointerUpOrCancel}
          onClick={onPlusClick}
          onTouchStart={(e) => onTouchStartPrevent(() => startHold('increment'), e)}
          onTouchEnd={endHold}
        >
          <Image src="/whitePluse.svg" alt="plus icon" width={22} height={22} draggable={false} />
        </button>
      </div>
    </div>
  );
};

export default ProductDetailCount;
