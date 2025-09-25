// 'use client';
import PriceRange from '../PriceRange/PriceRange';
import SubSubCategoriesFilter from '../SubSubCategoriesFilter/SubSubCategoriesFilter';
import RegionsFilter from '../RegionsFilter/RegionsFilter';
import CategoriesFilter from '../CategoriesFilter/CategoriesFilter';
import SubCategoriesFilter from '../SubCategoriesFilter/SubCategoriesFilter';
import styles from './AllProductSidebar.module.scss';

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
  selectedCategoryIds: number[];
  onCategoryChange: (ids: number[]) => void;
  selectedSubCategoryIds: number[];
  onSubCategoryChange: (ids: number[]) => void;
}

const AllProductSidebar = ({
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
  selectedCategoryIds,
  onCategoryChange,
  selectedSubCategoryIds,
  onSubCategoryChange,
}: ProductSidebarProps) => {
  return (
    <div className={styles.wrapper}>
      <h2>ფილტრები</h2>
      <div className={styles.content}>
        <CategoriesFilter activeIds={selectedCategoryIds} onChange={onCategoryChange} />

        {selectedCategoryIds.length === 1 && (
          <SubCategoriesFilter
            categoryIds={selectedCategoryIds}
            activeIds={selectedSubCategoryIds}
            onChange={onSubCategoryChange}
          />
        )}

        {selectedSubCategoryIds.length === 1 && (
          <SubSubCategoriesFilter
            activeIds={selectedSubSubCategoryIds}
            onChange={onSubSubCategoryChange}
            subCategoryID={selectedSubCategoryIds[0]}
          />
        )}

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

export default AllProductSidebar;
