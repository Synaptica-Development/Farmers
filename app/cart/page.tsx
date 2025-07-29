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

        <CardProductDetails />
      </div>
    </>
  );
};

export default CartPage;
