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
  const categoriesData = [
    { title: 'ხილი', image: 'fruit', alt: 'fruit', href: '/subcategories/idofproduct' },
    { title: 'ბოსტნეული', image: 'vegetable', alt: 'vegetable', href: '/' },
    { title: 'რძის პროდუქტი', image: 'test', alt: 'dairy', href: '/' },
    { title: 'სურსათი', image: 'test', alt: 'groceries', href: '/' },
    { title: 'წვენები', image: 'test', alt: 'juice', href: '/' },
    { title: 'წიწაკა', image: 'test', alt: 'pepper', href: '/' },
    { title: 'კონცენტრატი', image: 'test', alt: 'concentrate', href: '/' },
    { title: 'ზეთი', image: 'test', alt: 'oil', href: '/' },
    { title: 'ჩაი', image: 'test', alt: 'tea', href: '/' },
    { title: 'ყავა', image: 'test', alt: 'coffee', href: '/' },
    { title: 'ნუგბარი', image: 'test', alt: 'snacks', href: '/' },
    { title: 'სასმელები', image: 'test', alt: 'drinks', href: '/' },
  ];

  const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        api.get('/Categories')      
          .then(res => setCategories(res.data))
          .catch(err => console.log("erroorr: ", err))
      }, []);
    return (
      <div className={styles.wrapper}>
        {categories.map((item) => (
        <CategoriesItem
          key={item.id}                                      
          title={item.name}                                  
          image={`http://185.49.165.101:5000/${item.imgLink}`}                                
          alt={item.name}                                      
          href={`/subcategories/${item.id}`}                   
        />
      ))}
      </div>
    );
  };

  export default Categories;
