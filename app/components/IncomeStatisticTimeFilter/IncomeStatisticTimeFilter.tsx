'use client';

import { useState, useRef } from 'react';
import styles from './IncomeStatisticTimeFilter.module.scss';

const options = [
  "სრული",
  "1 დღე",
  "1 კვირა",
  "1 თვე",
  "3 თვე",
  "6 თვე",
  "1 წელი",
];

interface Props {
  onChange: (index: number) => void;
}

const IncomeStatisticTimeFilter = ({ onChange }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]); 

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onChange(index);

    buttonsRef.current[index]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  return (
    <div className={styles.picker}>
      {options.map((option, index) => (
        <button
          key={index}
          ref={(el) => {
            buttonsRef.current[index] = el;
          }}
          className={`${styles.option} ${activeIndex === index ? styles.active : ''}`}
          onClick={() => handleClick(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default IncomeStatisticTimeFilter;
