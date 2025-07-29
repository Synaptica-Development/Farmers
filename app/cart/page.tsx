'use client';
import styles from './page.module.scss'
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Header from '../components/Header/Header';
import CardProductDetails from '../components/CardProductDetails/CardProductDetails';
import Image from 'next/image';

interface CartItem {
  cartItemID: string;
  count: number;
  product: Product;
}

interface Product {
  categoryID: number;
  cityID: number;
  count: number;
  farmName: string | null;
  id: string;
  image1: string;
  image2: string;
  location: string | null;
  price: number;
  productDescription: string;
  productName: string;
  regionID: number;
  subCategoryID: number;
  subSubCategoryID: number;
}

const CartPage = () => {
  const [cartProductsData, setCartProductsData] = useState<CartItem[]>([]);
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
        data: {
          productID: id,
        }
      })
      .then(() => {
        setCartProductsData(prev => prev.filter(item => item.cartItemID !== id));
      })
      .catch((err) => {
        console.error("წაშლის შეცდომა:", err);
      });
  };


  if (loading) return <p>იტვირთება...</p>;
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
              <CardProductDetails
                key={item.cartItemID}
                image={item.product.image1}
                name={item.product.productName}
                price={item.product.price}
                count={item.count}
                cartItedId={item.cartItemID}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
