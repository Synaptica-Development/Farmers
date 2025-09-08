'use client';

import { useState } from 'react';
import IncomeStatistics from '@/app/components/IncomeStatistics/IncomeStatistics';
import styles from './page.module.scss';
import IncomeStatisticTimeFilter from '@/app/components/IncomeStatisticTimeFilter/IncomeStatisticTimeFilter';
import IncomeCategoryFilters from '@/app/components/IncomeCategoryFilters/IncomeCategoryFilters';

export default function StatisticPage() {
  const [filterIndex, setFilterIndex] = useState(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h2>გაყიდვები</h2>
        <div className={styles.filtersWrapper}>
          <IncomeStatisticTimeFilter onChange={setFilterIndex} />
          <IncomeCategoryFilters onChange={(cat, sub) => {
            setCategoryId(cat);
            setSubCategoryId(sub);
          }} />
        </div>
      </div>

      <IncomeStatistics
        filterIndex={filterIndex}
        categoryId={categoryId}
        subCategoryId={subCategoryId}
      />
    </div>
  );
}
