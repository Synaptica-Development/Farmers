'use client';

import { useEffect, useState } from 'react';
import styles from './IncomeCategoryFilters.module.scss';
import api from '@/lib/axios';
import Image from 'next/image';

type Category = { id: number; name: string };
type SubCategory = { id: number; name: string };

interface Props {
  categoryId: number | null;
  subCategoryId: number | null;
  onChange: (categoryId: number | null, subCategoryId: number | null) => void;
}

const IncomeCategoryFilters = ({ categoryId, subCategoryId, onChange }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // Load all categories once
  useEffect(() => {
    api
      .get('/api/Farmer/licensed-categories')
      .then((res) => {
        const data = res.data as Category[];
        const allOption = { id: -1, name: 'კატეგორია' };
        setCategories([allOption, ...data]);
      })
      .catch(console.error);
  }, []);

  // Load subcategories whenever category changes
  useEffect(() => {
    if (categoryId === null || categoryId === -1) {
      setSubCategories([{ id: -1, name: 'ქვეკატეგორია' }]);
      return;
    }

    api
      .get(`/api/Farmer/licensed-sub-categories?categoryID=${categoryId}`)
      .then((res) => {
        const data = res.data as SubCategory[];
        const allOption = { id: -1, name: 'ქვეკატეგორია' };
        setSubCategories([allOption, ...data]);
      })
      .catch(console.error);
  }, [categoryId]);

  return (
    <div className={styles.filters}>
      {/* Category select */}
      <div className={styles.selectWrapper}>
        <select
          value={categoryId ?? -1}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChange(val === -1 ? null : val, null);
          }}
          className={styles.dropdown}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
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

      {/* SubCategory select */}
      <div className={styles.selectWrapper}>
        <select
          value={subCategoryId ?? -1}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChange(categoryId, val === -1 ? null : val);
          }}
          className={styles.dropdown}
          disabled={categoryId === null}
        >
          {subCategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
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
    </div>
  );
};

export default IncomeCategoryFilters;
