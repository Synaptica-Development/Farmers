'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';
import Header from '@/app/components/Header/Header';
import CardProductDetails from '@/app/components/CardProductDetails/CardProductDetails';
import CheckoutSummary from '@/app/components/CheckoutSummary/CheckoutSummary';
import { useCart } from '@/contexts/CartContext';
import CartProductGrid from '@/app/components/CartProductGrid/CartProductGrid';

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

interface CartSummary {
  totalPrice: number;
  totalPriceWithFee: number;
  transportFee: number;
  otherFee: number;
  cartMinimumPrice: string;
}

const CartPage = () => {
  const [cartProductsData, setCartProductsData] = useState<CartProduct[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCountFromApi } = useCart();

  useEffect(() => {
    refetchCartData();
  }, []);

  const refetchCartData = () => {
    api
      .get('/api/Cart/my-cart')
      .then((res) => {
        console.log('cart data:', res.data);
        setCountFromApi(res.data.cartItemsCount)
        setCartProductsData(res.data.items);
        setCartSummary({
          totalPrice: res.data.totalPrice,
          totalPriceWithFee: res.data.totalPriceWithFee,
          transportFee: res.data.transportFee,
          otherFee: res.data.otherFee,
          cartMinimumPrice: res.data.cartMinimumPrice,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('კალათის ჩატვირთვის შეცდომა:', err);
        setError('ვერ ჩაიტვირთა კალათის მონაცემები.');
        setLoading(false);
      });
  };

  const refetchTotalOfCart = () => {
    api
      .get('/api/Cart/my-cart')
      .then((res) => {
        setCartSummary((prev) =>
          prev
            ? {
              ...prev,
              totalPrice: res.data.totalPrice,
              totalPriceWithFee: res.data.totalPriceWithFee,
              cartItemsCount: res.data.cartItemsCount,
              transportFee: res.data.transportFee,
              otherFee: res.data.otherFee,
              cartMinimumPrice: res.data.cartMinimumPrice,
            }
            : {
              totalPrice: res.data.totalPrice,
              totalPriceWithFee: res.data.totalPriceWithFee,
              cartItemsCount: res.data.cartItemsCount,
              transportFee: res.data.transportFee,
              otherFee: res.data.otherFee,
              cartMinimumPrice: res.data.cartMinimumPrice,
            }
        );
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
      .then((res) => {
        setCartProductsData((prev) =>
          prev.filter((item) => item.cartItemID !== id)
        );
        setCountFromApi(res.data.cartItemsCount);
        refetchCartData();
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
        <Image className={styles.image} src="/cartBanner.png" alt="Profile" width={1440} height={120} />
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
          <div className={styles.cardGridProducts}>
            <CartProductGrid
              cartProductsData={cartProductsData}
              onDelete={handleDelete}
              onCountChange={handleCountChange}
              refetchTotalOfCart={refetchTotalOfCart}
            />
          </div>


          {cartSummary && (
            <CheckoutSummary
              totalPrice={cartSummary.totalPrice}
              totalPriceWithFee={cartSummary.totalPriceWithFee}
              transportFee={cartSummary.transportFee}
              otherFee={cartSummary.otherFee}
              cartMinimumPrice={cartSummary.cartMinimumPrice}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
