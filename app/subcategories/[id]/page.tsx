'use client';

import styles from './page.module.scss';
import Header from '../../components/Header/Header';
import { use } from 'react';
import FooterComponent from '@/app/components/FooterComponent/FooterComponent';
import SubCategories from '@/app/components/SubCategories/SubCategories';
import SubProductsSection from '@/app/components/SubProductsSection/SubProductsSection';

interface Props {
  params: Promise<{ id: string }>; 
}

export default function Subcategories({ params }: Props) {
  const { id } = use(params); 
  return (
    <div className={styles.container}>
      <Header />
      <SubCategories categoryID={id}/>
      <SubProductsSection categoryID={id}/>
      <div style={{marginTop: '72px'}}><FooterComponent/></div>
    </div>
  );
}
