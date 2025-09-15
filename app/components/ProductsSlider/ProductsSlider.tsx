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

const DRAG_THRESHOLD = 8;

const ProductsSlider = ({ categoryId, subCategoryId, customName }: Props) => {
  const [categoryName, setCategoryName] = React.useState<string>('');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasScrollbar, setHasScrollbar] = React.useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const isPointerDownRef = useRef(false); 
  const isDraggingRef = useRef(false);
  const dragStartedRef = useRef(false);
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

    const target = e.target as HTMLElement | null;
    if (
      target &&
      target.closest &&
      target.closest('[data-no-drag], button, a, input, textarea, select')
    ) {
      isPointerDownRef.current = false;
      return;
    }

    isPointerDownRef.current = true;
    dragStartedRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = el.scrollLeft;
    latestClientXRef.current = e.clientX;

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });

    pointerIdRef.current = e.pointerId ?? null;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const dx = Math.abs(e.clientX - startXRef.current);
    if (!dragStartedRef.current && dx < DRAG_THRESHOLD) {
      return;
    }

    if (!dragStartedRef.current) {
      dragStartedRef.current = true;
      isDraggingRef.current = true;
      const el = sliderRef.current;
      if (el) {
        try {
          el.classList.add(styles.dragging);
          if (pointerIdRef.current !== null && el.setPointerCapture) {
            try {
              el.setPointerCapture(pointerIdRef.current);
            } catch {
            }
          }
        } catch {
        }
      }
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(updateScroll);
    }

    e.preventDefault(); 
    latestClientXRef.current = e.clientX;
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(updateScroll);
  };

  const handlePointerUp = () => {
    const el = sliderRef.current;
    if (!el) {
      isPointerDownRef.current = false;
      dragStartedRef.current = false;
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      return;
    }

    if (dragStartedRef.current) {
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
    }

    isPointerDownRef.current = false;
    dragStartedRef.current = false;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const el = sliderRef.current;
    if (!el) return;
    const target = e.target as HTMLElement | null;
    if (
      target &&
      target.closest &&
      target.closest('[data-no-drag], button, a, input, textarea, select')
    ) {
    }

    const t = e.touches[0];
    isPointerDownRef.current = true;
    dragStartedRef.current = false;
    startXRef.current = t.clientX;
    startScrollLeftRef.current = el.scrollLeft;
    latestClientXRef.current = t.clientX;

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPointerDownRef.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - startXRef.current);

    if (!dragStartedRef.current && dx < DRAG_THRESHOLD) return;

    if (!dragStartedRef.current) {
      dragStartedRef.current = true;
      isDraggingRef.current = true;
      const el = sliderRef.current;
      if (el) el.classList.add(styles.dragging);
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(updateScroll);
    }

    e.preventDefault();
    latestClientXRef.current = t.clientX;
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(updateScroll);
  };

  const handleTouchEnd = () => {
    const el = sliderRef.current;
    if (!el) return;

    if (dragStartedRef.current) {
      isDraggingRef.current = false;
      el.classList.remove(styles.dragging);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    isPointerDownRef.current = false;
    dragStartedRef.current = false;
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('touchcancel', handleTouchEnd);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
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
          ყველა ნახვა
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
          onTouchStart={handleTouchStart}
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
