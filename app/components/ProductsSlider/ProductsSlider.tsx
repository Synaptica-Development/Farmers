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
  const draggingRef = useRef(false);
  const justDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const startTargetRef = useRef<EventTarget | null>(null);

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
    const el = sliderRef.current;
    if (!el) return;
    setHasScrollbar(el.scrollWidth > el.clientWidth + 1);
  };

  useEffect(() => {
    checkScrollbar();
    const el = sliderRef.current;
    const imgs = el ? Array.from(el.querySelectorAll('img')) : [];
    const onImgLoad = () => setTimeout(checkScrollbar, 50);
    imgs.forEach((img) => img.addEventListener('load', onImgLoad));
    const onResize = () => checkScrollbar();
    window.addEventListener('resize', onResize);
    return () => {
      imgs.forEach((img) => img.removeEventListener('load', onImgLoad));
      window.removeEventListener('resize', onResize);
    };
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
      target.closest('a, button, input, textarea, select, [data-no-drag], [role="button"], [tabindex]')
    );
  };

  const onDocumentPointerMove = (e: PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const el = sliderRef.current;
    if (!el) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const dx = currentX - startXRef.current;
    const dy = currentY - startYRef.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (!draggingRef.current) {
      if (absDx < DRAG_THRESHOLD || absDx <= absDy) {
        return;
      }
      draggingRef.current = true;
      el.classList.add(styles.dragging);
      try { window.getSelection()?.removeAllRanges(); } catch {}
      e.preventDefault();
    } else {
      e.preventDefault();
    }

    if (draggingRef.current) {
      el.scrollLeft = startScrollLeftRef.current - dx;
    }
  };

  const onDocumentPointerUp = () => {
    const el = sliderRef.current;
    if (el && draggingRef.current) {
      el.classList.remove(styles.dragging);
    }

    if (draggingRef.current) {
      justDraggedRef.current = true;
      window.setTimeout(() => (justDraggedRef.current = false), 150);
    }

    isPointerDownRef.current = false;
    draggingRef.current = false;
    startTargetRef.current = null;

    try {
      window.removeEventListener('pointermove', onDocumentPointerMove);
      window.removeEventListener('pointerup', onDocumentPointerUp);
      window.removeEventListener('pointercancel', onDocumentPointerUp);
    } catch {}
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = sliderRef.current;
    if (!el) return;

    const target = e.target as HTMLElement | null;

    if (isInteractiveTarget(target)) {
      startTargetRef.current = target;
      return;
    }

    isPointerDownRef.current = true;
    draggingRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startScrollLeftRef.current = el.scrollLeft;
    startTargetRef.current = e.target;

    window.addEventListener('pointermove', onDocumentPointerMove, { passive: false });
    window.addEventListener('pointerup', onDocumentPointerUp);
    window.addEventListener('pointercancel', onDocumentPointerUp);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window).PointerEvent) return;

    let touchId: number | null = null;

    const root = sliderRef.current;
    if (!root) return;

    const touchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (isInteractiveTarget(target)) return;
      const t = e.touches[0];
      touchId = t.identifier;
      isPointerDownRef.current = true;
      draggingRef.current = false;
      startXRef.current = t.clientX;
      startYRef.current = t.clientY;
      startScrollLeftRef.current = root.scrollLeft;
    };

    const touchMove = (e: TouchEvent) => {
      if (!isPointerDownRef.current) return;
      const t = Array.from(e.touches).find((x) => x.identifier === touchId) as Touch | undefined;
      if (!t) return;
      const dx = t.clientX - startXRef.current;
      const dy = t.clientY - startYRef.current;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (!draggingRef.current) {
        if (absDx < DRAG_THRESHOLD || absDx <= absDy) return;
        draggingRef.current = true;
        root.classList.add(styles.dragging);
        try { window.getSelection()?.removeAllRanges(); } catch {}
        e.preventDefault();
      } else {
        e.preventDefault();
      }

      if (draggingRef.current) {
        root.scrollLeft = startScrollLeftRef.current - dx;
      }
    };

    const touchEnd = () => {
      if (root && draggingRef.current) root.classList.remove(styles.dragging);
      if (draggingRef.current) {
        justDraggedRef.current = true;
        window.setTimeout(() => (justDraggedRef.current = false), 150);
      }
      isPointerDownRef.current = false;
      draggingRef.current = false;
      touchId = null;
    };

    root.addEventListener('touchstart', touchStart, { passive: true });
    root.addEventListener('touchmove', touchMove, { passive: false });
    root.addEventListener('touchend', touchEnd);
    root.addEventListener('touchcancel', touchEnd);

    return () => {
      root.removeEventListener('touchstart', touchStart);
      root.removeEventListener('touchmove', touchMove);
      root.removeEventListener('touchend', touchEnd);
      root.removeEventListener('touchcancel', touchEnd);
    };
  }, []);

  useEffect(() => {
    return () => {
      try {
        window.removeEventListener('pointermove', onDocumentPointerMove);
        window.removeEventListener('pointerup', onDocumentPointerUp);
        window.removeEventListener('pointercancel', onDocumentPointerUp);
      } catch {}
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
          role="list"
          aria-label={customName || categoryName || 'products slider'}
          onClickCapture={(e) => {
            if (justDraggedRef.current) {
              e.stopPropagation();
              e.preventDefault();
              justDraggedRef.current = false;
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
