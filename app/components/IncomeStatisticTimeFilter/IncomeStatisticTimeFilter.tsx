'use client';

import { useState } from 'react';
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

  const handleClick = (index: number) => {
    setActiveIndex(index);
    onChange(index); 
  };

  return (
    <div className={styles.picker}>
      {options.map((option, index) => (
        <button
          key={index}
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
