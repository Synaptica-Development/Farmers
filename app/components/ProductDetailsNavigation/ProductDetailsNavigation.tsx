'use client';

import { useState } from 'react';
import styles from './ProductDetailsNavigation.module.scss';
import FarmerInformation from '../FarmerInformation/FarmerInformation';
import CommentsOnProduct from '../CommentsOnProduct/CommentsOnProduct';

const tabs = [
  { id: 1, label: 'გამყიდველი' },
  { id: 2, label: 'რევიუები/შეფასება' },
];

interface Props {
  product: {
    id: string;
    farmerID: string;
  };
}

const ProductDetailsNavigation = ({ product }: Props) => {
  const [activeTab, setActiveTab] = useState(1);

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
          <FarmerInformation farmerID={product.farmerID} />
        )}
        {activeTab === 2 && <CommentsOnProduct id={product.id} />}
      </div>
    </div>
  );
};

export default ProductDetailsNavigation;
