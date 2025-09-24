'use client';

import React, { useEffect, useRef, useState } from 'react';
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

const ProductsSlider: React.FC<Props> = ({ categoryId, subCategoryId, customName }) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasScrollbar, setHasScrollbar] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isPointerDownRef = useRef(false);
  const dragStartedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const pointerTypeRef = useRef<string | null>(null);
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
      setHasScrollbar(sliderRef.current.scrollWidth > sliderRef.current.clientWidth + 1);
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

  const handlePrev = () => scrollByAmount(-Math.round((sliderRef.current?.clientWidth ?? 300) * 0.7));
  const handleNext = () => scrollByAmount(Math.round((sliderRef.current?.clientWidth ?? 300) * 0.7));

  const isInteractiveTarget = (target: HTMLElement | null) => {
    if (!target) return false;
    return Boolean(
      target.closest(
        'a, button, input, textarea, select, [data-no-drag], [role="button"], [tabindex]'
      )
    );
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const el = sliderRef.current;
    if (!el) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const dx = currentX - startXRef.current;
    const dy = currentY - startYRef.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (!dragStartedRef.current) {
      if (absDx < DRAG_THRESHOLD || absDx <= absDy) {
        return;
      }
      dragStartedRef.current = true;
      isDraggingRef.current = true;
      el.classList.add(styles.dragging);
      try { window.getSelection()?.removeAllRanges(); } catch {}
      e.preventDefault();
    } else {
      e.preventDefault();
    }

    if (dragStartedRef.current) {
      el.scrollLeft = startScrollLeftRef.current - dx;
    }
  };

  const handlePointerUp = () => {
    const el = sliderRef.current;
    if (el && dragStartedRef.current) {
      el.classList.remove(styles.dragging);
    }
    if (pointerIdRef.current !== null && sliderRef.current?.releasePointerCapture) {
      try { sliderRef.current.releasePointerCapture(pointerIdRef.current); } catch {}
    }
    isPointerDownRef.current = false;
    dragStartedRef.current = false;
    isDraggingRef.current = false;
    pointerTypeRef.current = null;
    pointerIdRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = sliderRef.current;
    if (!el) return;
    const target = e.target as HTMLElement | null;

    if (isInteractiveTarget(target)) {
      return;
    }

    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startScrollLeftRef.current = el.scrollLeft;
    pointerTypeRef.current = e.pointerType ?? null;
    pointerIdRef.current = e.pointerId ?? null;

    try { el.setPointerCapture?.(e.pointerId); } catch {}

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPointerDownRef.current) return;
    const el = sliderRef.current;
    if (!el) return;
    const t = e.touches[0];
    const dx = t.clientX - startXRef.current;
    const dy = t.clientY - startYRef.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (!dragStartedRef.current) {
      if (absDx < DRAG_THRESHOLD || absDx <= absDy) return;
      dragStartedRef.current = true;
      isDraggingRef.current = true;
      el.classList.add(styles.dragging);
      try { window.getSelection()?.removeAllRanges(); } catch {}
      e.preventDefault();
    } else {
      e.preventDefault();
    }
    if (dragStartedRef.current) {
      el.scrollLeft = startScrollLeftRef.current - dx;
    }
  };

  const handleTouchEnd = () => {
    const el = sliderRef.current;
    if (el) el.classList.remove(styles.dragging);
    isPointerDownRef.current = false;
    dragStartedRef.current = false;
    isDraggingRef.current = false;
    pointerTypeRef.current = null;
    pointerIdRef.current = null;
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('touchcancel', handleTouchEnd);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const el = sliderRef.current;
    if (!el) return;
    const target = e.target as HTMLElement | null;
    if (isInteractiveTarget(target)) {
      return;
    }
    const t = e.touches[0];
    isPointerDownRef.current = true;
    startXRef.current = t.clientX;
    startYRef.current = t.clientY;
    startScrollLeftRef.current = el.scrollLeft;
    pointerTypeRef.current = 'touch';
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
  };

  useEffect(() => {
    return () => {
      handlePointerUp();
      handleTouchEnd();
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
          <div className={styles.arrowsWrapper}>
            <button className={`${styles.arrow} ${styles.left}`} onClick={handlePrev} aria-label="Prev">
              <Image src={'/arrowLeftGreenActive.svg'} alt="Prev" width={48} height={48} />
            </button>
            <button className={`${styles.arrow} ${styles.right}`} onClick={handleNext} aria-label="Next">
              <Image src={'/arrowRightGreenActive.svg'} alt="Next" width={48} height={48} />
            </button>
          </div>
        )}
        <div
          ref={sliderRef}
          className={styles.slider}
          onPointerDown={onPointerDown}
          onTouchStart={handleTouchStart}
          role="list"
          aria-label={customName || categoryName || 'products slider'}
          onClickCapture={(e) => {
            if (isDraggingRef.current) {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className={styles.slide} role="listitem">
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
