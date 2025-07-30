'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import Header from '../components/Header/Header';
import CardProductDetails from '../components/CardProductDetails/CardProductDetails';
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
            />
          </div>

          <div className={styles.paymentDetales}>
            <div style={{ backgroundColor: 'red' }}>
              <h2>ლოკაცლია აქ იქნება</h2>
              <h2>თბილისი, ვაგზალი</h2>
              <h2>ოკრიბა, ეეე იქანა გეიხედე</h2>
              <h2>კირპიჩკა, გიგანტიჩის წყარო</h2>
            </div>

            <div style={{ backgroundColor: 'green' }}>
              მთლიანი თანხის ჯამის ჩვენება აქ {totalOfCart}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default CartPage;
