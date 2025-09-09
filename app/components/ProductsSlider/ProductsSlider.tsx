'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './ProductsSlider.module.scss';
import ProductCard from '../ProductCard/ProductCard';
import api from '@/lib/axios';
import BASE_URL from '@/app/config/api';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  categoryId: number;
  subCategoryId?: number;
  customName?: string;
}

interface Product {
  id: string;
  farmName: string;
  image1: string;
  image2: string;
  location: string | null;
  price: number;
  productDescription: string;
  productName: string;
  isSaved: boolean;
}

interface CategoryWithProducts {
  categoryName: string;
  products: Product[];
}

const ProductsSlider = ({ categoryId, subCategoryId, customName }: Props) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [hasScrollbar, setHasScrollbar] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        let res;
        if (subCategoryId) {
          res = await api.get('/sub-products', {
            params: {
              categoryID: categoryId,
              subCategoryID: subCategoryId,
              page: 1,
              pageSize: 20,
            },
          });
        } else {
          res = await api.get('/products', {
            params: {
              categoryID: categoryId,
              page: 1,
              pageSize: 20,
            },
          });
        }

        const data: CategoryWithProducts = res.data;
        setCategoryName(data.categoryName);
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();
  }, [categoryId, subCategoryId]);

  const checkScrollbar = () => {
    if (sliderRef.current) {
      setHasScrollbar(sliderRef.current.scrollWidth > sliderRef.current.clientWidth);
    }
  };

  useEffect(() => {
    checkScrollbar();
    window.addEventListener('resize', checkScrollbar);
    return () => window.removeEventListener('resize', checkScrollbar);
  }, [products]);

  const scrollByAmount = (amount: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handlePrev = () => scrollByAmount(-300);
  const handleNext = () => scrollByAmount(300);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>{customName || categoryName}</h2>
        <Link
          href={
            subCategoryId
              ? `/subcategories/${categoryId}/subproducts/${subCategoryId}`
              : `/subcategories/${categoryId}`
          }
          className={styles.seeAll}
        >
          ყველას ნახვა
        </Link>
      </div>

      <div className={styles.sliderWrapper}>
        {hasScrollbar && (
          <>
            <button className={`${styles.arrow} ${styles.left}`} onClick={handlePrev}>
              <Image src={'/arrowLeftGreenActive.svg'} alt="Prev" width={48} height={48} />
            </button>
            <button className={`${styles.arrow} ${styles.right}`} onClick={handleNext}>
              <Image src={'/arrowRightGreenActive.svg'} alt="Next" width={48} height={48} />
            </button>
          </>
        )}

        <div
          ref={sliderRef}
          className={`${styles.slider} ${isDragging ? styles.dragging : ''}`}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className={styles.slide}>
                <ProductCard
                  image={`${BASE_URL}${product.image1}`}
                  productName={product.productName}
                  location={product.location || 'უცნობი'}
                  farmerName={product.farmName}
                  isFavorite={product.isSaved}
                  price={product.price}
                  id={product.id}
                />
              </div>
            ))
          ) : (
            <div className={styles.loading}>
              {isLoading ? 'იტვირთება...' : 'პროდუქტი ვერ მოიძებნა'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSlider;
