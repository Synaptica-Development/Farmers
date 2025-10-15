'use client';

import { useState } from 'react';
import IncomeStatistics from '@/app/components/IncomeStatistics/IncomeStatistics';
import styles from './page.module.scss';
import IncomeStatisticTimeFilter from '@/app/components/IncomeStatisticTimeFilter/IncomeStatisticTimeFilter';
import IncomeCategoryFilters from '@/app/components/IncomeCategoryFilters/IncomeCategoryFilters';
import Image from "next/image";

export default function StatisticPage() {
  const [filterIndex, setFilterIndex] = useState(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleBackdropClick = () => setShowFilters(false);
  const toggleFilters = () => setShowFilters(s => !s);

  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h2>გაყიდვები</h2>

          <div className={styles.filtersWrapper}>
            <IncomeStatisticTimeFilter onChange={setFilterIndex} value={filterIndex} />
            <IncomeCategoryFilters
              categoryId={categoryId}
              subCategoryId={subCategoryId}
              onChange={(cat, sub) => {
                setCategoryId(cat);
                setSubCategoryId(sub);
              }}
            />

          </div>

          <button
            aria-label={showFilters ? "Close filters" : "Open filters"}
            className={styles.filterButton}
            onClick={toggleFilters}
          >
            <Image
              src="/filterIcon.svg"
              alt="filter"
              width={24}
              height={24}
              className={styles.filterIcon}
            />
          </button>
        </div>

        <IncomeStatistics
          filterIndex={filterIndex}
          categoryId={categoryId}
          subCategoryId={subCategoryId}
        />

        {showFilters && (
          <div
            className={styles.filtersOverlay}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
          >
            <div
              className={styles.filtersPanel}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.panelHeader}>
                <h3>ფილტრები</h3>
                <button
                  aria-label="Close filters"
                  className={styles.panelClose}
                  onClick={() => setShowFilters(false)}
                >
                  ✕
                </button>
              </div>

              <div className={styles.panelContent}>
                <IncomeStatisticTimeFilter onChange={(idx) => {
                  setFilterIndex(idx);
                }}
                  value={filterIndex}
                />
                <IncomeCategoryFilters
                  categoryId={categoryId}
                  subCategoryId={subCategoryId}
                  onChange={(cat, sub) => {
                    setCategoryId(cat);
                    setSubCategoryId(sub);
                  }}
                />
              </div>

              <div className={styles.panelFooter}>
                <button
                  className={styles.applyBtn}
                  onClick={() => setShowFilters(false)}
                >
                  გაფილტვრა
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
