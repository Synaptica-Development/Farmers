'use client';

import styles from './CardProductDetails.module.scss';
import Image from 'next/image';
import CartCounter from '../CartCounter/CartCounter';
import BASE_URL from '@/app/config/api';

interface CartProduct {
  cartItemID: string;
  count: number;
  transportPrice: number;
  product: {
    image1: string;
    productName: string;
    price: number;
    grammage: string;
    minCount: number
    maxCount: number;
  };
}

interface CardProductDetailsProps {
  cartProductsData: CartProduct[];
  onDelete: (id: string) => void;
  refetchTotalOfCart: () => void;
  onCountChange: (cartItemID: string, newCount: number) => void;
}

const CardProductDetails = ({
  cartProductsData,
  onDelete,
  onCountChange,
  refetchTotalOfCart,
}: CardProductDetailsProps) => {
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
              <img
                className={styles.productImage}
                src={`${BASE_URL}${item.product.image1}`}
                alt="product image"
              />
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
              {(() => {
                const total = item.count * item.product.price + item.transportPrice;
                const formatted = Math.round(total * 100) / 100;
                return formatted % 1 === 0 ? formatted : formatted.toFixed(2);
              })()}₾
            </p>

            <div className={styles.deleteIconWrapper} onClick={() => { refetchTotalOfCart(); }}>
              <Image
                src="/cardDeleteIcon.svg"
                alt="delete icon"
                width={24}
                height={24}
                onClick={() => onDelete(item.cartItemID)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardProductDetails;
