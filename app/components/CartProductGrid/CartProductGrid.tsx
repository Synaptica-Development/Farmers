'use client';

import styles from './CartProductGrid.module.scss';
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
    minCount: number;
    maxCount: number;
  };
}

interface CartProductGridProps {
  cartProductsData: CartProduct[];
  onDelete: (id: string) => void;
  onCountChange: (cartItemID: string, newCount: number) => void;
  refetchTotalOfCart: () => void;
}

const CartProductGrid = ({
  cartProductsData,
  onDelete,
  onCountChange,
  refetchTotalOfCart,
}: CartProductGridProps) => {
  return (
    <div className={styles.gridWrapper}>
      {cartProductsData?.map((item) => {
        const total = item.count * item.product.price + item.transportPrice;
        const formatted =
          Math.round(total * 100) / 100 % 1 === 0
            ? Math.round(total * 100) / 100
            : (Math.round(total * 100) / 100).toFixed(2);

        return (
          <div key={item.cartItemID} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={`${BASE_URL}${item.product.image1}`}
                alt={item.product.productName}
                className={styles.productImage}
              />
            </div>

            <div className={styles.infoWrapper}>
              <div className={styles.headerRow}>
                <h3>{item.product.productName}</h3>
                <button
                  className={styles.deleteBtn}
                  onClick={() => onDelete(item.cartItemID)}
                >
                  <Image
                    src="/cardDeleteIcon.svg"
                    alt="delete"
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              <p className={styles.price}>ფასი: {item.product.price}₾</p>
              <p className={styles.price}>მომსახ.საფ: {item.transportPrice}₾</p>


              <div className={styles.counterWrapper}>
                <CartCounter
                  initialCount={item.count}
                  maxCount={item.product.maxCount}
                  minCount={item.product.minCount}
                  cartItemID={item.cartItemID}
                  onChange={(newCount) => onCountChange(item.cartItemID, newCount)}
                  refetchTotalOfCart={refetchTotalOfCart}
                />
                <p className={styles.total}>სულ: {formatted}₾</p>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartProductGrid;
