'use client';

import { useEffect, useState } from 'react';
import styles from './CardProductDetails.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';

interface CartProduct {
  cartItemID: string;
  count: number;
  product: {
    image1: string;
    productName: string;
    price: number;
  };
}

const CardProductDetails = () => {
  const [cartProductsData, setCartProductsData] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/api/Cart/my-cart')
      .then((res) => {
        setCartProductsData(res.data.items);
        console.log(res.data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('კალათის ჩატვირთვის შეცდომა:', err);
        setError('ვერ ჩაიტვირთა კალათის მონაცემები.');
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    api
      .delete(`/api/Cart/remove-product`, {
        data: { productID: id },
      })
      .then(() => {
        setCartProductsData((prev) => prev.filter((item) => item.cartItemID !== id));
      })
      .catch((err) => {
        console.error('წაშლის შეცდომა:', err);
      });
  };

  // Increment/Decrement count locally
  const handleIncrement = (id: string) => {
    setCartProductsData((prev) =>
      prev.map((item) =>
        item.cartItemID === id
          ? { ...item, count: item.count + 1 }
          : item
      )
    );
  };

  const handleDecrement = (id: string) => {
    setCartProductsData((prev) =>
      prev.map((item) =>
        item.cartItemID === id && item.count > 1
          ? { ...item, count: item.count - 1 }
          : item
      )
    );
  };

  if (loading) return <p>ჩატვირთვა...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.cardItemsSection}>
      {/* Header */}
      <div className={styles.cardItemsHeader}>
        <p>პროდუქტი</p>
        <p>წონის ერთეული</p>
        <p>ფასი</p>
        <p>რაოდენობა</p>
        <p>მთლიანობაში</p>
      </div>

      {/* Products */}
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

            {/* Counter */}
            <div className={styles.counterWrapper}>
              <div className={styles.counter}>
                <Image
                  src="/cartMinus.svg"
                  alt="minus icon"
                  width={34}
                  height={34}
                  onClick={() => handleDecrement(item.cartItemID)}
                />
                <p>{item.count}</p>
                <Image
                  src="/cartPluse.svg"
                  alt="plus icon"
                  width={34}
                  height={34}
                  onClick={() => handleIncrement(item.cartItemID)}
                />
              </div>
            </div>

            <p>{item.count * item.product.price}₾</p>

            {/* Delete */}
            <div className={styles.deleteIconWrapper}>
              <Image
                src="/cardDeleteIcon.svg"
                alt="delete icon"
                width={24}
                height={24}
                onClick={() => handleDelete(item.cartItemID)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardProductDetails;
