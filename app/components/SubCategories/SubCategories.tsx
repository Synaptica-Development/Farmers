'use client';

import api from '@/lib/axios';
import styles from './SubCategories.module.scss';
import { useEffect, useState } from 'react';
import CategoriesItem from '../CategoriesItem/CategoriesItem';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  category: string | null;
  categoryID: number;
  imgLink: string;
}

interface Props {
  categoryID: string;
}
const SubCategories = (props: Props) => {
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [subCategoryTitle, setSubCategoryTitle] = useState<string>();
 

  const router = useRouter();


  useEffect(() => {
    api.get('/subcategories', {
      params: {
        categoryID: props.categoryID,
      },
    })
      .then(res => {
        setSubCategories(res.data.categories)
        setSubCategoryTitle(res.data.title)
      })
      .catch(err => console.log("error: ", err))
  }, [props.categoryID]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.categoriesHeader}>
        <div className={styles.backButton} onClick={() => router.back()}>
          <Image
            src={'/whiteleftArrow.svg'}
            alt='white arrow'
            width={18}
            height={14}
          />
          <p>უკან</p>
        </div>
        <h2>{subCategoryTitle}</h2>
      </div>
      <div className={styles.CategoriesWrapper}>
        {subCategories.map((item) => (
          <CategoriesItem
            key={item.id}
            title={item.name}
            image={`http://185.49.165.101/${item.imgLink}/${item.id}`}
            alt={item.name}
            href={`/subcategories/${item.id}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SubCategories;
