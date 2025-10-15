'use client';

import { useEffect, useState } from 'react';
import styles from './IncomeCategoryFilters.module.scss';
import api from '@/lib/axios';
import Image from 'next/image';

type Category = { id: number; name: string; };
type SubCategory = { id: number; name: string; };

interface Props {
  onChange: (categoryId: number | null, subCategoryId: number | null) => void;
}

const IncomeCategoryFilters = ({ onChange }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);

  useEffect(() => {
    api.get('/api/Farmer/licensed-categories')
      .then(res => {
        const data = res.data as Category[];
        const allOption = { id: -1, name: "კატეგორია" };
        setCategories([allOption, ...data]);
        setSelectedCategory(null);
        onChange(null, null);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCategory === null || selectedCategory === -1) {
      setSubCategories([{ id: -1, name: "ქვეკატეგორია" }]);
      setSelectedSubCategory(null);
      onChange(selectedCategory === -1 ? null : selectedCategory, null);
      return;
    }

    api.get(`/api/Farmer/licensed-sub-categories?categoryID=${selectedCategory}`)
      .then(res => {
        const data = res.data as SubCategory[];
        const allOption = { id: -1, name: "ქვეკატეგორია" };
        setSubCategories([allOption, ...data]);
        setSelectedSubCategory(null);
        onChange(selectedCategory, null);
      })
      .catch(console.error);
  }, [selectedCategory]);

  useEffect(() => {
    onChange(
      selectedCategory === -1 ? null : selectedCategory,
      selectedSubCategory === -1 ? null : selectedSubCategory
    );
  }, [selectedSubCategory]);

  return (
    <div className={styles.filters}>
      {/* Category select */}
      <div className={styles.selectWrapper}>
        <select
          value={selectedCategory ?? -1}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSelectedCategory(val === -1 ? null : val);
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
          value={selectedSubCategory ?? -1}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSelectedSubCategory(val === -1 ? null : val);
          }}
          className={styles.dropdown}
          disabled={selectedCategory === null}
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
