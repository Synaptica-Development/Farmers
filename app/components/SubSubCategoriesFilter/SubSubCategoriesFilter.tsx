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

const SubSubCategoriesFilter = () => {
  const { subCategoryID } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<SubSubCategory[]>([]);
  const [activeIds, setActiveIds] = useState<number[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .get(`/subsubcategories?subCategoryID=${subCategoryID}`)
      .then((res) => {
        setCategories(res.data.subCategories || []);
      })
      .catch((err) => console.error(err));
  }, [subCategoryID]);

  const toggleActive = (id: number) => {
    setActiveIds((prev) =>
      prev.includes(id)
        ? prev.filter((activeId) => activeId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.header}
      >
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
        ref={contentRef}
        className={`${styles.content} ${isOpen ? styles.show : ''}`}
        style={{
          maxHeight: isOpen
            ? `${contentRef.current?.scrollHeight || 0}px`
            : '0px',
        }}
      >
        <div className={styles.radioWrapper}>
          {categories.map((cat) => (
            <label key={cat.id} className={styles.radioItem}>
              <input
                type="checkbox"
                checked={activeIds.includes(cat.id)}
                onChange={() => toggleActive(cat.id)}
              />
              <span className={styles.customRadio}></span>
              {cat.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubSubCategoriesFilter;
