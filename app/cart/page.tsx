'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import Header from '../components/Header/Header';
import CardProductDetails from '../components/CardProductDetails/CardProductDetails';
import Image from 'next/image';
import api from '@/lib/axios';
import CheckoutSummary from '../components/CheckoutSummary/CheckoutSummary';

interface CartProduct {
  cartItemID: string;
  count: number;
  product: {
    image1: string;
    productName: string;
    price: number;
  };
}

const CartPage = () => {
  const [cartProductsData, setCartProductsData] = useState<CartProduct[]>([]);
  const [totalOfCart, setTotalOfCart] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/api/Cart/my-cart')
      .then((res) => {
        setCartProductsData(res.data.items);
        console.log(res.data.items);
        setTotalOfCart(res.data.totalPrice)
        setLoading(false);
      })
      .catch((err) => {
        console.error('კალათის ჩატვირთვის შეცდომა:', err);
        setError('ვერ ჩაიტვირთა კალათის მონაცემები.');
        setLoading(false);
      });
  }, []);

  const refetchTotalOfCart = () => {
    api
      .get('/api/Cart/my-cart')
      .then((res) => {
        setTotalOfCart(res.data.totalPrice)
      })
      .catch((err) => {
        console.error('ჯამის ჩატვირთვა:', err);
      });
  };

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

  const handleCountChange = (cartItemID: string, newCount: number) => {
    setCartProductsData((prev) =>
      prev.map((p) =>
        p.cartItemID === cartItemID ? { ...p, count: newCount } : p
      )
    );
  };

  if (loading) return <p>ჩატვირთვა...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <Image
          src="/cartBanner.png"
          alt="Profile"
          width={1440}
          height={120}
        />
        <h1 className={styles.title}>კალათა</h1>

        <div className={styles.content}>
          <div className={styles.cardProducts}>
            <CardProductDetails
              cartProductsData={cartProductsData}
              onDelete={handleDelete}
              onCountChange={handleCountChange}
              refetchTotalOfCart={refetchTotalOfCart}
            />
          </div>

          <CheckoutSummary totalOfCart={totalOfCart}/>
        </div>
      </div>
    </>
  );
};

export default CartPage;
