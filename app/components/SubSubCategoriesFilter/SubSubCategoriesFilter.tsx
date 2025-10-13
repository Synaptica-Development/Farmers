'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './SubSubCategoriesFilter.module.scss';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';

interface SubSubCategory {
  id: number;
  subCategoryID: number;
  name: string;
  subCategory: string | null;
}

interface Props {
  activeIds: number[];
  onChange: (ids: number[]) => void;
  subCategoryID?: number | string;
}

const SubSubCategoriesFilter = ({ activeIds, onChange, subCategoryID: propSubCategoryID }: Props) => {
  const { subCategoryID: paramSubCategoryID } = useParams();
  const [isOpen, setIsOpen] = useState(true);
  const [categories, setCategories] = useState<SubSubCategory[]>([]);

  const effectiveSubCategoryID = propSubCategoryID ?? paramSubCategoryID;

  useEffect(() => {
    if (!effectiveSubCategoryID) return;

    api
      .get(`/subsubcategories?subCategoryID=${effectiveSubCategoryID}`)
      .then((res) => {
        setCategories(res.data.subCategories || []);
      })
      .catch((err) => console.error(err));
  }, [effectiveSubCategoryID]);

  const toggleActive = (id: number) => {
    if (activeIds.includes(id)) {
      onChange(activeIds.filter((activeId) => activeId !== id));
    } else {
      onChange([...activeIds, id]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.header}>
        <span>ჯიშები</span>
        <Image
          src={'/dropDownArrow.svg'}
          alt="arrow"
          width={14}
          height={8}
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
        />
      </button>

      <div
        className={`${styles.content} ${isOpen ? styles.show : ''}`}
        style={{
          maxHeight: isOpen ? `100%` : '0px',
        }}
      >
        <div className={styles.radioWrapper}>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <label key={cat.id} className={styles.radioItem}>
                <input
                  type="checkbox"
                  checked={activeIds.includes(cat.id)}
                  onChange={() => toggleActive(cat.id)}
                />
                <span className={styles.customRadio}></span>
                {cat.name}
              </label>
            ))
          ) : (
            <p className={styles.noItems}>ჯიში ვერ მოიძებნა</p>
          )}
        </div>
      </div>

    </div >
  );
};

export default SubSubCategoriesFilter;
