'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';
import Header from '@/app/components/Header/Header';
import CardProductDetails from '@/app/components/CardProductDetails/CardProductDetails';
import CheckoutSummary from '@/app/components/CheckoutSummary/CheckoutSummary';
import CartProductGrid from '@/app/components/CartProductGrid/CartProductGrid';
import { useCart } from '@/contexts/CartContext';

type Product = {
  image1: string;
  productName: string;
  price: number;
  grammage: string;
  minCount: number;
  maxCount: number;
};

type CartItem = {
  cartItemID: string;
  count: number;
  transportPrice: number;
  product: Product;
  productTotalPrice?: number;
  transportFeePercent?: number;
};

type CartResponse = {
  items: CartItem[];
  totalPrice: number;
  totalPriceWithFee: number;
  cartItemsCount: number;
  transportFee: number;
  otherFee: number;
  cartMinimumPrice: number | string;
};

const CartPage: React.FC = () => {
  const [cartProductsData, setCartProductsData] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCountFromApi } = useCart();

  const refetchCartData = async () => {
    try {
      const res = await api.get<CartResponse>('/api/Cart/my-cart');
      const data = res.data;
      setCartProductsData(data.items || []);
      setCartSummary(data);
      if (setCountFromApi) setCountFromApi(data.cartItemsCount);
      setError(null);
    } catch (err) {
      console.error('cart fetch error', err);
      setError('ვერ ჩაიტვირთა კალათი');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchCartData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete('/api/Cart/remove-product', { data: { productID: id } });
      if (res?.data?.cartItemsCount !== undefined && setCountFromApi) setCountFromApi(res.data.cartItemsCount);
      await refetchCartData();
    } catch (err) {
      console.error('delete error', err);
    }
  };

  const handleCountChange = async (cartItemID: string, newCount: number) => {
    try {
      await api.put('/api/Cart/change-product-count', null, {
        params: { productID: cartItemID, count: newCount },
      });
      await refetchCartData();
    } catch (err) {
      console.error('count change error', err);
    }
  };

  if (loading) return <p>ჩატვირთვა...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <Image className={styles.image} src="/cartBanner.png" alt="Profile" width={1440} height={120} />
        <h1 className={styles.title}>კალათა</h1>
        <div className={styles.content}>
          <div className={styles.cardProducts}>
            <CardProductDetails
              cartProductsData={cartProductsData}
              onDelete={handleDelete}
              onCountChange={handleCountChange}
              refetchTotalOfCart={refetchCartData}
            />
          </div>
          <div className={styles.cardGridProducts}>
            <CartProductGrid
              cartProductsData={cartProductsData}
              onDelete={handleDelete}
              onCountChange={handleCountChange}
              refetchTotalOfCart={refetchCartData}
            />
          </div>
          {cartSummary && (
            <CheckoutSummary
              totalPrice={cartSummary.totalPrice}
              totalPriceWithFee={cartSummary.totalPriceWithFee}
              transportFee={cartSummary.transportFee}
              otherFee={cartSummary.otherFee}
              cartMinimumPrice={cartSummary.cartMinimumPrice}
              refetchCartData={refetchCartData}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
