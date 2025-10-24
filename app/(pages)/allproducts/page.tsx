'use client';
import { useEffect, useState } from 'react';
import Header from '@/app/components/Header/Header';
import styles from './page.module.scss';
import AllProductSidebar from '@/app/components/AllProductSidebar/AllProductSidebar';
import AllProductsContent from '@/app/components/AllProductsContent/AllProductsContent';
import FooterComponent from '@/app/components/FooterComponent/FooterComponent';

export default function Allproducts() {
  const [minPrice, setMinPrice] = useState(0.1);
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedSubSubCategoryIds, setSelectedSubSubCategoryIds] = useState<number[]>([]);
  const [selectedRegionIds, setSelectedRegionIds] = useState<number[]>([]);
  const [selectedCityIds, setSelectedCityIds] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(s => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleCategoryChange = (ids: number[]) => {
    setSelectedCategoryIds(ids);
    setSelectedSubCategoryIds([]);
    setSelectedSubSubCategoryIds([]);
  };

  const handleSubCategoryChange = (ids: number[]) => {
    setSelectedSubCategoryIds(ids);
    setSelectedSubSubCategoryIds([]);
  };

  const handleSubSubCategoryChange = (ids: number[]) => {
    setSelectedSubSubCategoryIds(ids);
  };

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
          <AllProductSidebar
            minValue={minPrice}
            maxValue={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
            selectedSubSubCategoryIds={selectedSubSubCategoryIds}
            onSubSubCategoryChange={handleSubSubCategoryChange}
            selectedRegionIds={selectedRegionIds}
            onRegionChange={setSelectedRegionIds}
            selectedCityIds={selectedCityIds}
            onCityChange={setSelectedCityIds}
            selectedCategoryIds={selectedCategoryIds}
            onCategoryChange={handleCategoryChange}
            selectedSubCategoryIds={selectedSubCategoryIds}
            onSubCategoryChange={handleSubCategoryChange}
          />
        )}

        <AllProductsContent
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedSubSubCategoryIds={selectedSubSubCategoryIds}
          regionIDs={selectedRegionIds}
          cityIDs={selectedCityIds}
          categoryIDs={selectedCategoryIds}
          subCategoryIDs={selectedSubCategoryIds}
          toggleSidebar={toggleSidebar}
        />

        {isMobile && isSidebarOpen && (
          <div className={styles.mobileOverlay} onClick={closeSidebar}>
            <div className={styles.mobilePanel} onClick={e => e.stopPropagation()}>
              <AllProductSidebar
                minValue={minPrice}
                maxValue={maxPrice}
                onMinChange={setMinPrice}
                onMaxChange={setMaxPrice}
                selectedSubSubCategoryIds={selectedSubSubCategoryIds}
                onSubSubCategoryChange={handleSubSubCategoryChange}
                selectedRegionIds={selectedRegionIds}
                onRegionChange={setSelectedRegionIds}
                selectedCityIds={selectedCityIds}
                onCityChange={setSelectedCityIds}
                selectedCategoryIds={selectedCategoryIds}
                onCategoryChange={handleCategoryChange}
                selectedSubCategoryIds={selectedSubCategoryIds}
                onSubCategoryChange={handleSubCategoryChange}
              />
            </div>
          </div>
        )}
      </div>
      <FooterComponent/>
    </div>
  );
}
