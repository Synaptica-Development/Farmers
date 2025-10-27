'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [inputValue, setInputValue] = useState<string>(String(initialCount));
  const [toastCooldown, setToastCooldown] = useState(false);
  const prevValidValue = useRef<number>(initialCount);

  const holdInterval = useRef<NodeJS.Timeout | null>(null);
  const holdStartTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  useEffect(() => {
    setCount(initialCount);
    setInputValue(String(initialCount));
    prevValidValue.current = initialCount;
  }, [initialCount]);

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
        .then(() => refetchTotalOfCart())
        .catch(() => refetchTotalOfCart());
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
    setInputValue(String(newCount));
    prevValidValue.current = newCount;
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
          if (next !== prev) {
            setInputValue(String(next));
            prevValidValue.current = next;
            triggerDebouncedChange(next);
          }
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
    const value = e.target.value;
    setInputValue(value);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      const num = Number(value);
      if (Number.isNaN(num) || value.trim() === '') {
        showToastOnce(`არასწორი რაოდენობა`);
        setInputValue(String(prevValidValue.current));
        return;
      }
      if (num < minCount) {
        showToastOnce(`მინიმალური რაოდენობაა ${minCount}`);
        setInputValue(String(prevValidValue.current));
        return;
      }
      if (num > maxCount) {
        showToastOnce(`მაქსიმალური რაოდენობაა ${maxCount}`);
        setInputValue(String(prevValidValue.current));
        return;
      }
      if (num !== prevValidValue.current) {
        updateCount(num);
      }
    }, 1000);
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
          value={inputValue}
          onChange={handleInputChange}
          className={styles.counterInput}
          style={{ width: `${String(inputValue).length + 1}ch` }}
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
