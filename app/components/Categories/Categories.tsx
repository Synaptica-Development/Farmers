'use client';

import api from '@/lib/axios';
import styles from './Categories.module.scss';
import CategoriesItem from './CategoriesItem/CategoriesItem';
import { useEffect, useState } from 'react';
interface Category {
  id: number;
  name: string;
  imgLink: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.log("error: ", err))
  }, []);
  console.log(categories)
  return (
    <div className={styles.wrapper}>
      {categories.map((item) => (
        <CategoriesItem
          key={item.id}
          title={item.name}
          image={`http://185.49.165.101/${item.imgLink}/${item.id}`}
          alt={item.name}
          href={`/subcategories/${item.id}`}
        />
      ))}
    </div>
  );
};

export default Categories;
