'use client';

import PriceRange from '../PriceRange/PriceRange';
import SubSubCategoriesFilter from '../SubSubCategoriesFilter/SubSubCategoriesFilter';
import RegionsFilter from '../RegionsFilter/RegionsFilter';
import styles from './ProductSidebar.module.scss';

interface ProductSidebarProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;

  selectedSubSubCategoryIds: number[];
  onSubSubCategoryChange: (ids: number[]) => void;

  selectedRegionIds: number[];
  onRegionChange: (ids: number[]) => void;

  selectedCityIds: number[];
  onCityChange: (ids: number[]) => void;
}

const ProductSidebar = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  selectedSubSubCategoryIds,
  onSubSubCategoryChange,
  selectedRegionIds,
  onRegionChange,
  selectedCityIds,
  onCityChange,
}: ProductSidebarProps) => {
  return (
    <div className={styles.wrapper}>
      <h2>ფილტრები</h2>
      <div className={styles.content}>
        <SubSubCategoriesFilter
          activeIds={selectedSubSubCategoryIds}
          onChange={onSubSubCategoryChange}
        />
        <RegionsFilter
          activeRegionIds={selectedRegionIds}
          onRegionChange={onRegionChange}
          activeCityIds={selectedCityIds}
          onCityChange={onCityChange}
        />
         <PriceRange
          minValue={minValue}
          maxValue={maxValue}
          onMinChange={onMinChange}
          onMaxChange={onMaxChange}
        />
      </div>
    </div>
  );
};

export default ProductSidebar;
