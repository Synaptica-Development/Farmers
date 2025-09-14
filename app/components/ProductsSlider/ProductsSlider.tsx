'use client';

import React, { useRef, useEffect } from 'react';
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
  maxCount: string;
  grammage: string;
}

interface CategoryWithProducts {
  categoryName: string;
  products: Product[];
}

const ProductsSlider = ({ categoryId, subCategoryId, customName }: Props) => {
  const [categoryName, setCategoryName] = React.useState<string>('');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasScrollbar, setHasScrollbar] = React.useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const latestClientXRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);

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

  const updateScroll = () => {
    const el = sliderRef.current;
    if (!el) {
      rafRef.current = null;
      return;
    }
    const delta = latestClientXRef.current - startXRef.current;
    el.scrollLeft = startScrollLeftRef.current - delta;
    rafRef.current = null;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = sliderRef.current;
    if (!el) return;

    startXRef.current = e.clientX - el.getBoundingClientRect().left;
    startScrollLeftRef.current = el.scrollLeft;
    latestClientXRef.current = e.clientX;
    isDraggingRef.current = true;
    pointerIdRef.current = e.pointerId;

    el.classList.add(styles.dragging);

    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
    }

    if (rafRef.current === null) rafRef.current = requestAnimationFrame(updateScroll);

    window.addEventListener('pointermove', onPointerMove as any, { passive: false });
    window.addEventListener('pointerup', onPointerUp as any, { passive: true });
    window.addEventListener('pointercancel', onPointerUp as any, { passive: true });
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    latestClientXRef.current = e.clientX;
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(updateScroll);
  };

  const onPointerUp = (e?: PointerEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    isDraggingRef.current = false;
    el.classList.remove(styles.dragging);

    if (pointerIdRef.current !== null) {
      try {
        el.releasePointerCapture?.(pointerIdRef.current);
      } catch {
      }
      pointerIdRef.current = null;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    window.removeEventListener('pointermove', onPointerMove as any);
    window.removeEventListener('pointerup', onPointerUp as any);
    window.removeEventListener('pointercancel', onPointerUp as any);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    const t = e.touches[0];
    startXRef.current = t.clientX - el.getBoundingClientRect().left;
    startScrollLeftRef.current = el.scrollLeft;
    latestClientXRef.current = t.clientX;
    isDraggingRef.current = true;
    el.classList.add(styles.dragging);

    if (rafRef.current === null) rafRef.current = requestAnimationFrame(updateScroll);

    window.addEventListener('touchmove', onTouchMove as any, { passive: false });
    window.addEventListener('touchend', onTouchEnd as any, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd as any, { passive: true });
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    latestClientXRef.current = e.touches[0].clientX;
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(updateScroll);
  };

  const onTouchEnd = () => {
    const el = sliderRef.current;
    if (!el) return;
    isDraggingRef.current = false;
    el.classList.remove(styles.dragging);

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    window.removeEventListener('touchmove', onTouchMove as any);
    window.removeEventListener('touchend', onTouchEnd as any);
    window.removeEventListener('touchcancel', onTouchEnd as any);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onPointerMove as any);
      window.removeEventListener('pointerup', onPointerUp as any);
      window.removeEventListener('pointercancel', onPointerUp as any);
      window.removeEventListener('touchmove', onTouchMove as any);
      window.removeEventListener('touchend', onTouchEnd as any);
      window.removeEventListener('touchcancel', onTouchEnd as any);
    };
  }, []);

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
          className={styles.slider}
          onPointerDown={onPointerDown}
          onTouchStart={onTouchStart}
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
                  maxCount={product.maxCount}
                  grammage={product.grammage}
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
