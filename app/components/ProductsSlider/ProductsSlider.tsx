'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './ProductsSlider.module.scss';
import ProductCard from '../ProductCard/ProductCard';
import api from '@/lib/axios';
import BASE_URL from '@/app/config/api';
import Link from 'next/link';

interface Props {
  categoryId: number;
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
}

interface CategoryWithProducts {
  categoryName: string;
  products: Product[];
  maxPageCount: number;
}

const ProductsSlider = ({ categoryId }: Props) => {
  const PAGE_SIZE = 8;
  const MAX_PAGES_IN_MEMORY = 3;
  
  const [categoryName, setCategoryName] = useState<string>('');
  const [maxPageCount, setMaxPageCount] = useState<number>(1);
  const [currentPages, setCurrentPages] = useState<number[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedPagesRef = useRef<Map<number, Product[]>>(new Map());

  // Fetch a specific page
  const fetchPage = useCallback(async (pageNumber: number): Promise<Product[] | null> => {
    // Check if page is already loaded
    if (loadedPagesRef.current.has(pageNumber)) {
      return loadedPagesRef.current.get(pageNumber) || null;
    }

    // Don't check maxPageCount here as it might not be set yet on initial load
    if (pageNumber < 1) {
      return null;
    }

    try {
      const res = await api.get('/products', {
        params: {
          categoryID: categoryId,
          page: pageNumber,
          pageSize: PAGE_SIZE,
        },
      });

      const data: CategoryWithProducts = res.data;
      
      // Update category name and max page count
      if (data.categoryName) {
        setCategoryName(data.categoryName);
      }
      if (data.maxPageCount !== undefined) {
        setMaxPageCount(data.maxPageCount);
      }

      // Cache the page
      loadedPagesRef.current.set(pageNumber, data.products);

      return data.products;
    } catch (err) {
      console.error(`Error fetching page ${pageNumber}:`, err);
      return null;
    }
  }, [categoryId]);

  // Manage pages in memory (sliding window)
  const managePages = useCallback(async (direction: 'left' | 'right' | 'initial') => {
    setIsLoading(true);
    
    const currentFirstPage = currentPages[0] || 1;
    const currentLastPage = currentPages[currentPages.length - 1] || 1;

    let newPages: number[] = [...currentPages];
    let productsToDisplay: Product[] = [];

    try {
      if (direction === 'initial') {
        // Initial load: Load first page
        const page1Products = await fetchPage(1);
        if (page1Products) {
          newPages = [1];
          productsToDisplay = page1Products;
          
          // After initial load, check if we should preload page 2
          setTimeout(() => {
            if (maxPageCount > 1) {
              fetchPage(2);
            }
          }, 100);
        }
      } else if (direction === 'right') {
        // Scrolling right: Load next page
        const nextPage = currentLastPage + 1;
        
        // First fetch to get maxPageCount if needed
        const nextPageProducts = await fetchPage(nextPage);
        
        if (nextPageProducts && nextPageProducts.length > 0) {
          newPages.push(nextPage);
          
          // Remove first page if we exceed the limit
          if (newPages.length > MAX_PAGES_IN_MEMORY) {
            const removedPage = newPages.shift();
            if (removedPage) {
              // Remove from cache to free memory
              loadedPagesRef.current.delete(removedPage);
            }
          }
          
          // Rebuild products array from cached pages
          for (const pageNum of newPages) {
            const pageProducts = loadedPagesRef.current.get(pageNum) || [];
            productsToDisplay.push(...pageProducts);
          }
          
          // Preload next page if it exists
          setTimeout(() => {
            if (nextPage + 1 <= maxPageCount) {
              fetchPage(nextPage + 1);
            }
          }, 100);
        }
      } else if (direction === 'left') {
        // Scrolling left: Load previous page
        const prevPage = currentFirstPage - 1;
        
        if (prevPage >= 1) {
          const prevPageProducts = await fetchPage(prevPage);
          
          if (prevPageProducts && prevPageProducts.length > 0) {
            newPages.unshift(prevPage);
            
            // Remove last page if we exceed the limit
            if (newPages.length > MAX_PAGES_IN_MEMORY) {
              const removedPage = newPages.pop();
              if (removedPage) {
                // Remove from cache to free memory
                loadedPagesRef.current.delete(removedPage);
              }
            }
            
            // Rebuild products array from cached pages
            for (const pageNum of newPages) {
              const pageProducts = loadedPagesRef.current.get(pageNum) || [];
              productsToDisplay.push(...pageProducts);
            }
            
            // Preload previous page if it exists
            setTimeout(() => {
              if (prevPage - 1 >= 1) {
                fetchPage(prevPage - 1);
              }
            }, 100);
          }
        }
      }

      // Update state only if pages changed
      if (JSON.stringify(newPages) !== JSON.stringify(currentPages)) {
        setCurrentPages(newPages);
        
        // Update displayed products if not already set
        if (productsToDisplay.length === 0) {
          for (const pageNum of newPages) {
            const pageProducts = loadedPagesRef.current.get(pageNum) || [];
            productsToDisplay.push(...pageProducts);
          }
        }
        
        setAllProducts(productsToDisplay);
      }
    } catch (error) {
      console.error('Error managing pages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPages, fetchPage, maxPageCount]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const scrollPercentage = (slider.scrollLeft / (slider.scrollWidth - slider.clientWidth)) * 100;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set a new timeout to detect when scrolling stops
    scrollTimeoutRef.current = setTimeout(async () => {
      // Check if we need to load more pages
      if (scrollPercentage > 80 && !isLoading) {
        // Near the right edge
        await managePages('right');
      } else if (scrollPercentage < 20 && currentPages[0] > 1 && !isLoading) {
        // Near the left edge and not at the first page
        const currentScrollWidth = slider.scrollWidth;
        await managePages('left');
        
        // Adjust scroll position to maintain visual continuity
        setTimeout(() => {
          if (sliderRef.current) {
            const newScrollWidth = sliderRef.current.scrollWidth;
            const scrollDiff = newScrollWidth - currentScrollWidth;
            sliderRef.current.scrollLeft += scrollDiff;
          }
        }, 100);
      }
    }, 200);
  }, [currentPages, managePages, isLoading]);

  // Mouse drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch support for mobile
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

  // Initialize on mount
  useEffect(() => {
    managePages('initial');
  }, [categoryId]);

  // Add scroll listener
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener('scroll', handleScroll);
    return () => {
      slider.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>{categoryName || 'Loading...'}</h2>
        <Link href={`/subcategories/${categoryId}`} className={styles.seeAll}>ყველას ნახვა</Link>
      </div>

      <div className={styles.sliderWrapper}>
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
          {allProducts.length > 0 ? (
            allProducts.map((product, index) => (
              <div key={`${product.id}-${index}`} className={styles.slide}>
                <ProductCard
                  image={`${BASE_URL}${product.image1}`}
                  productName={product.productName}
                  location={product.location || 'უცნობი'}
                  farmerName={product.farmName}
                  isFavorite={false}
                  price={product.price}
                  id={product.id}
                />
              </div>
            ))
          ) : (
            <div className={styles.loading}>
              {isLoading ? 'Loading products...' : 'No products found.'}
            </div>
          )}
        </div>
        
        {/* Loading indicator */}
        {isLoading && allProducts.length > 0 && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsSlider;
