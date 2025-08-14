'use client';

import Header from '@/app/components/Header/Header';
import ProductDetailsInfo from '@/app/components/ProductDetailsInfo/ProductDetailsInfo';
import ProductDetailsNavigation from '@/app/components/ProductDetailsNavigation/ProductDetailsNavigation';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface ProductDetails {
  categoryID: number;
  cityID: number;
  farmName: string;
  grammage: string;
  id: string;
  image1: string;
  image2: string;
  location: string;
  maxCount: number;
  minCount: number;
  price: number;
  productDescription: string;
  productName: string;
  regionID: number;
  subCategoryID: number;
  subSubCategoryID: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState<ProductDetails | null>(null);

  useEffect(() => {
    api.get(`/product-details?productID=${productId}`)
      .then((res) => {
        console.log('productDetail', res.data);
        setProduct(res.data);
      });
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <ProductDetailsInfo product={product} />
        <ProductDetailsNavigation product={product} />
      </div>
    </>
  );
}
