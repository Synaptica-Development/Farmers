'use client';

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
  value: number;
  onChange: (index: number) => void;
}

const IncomeStatisticTimeFilterDropdown = ({ value, onChange }: Props) => {
  return (
    <div className={styles.selectWrapper}>
      <select
        className={styles.dropdown}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
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
