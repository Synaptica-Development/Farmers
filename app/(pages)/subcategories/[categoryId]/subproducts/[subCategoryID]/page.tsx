'use client';

import { useEffect, useState } from 'react';
import Header from '@/app/components/Header/Header';
import styles from './page.module.scss';
import ProductSidebar from '@/app/components/ProductSidebar/ProductSidebar';
import SubProductsContent from '@/app/components/SubProductsContent/SubProductsContent';

export default function Subproducts() {
  const [minPrice, setMinPrice] = useState(0.1);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedSubSubCategoryIds, setSelectedSubSubCategoryIds] = useState<number[]>([]);
  const [selectedRegionIds, setSelectedRegionIds] = useState<number[]>([]);
  const [selectedCityIds, setSelectedCityIds] = useState<number[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    console.log('Filters updated:');
    console.log('Price:', minPrice, '-', maxPrice);
    console.log('SubSubCategories:', selectedSubSubCategoryIds);
    console.log('Regions:', selectedRegionIds);
    console.log('Cities:', selectedCityIds);
  }, [minPrice, maxPrice, selectedSubSubCategoryIds, selectedRegionIds, selectedCityIds]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  return (
    <div>
      <Header />
      <div className={styles.contantWrapper}>
        {!isMobile && (
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
        )}

        <SubProductsContent
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedSubSubCategoryIds={selectedSubSubCategoryIds}
          regionIDs={selectedRegionIds}
          cityIDs={selectedCityIds}
          toggleSidebar={toggleSidebar}
        />

        {isMobile && isSidebarOpen && (
          <div className={styles.mobileOverlay} onClick={closeSidebar}>
            <div className={styles.mobilePanel} onClick={(e) => e.stopPropagation()}>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
