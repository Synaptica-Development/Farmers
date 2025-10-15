'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './IncomeStatisticTimeFilter.module.scss';

const options = [
  "დრო",
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

const IncomeStatisticTimeFilterDropdown = ({ onChange }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.target.value);
    setSelectedIndex(index);
    onChange(index);
  };

  return (
    <div className={styles.selectWrapper}>
      <select
        className={styles.dropdown}
        value={selectedIndex}
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <option key={index} value={index}>
            {option}
          </option>
        ))}
      </select>

      <Image
        src="/dropDownArrow.svg"
        alt="arrow"
        width={16}
        height={16}
        className={styles.icon}
      />
    </div>
  );
};

export default IncomeStatisticTimeFilterDropdown;
