'use client';
import React from 'react';
import styles from './CardProductDetails.module.scss';
import Image from 'next/image';
import CartCounter from '../CartCounter/CartCounter';
import BASE_URL from '@/app/config/api';

interface Product {
  image1: string;
  productName: string;
  price: number;
  grammage: string;
  minCount: number;
  maxCount: number;
}

interface CartProduct {
  cartItemID: string;
  count: number;
  transportPrice: number;
  product: Product;
  productTotalPrice?: number;
}

interface CardProductDetailsProps {
  cartProductsData: CartProduct[];
  onDelete: (id: string) => void;
  refetchTotalOfCart: () => void;
  onCountChange: (cartItemID: string, newCount: number) => void;
}

const CardProductDetails: React.FC<CardProductDetailsProps> = ({
  cartProductsData,
  onDelete,
  onCountChange,
  refetchTotalOfCart,
}) => {
  return (
    <div className={styles.cardItemsSection}>
      <div className={styles.cardItemsHeader}>
        <p>პროდუქტი</p>
        <p>ფასი</p>
        <p>რაოდ.</p>
        <p>ერთეული</p>
        <p>მომსახ.საფ</p>
        <p>სრული</p>
      </div>
      <div className={styles.cardItemsWrapper}>
        {cartProductsData?.map((item) => (
          <div key={item.cartItemID} className={styles.card}>
            <div className={styles.productInfo}>
              <img className={styles.productImage} src={`${BASE_URL}${item.product.image1}`} alt="product image" />
              <h2>{item.product.productName}</h2>
            </div>
            <p>{item.product.price}₾</p>
            <CartCounter
              initialCount={item.count}
              maxCount={item.product.maxCount}
              minCount={item.product.minCount}
              cartItemID={item.cartItemID}
              onChange={(newCount) => onCountChange(item.cartItemID, newCount)}
              refetchTotalOfCart={refetchTotalOfCart}
            />
            <p>{item.product.grammage}</p>
            <p>{item.transportPrice}₾</p>
            <p>
              {typeof item.productTotalPrice === 'number'
                ? item.productTotalPrice % 1 === 0
                  ? String(item.productTotalPrice)
                  : item.productTotalPrice.toFixed(2)
                : '-'}
              ₾
            </p>
            <div className={styles.deleteIconWrapper} onClick={() => { onDelete(item.cartItemID); }}>
              <Image src="/cardDeleteIcon.svg" alt="delete icon" width={24} height={24} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardProductDetails;
