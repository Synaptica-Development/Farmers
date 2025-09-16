'use client';

import { useState, useEffect } from 'react';
import styles from './ProductDetailsNavigation.module.scss';
import FarmerInformation from '../FarmerInformation/FarmerInformation';
import CommentsOnProduct from '../CommentsOnProduct/CommentsOnProduct';
import ProductDetailsInfoDescriptions from '../ProductDetailsInfo/ProductDetailsInfoDescriptions/ProductDetailsInfoDescriptions';

interface Props {
  product: {
    id: string;
    farmerID: string;
    grammage: string;
    maxCount: number;
    minCount: number;
    price: number;
    productDescription: string;
    productName: string;
  };
}

const ProductDetailsNavigation = ({ product }: Props) => {
  const [activeTab, setActiveTab] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 940);
    checkScreen(); 
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const tabs = isMobile
    ? [
        { id: 1, label: 'აღწერა' },
        { id: 2, label: 'გამყიდველი' },
        { id: 3, label: 'შეფასებები' },
      ]
    : [
        { id: 1, label: 'გამყიდველი' },
        { id: 2, label: 'შეფასებები' },
      ];

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
            width: `calc(100% / ${tabs.length})`,
            transform: `translateX(${(activeTab - 1) * 100}%)`,
          }}
        />
      </div>

      <div className={styles.content}>
        {isMobile && activeTab === 1 && (
          <ProductDetailsInfoDescriptions
            id={product.id}
            grammage={product.grammage}
            maxCount={product.maxCount}
            minCount={product.minCount}
            price={product.price}
            productDescription={product.productDescription}
            productName={product.productName}
            
          />
        )}
        {activeTab === (isMobile ? 2 : 1) && (
          <FarmerInformation farmerID={product.farmerID} />
        )}
        {activeTab === (isMobile ? 3 : 2) && (
          <CommentsOnProduct id={product.id} />
        )}
      </div>
    </div>
  );
};

export default ProductDetailsNavigation;
