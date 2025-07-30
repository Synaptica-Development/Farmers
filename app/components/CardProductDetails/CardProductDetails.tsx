'use client';

import styles from './CardProductDetails.module.scss';
import Image from 'next/image';
import CartCounter from '../CartCounter/CartCounter';

interface CartProduct {
  cartItemID: string;
  count: number;
  product: {
    image1: string;
    productName: string;
    price: number;
  };
}

interface CardProductDetailsProps {
  cartProductsData: CartProduct[];
  onDelete: (id: string) => void;
  onCountChange: (cartItemID: string, newCount: number) => void;
}

const CardProductDetails = ({
  cartProductsData,
  onDelete,
  onCountChange,
}: CardProductDetailsProps) => {
  return (
    <div className={styles.cardItemsSection}>
      <div className={styles.cardItemsHeader}>
        <p>პროდუქტი</p>
        <p>წონის ერთეული</p>
        <p>ფასი</p>
        <p>რაოდენობა</p>
        <p>მთლიანობაში</p>
      </div>

      <div className={styles.cardItemsWrapper}>
        {cartProductsData.map((item) => (
          <div key={item.cartItemID} className={styles.card}>
            <div className={styles.productInfo}>
              <img
                className={styles.productImage}
                src={`https://185.49.165.101${item.product.image1}`}
                alt="product image"
              />
              <h2>{item.product.productName}</h2>
            </div>
            <p>კგ</p>
            <p>{item.product.price}₾</p>
            <CartCounter
              initialCount={item.count}
              cartItemID={item.cartItemID}
              onChange={(newCount) => onCountChange(item.cartItemID, newCount)}
            />

            <p>{item.count * item.product.price}₾</p>

            <div className={styles.deleteIconWrapper}>
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
