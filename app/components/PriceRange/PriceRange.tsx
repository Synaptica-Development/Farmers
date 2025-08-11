'use client';
import { useState } from 'react';
import styles from './PriceRange.module.scss';
import Image from 'next/image';

export default function PriceFilter() {
  const min = 50;
  const max = 1500;
  const [isOpen, setIsOpen] = useState(true);
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
  };

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.header}
      >
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
              left: `${((minValue - min) / (max - min)) * 100}%`,
              right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
            }}
          ></div>

          <input
            type="range"
            min={min}
            max={max}
            value={minValue}
            onChange={handleMinChange}
            className={styles.thumb}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={maxValue}
            onChange={handleMaxChange}
            className={styles.thumb}
          />
        </div>

        <div className={styles.valuesWrapper}>
          <p>ფასი:</p> 
          <div className={styles.values}>
            <p>{minValue}₾</p> - <p>{maxValue}₾</p>
          </div>
        </div>
      </div>
    </div>
  );
}
