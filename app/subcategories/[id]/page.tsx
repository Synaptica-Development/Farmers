'use client';

import styles from './page.module.scss';
import Header from '../../components/Header/Header';
import { use } from 'react';
import ProductsSlider from '@/app/components/ProductsSlider/ProductsSlider';
import FooterComponent from '@/app/components/FooterComponent/FooterComponent';
import SubCategories from '@/app/components/SubCategories/SubCategories';

interface Props {
  params: Promise<{ id: string }>; 
}

export default function Subcategories({ params }: Props) {
  const { id } = use(params); 
  return (
    <div className={styles.container}>
      <Header />
      <SubCategories categoryID={id}/>
      <ProductsSlider categoryId={0}/>
      <ProductsSlider categoryId={0}/>
      <div style={{marginTop: '72px'}}><FooterComponent/></div>
    </div>
  );
}
