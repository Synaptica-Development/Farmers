'use client';

import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import api from "@/lib/axios";
import styles from "./page.module.scss";
import BASE_URL from "@/app/config/api";
import Image from "next/image";

interface Product {
  id: string;
  productName: string;
  productDescription: string;
  price: number;
  image1: string;
  location: string;
  farmerName: string | null;
  isSaved: boolean;
  quantity: string;
  grammage: string;
}

interface ApiResponse {
  items: Product[];
  maxPageCount: number;
}

const ITEMS_PER_PAGE = 32;

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get<ApiResponse>("/saved-products", {
          params: {
            page: currentPage,
            PageSize: ITEMS_PER_PAGE,
          },
        });

        setProducts(res.data.items || []);
        setMaxPage(res.data.maxPageCount || 1);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [currentPage]);

  const handleRemoveFavorite = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handlePrev = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage(prev => (prev < maxPage ? prev + 1 : prev));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (currentPage > 1 + delta) {
      pages.push(1);
      if (currentPage > 2 + delta) {
        pages.push('...');
      }
    }

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(maxPage, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < maxPage - delta) {
      if (currentPage < maxPage - delta - 1) {
        pages.push('...');
      }
      pages.push(maxPage);
    }

    return pages;
  };

  return (
    <div className={styles.wrapper}>
      <h1>რჩეული პროდუქტები</h1>
      {products.length > 0 ? (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={`${BASE_URL}${product.image1}`}
              productName={product.productName}
              location={product.location}
              farmerName={product.farmerName ?? ""}
              isFavorite={product.isSaved}
              price={product.price}
              showFavorite={true}
              onDelete={() => handleRemoveFavorite(product.id)}
              quantity={product.quantity}
              grammage={product.grammage}
              cursorPointer={true}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noDataWrapper}>
          <p className={styles.noData}>რჩეული პროდუქტები ვერ მოიძებნა</p>
        </div>
      )}


      {maxPage > 1 && (
        <div className={styles.paginationWrapper}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            <Image
              src={currentPage === 1 ? '/arrowLeftDisabled.svg' : '/arrowLeftActive.svg'}
              alt="Previous"
              width={36}
              height={36}
            />
          </button>

          <div className={styles.pageNumbers}>
            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className={styles.ellipsis}>
                  {page}
                </span>
              )
            )}
          </div>

          <button onClick={handleNext} disabled={currentPage === maxPage}>
            <Image
              src={currentPage === maxPage ? '/arrowRightDisabled.svg' : '/arrowRightActive.svg'}
              alt="Next"
              width={36}
              height={36}
            />
          </button>
        </div>
      )}
    </div>
  );
}
