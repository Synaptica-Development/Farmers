'use client';

import { useState } from 'react';
import styles from './ProductDetailsNavigation.module.scss';
import SimilarProducts from '../SimilarProducts/SimilarProducts';
import FarmerInformation from '../FarmerInformation/FarmerInformation';

const tabs = [
  { id: 1, label: 'გამყიდველი' },
  { id: 2, label: 'რევიუები/შეფასება' },
  { id: 3, label: 'მსგავსი პროდუქტები' },
];

interface Props {
  product: {
    categoryID: number;
    cityID: number;
    farmName: string;
    grammage: string;
    id: string;
    image1: string;
    image2: string;
    location: string;
    maxCount: number;
    minCount: number;
    price: number;
    productDescription: string;
    productName: string;
    regionID: number;
    subCategoryID: number;
    subSubCategoryID: number;
  };
}


const ProductDetailsNavigation = ({ product }: Props) => {
  const [activeTab, setActiveTab] = useState(1);


  const {
    id,
    categoryID,
    farmName,
    location,
    subCategoryID,
  } = product;

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <div
          className={styles.indicator}
          style={{
            transform: `translateX(${(activeTab - 1) * 100}%)`,
          }}
        />
      </div>

      <div className={styles.content}>
        {activeTab === 1 && (
          <FarmerInformation farmName={farmName} location={location}/>
        )}
        {activeTab === 2 && <div>⭐ რევიუები</div>}
        {activeTab === 3 && <SimilarProducts id={id} categoryID={categoryID} subCategoryID={subCategoryID}/>}
      </div>
    </div>
  );
};

export default ProductDetailsNavigation;
