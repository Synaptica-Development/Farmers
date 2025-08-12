'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header/Header';
import styles from './page.module.scss';
import ProductSidebar from '@/app/components/ProductSidebar/ProductSidebar';
import SubProductsContent from '@/app/components/SubProductsContent/SubProductsContent';

export default function Subproducts() {
  const [minPrice, setMinPrice] = useState(0.2);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedSubSubCategoryIds, setSelectedSubSubCategoryIds] = useState<number[]>([]);
  const [selectedRegionIds, setSelectedRegionIds] = useState<number[]>([]);
  const [selectedCityIds, setSelectedCityIds] = useState<number[]>([]);


  useEffect(() => {
    console.log('Filters updated:');
    console.log('Price:', minPrice, '-', maxPrice);
    console.log('SubSubCategories:', selectedSubSubCategoryIds);
    console.log('Regions:', selectedRegionIds);
    console.log('Cities:', selectedCityIds);
  }, [minPrice, maxPrice, selectedSubSubCategoryIds, selectedRegionIds, selectedCityIds]);

  return (
    <div>
      <Header />
      <div className={styles.contantWrapper}>
        <ProductSidebar
          minValue={minPrice}
          maxValue={maxPrice}
          onMinChange={setMinPrice}
          onMaxChange={setMaxPrice}
          selectedSubSubCategoryIds={selectedSubSubCategoryIds}
          onSubSubCategoryChange={setSelectedSubSubCategoryIds}
          selectedRegionIds={selectedRegionIds}
          onRegionChange={setSelectedRegionIds}
          selectedCityIds={selectedCityIds}
          onCityChange={setSelectedCityIds}
        />
        <SubProductsContent
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedSubSubCategoryIds={selectedSubSubCategoryIds}
          regionIDs={selectedRegionIds}
          cityIDs={selectedCityIds}
        />
      </div>
    </div>
  );
}
