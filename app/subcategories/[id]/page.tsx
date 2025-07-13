'use client';

import styles from './page.module.scss';
import Header from '../../components/Header/Header';
import { use } from 'react';
import Categories from '@/app/components/Categories/Categories';
import ProductsSlider from '@/app/components/ProductsSlider/ProductsSlider';
import FooterComponent from '@/app/components/FooterComponent/FooterComponent';

interface Props {
  params: Promise<{ id: string }>; 
}



export default function Subcategories({ params }: Props) {
  const { id } = use(params); 
  console.log(id)
  return (
    <div className={styles.container}>
      <Header />
      <Categories/>
      <ProductsSlider categoryId={0}/>
      <ProductsSlider categoryId={0}/>
      <div style={{marginTop: '72px'}}><FooterComponent/></div>
    </div>
  );
}
