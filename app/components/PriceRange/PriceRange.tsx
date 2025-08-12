'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './PriceRange.module.scss';
import Image from 'next/image';

interface PriceRangeProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export default function PriceRange({ minValue, maxValue, onMinChange, onMaxChange }: PriceRangeProps) {
  const min = 0.2;
  const max = 500;
  const [isOpen, setIsOpen] = useState(true);

  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  const minTimeout = useRef<NodeJS.Timeout | null>(null);
  const maxTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - 1);
    setLocalMin(value);

    if (minTimeout.current) clearTimeout(minTimeout.current);
    minTimeout.current = setTimeout(() => {
      onMinChange(value);
    }, 500);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + 1);
    setLocalMax(value);

    if (maxTimeout.current) clearTimeout(maxTimeout.current);
    maxTimeout.current = setTimeout(() => {
      onMaxChange(value);
    }, 500);
  };

  useEffect(() => setLocalMin(minValue), [minValue]);
  useEffect(() => setLocalMax(maxValue), [maxValue]);

  return (
    <div className={styles.wrapper}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.header}>
        <span>ფასი</span>
        <Image
          src={'/dropDownArrow.svg'}
          alt="arrow"
          width={14}
          height={8}
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
        />
      </button>

      <div className={`${styles.content} ${isOpen ? styles.show : ''}`}>
        <div className={styles.slider}>
          <div className={styles.track}></div>
          <div
            className={styles.range}
            style={{
              left: `${((localMin  - min) / (max - min)) * 100}%`,
              right: `${100 - ((localMax  - min) / (max - min)) * 100}%`,
            }}
          ></div>

          <input
            type="range"
            min={min}
            max={max}
            step={0.1}
            value={localMin}
            onChange={handleMinChange}
            className={styles.thumb}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={0.1}
            value={localMax}
            onChange={handleMaxChange}
            className={styles.thumb}
          />
        </div>

        <div className={styles.valuesWrapper}>
          <p>ფასი:</p>
          <div className={styles.values}>
            <p>{localMin}₾</p> - <p>{localMax}₾</p>
          </div>
        </div>
      </div>
    </div>
  );
}
