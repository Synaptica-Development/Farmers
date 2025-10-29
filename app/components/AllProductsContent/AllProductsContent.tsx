'use client';

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import styles from "./AllProductsContent.module.scss";
import BASE_URL from "@/app/config/api";
import Image from "next/image";

interface Product {
  id?: string;
  farmName?: string;
  image1?: string;
  image2?: string;
  location?: string | null;
  price?: number;
  productDescription?: string;
  productName?: string;
  quantity?: string;
  grammage?: string;
  isSaved: boolean;
}

interface AllProductsContentProps {
  minPrice?: number | null;
  maxPrice?: number | null;
  regionIDs?: number[];
  cityIDs?: number[];
  selectedSubSubCategoryIds?: number[];
  categoryIDs?: number[];
  subCategoryIDs?: number[];
  toggleSidebar?: () => void;
}

function serializeParams(params: {
  [key: string]: string | number | Array<string | number> | null | undefined;
}): string {
  const parts: string[] = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach(v => {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });
  return parts.join('&');
}

const AllProductsContent = ({
  minPrice = null,
  maxPrice = null,
  regionIDs = [],
  cityIDs = [],
  selectedSubSubCategoryIds = [],
  categoryIDs = [],
  subCategoryIDs = [],
  toggleSidebar,
}: AllProductsContentProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  useEffect(() => {
    const params: {
      page: number;
      pageSize: number;
      subSubCategoryIDS?: number[];
      minPrice?: number;
      maxPrice?: number;
      regionIDS?: number[];
      cityIDS?: number[];
      categoryID?: number[];
      subCategoryID?: number[];
    } = {
      page: currentPage,
      pageSize: 32,
    };

    if (selectedSubSubCategoryIds.length > 0) params.subSubCategoryIDS = selectedSubSubCategoryIds;
    if (categoryIDs.length > 0) params.categoryID = categoryIDs;
    if (subCategoryIDs.length > 0) params.subCategoryID = subCategoryIDs;
    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;
    if (regionIDs.length > 0) params.regionIDS = regionIDs;
    if (cityIDs.length > 0) params.cityIDS = cityIDs;

    const queryString = serializeParams(params);

    api
      .get(`/sub-products?${queryString}`)
      .then(res => {
        setAllProducts(res.data.products || []);
        setMaxPage(res.data.maxPageCount || 1);
      })
      .catch(() => { })
  }, [
    minPrice,
    maxPrice,
    regionIDs,
    cityIDs,
    selectedSubSubCategoryIds,
    categoryIDs,
    subCategoryIDs,
    currentPage,
  ]);
  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice, regionIDs, cityIDs, selectedSubSubCategoryIds, categoryIDs, subCategoryIDs]);


  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < maxPage ? prev + 1 : prev));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (currentPage > 1 + delta) {
      pages.push(1);
      if (currentPage > 2 + delta) {
        pages.push("...");
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
        pages.push("...");
      }
      pages.push(maxPage);
    }

    return pages;
  };

  return (
    <div className={styles.content}>
      <div className={styles.headerNav}>
        <h2>ყველა პროდუქტი</h2>
        <Image
          src="/filterIcon.svg"
          alt="filter"
          width={24}
          height={24}
          onClick={() => toggleSidebar?.()}
          className={styles.filterIcon}
        />
      </div>

      <div className={styles.cardsWrapper}>
        {allProducts.length > 0 && (
          allProducts.map((product, index) => (
            <ProductCard
              key={index}
              id={product.id || ""}
              image={product.image1 ? `${BASE_URL}${product.image1}` : ""}
              productName={product.productName || ""}
              location={product.location || "უცნობი"}
              farmerName={product.farmName || ""}
              isFavorite={product.isSaved}
              price={product.price || 0}
              quantity={product.quantity || ""}
              grammage={product.grammage || ""}
              cursorPointer={true}
            />
          )))}
      </div>

      {allProducts.length <= 0 && (
        <p className={styles.noData}>პროდუქტი ვერ მოიძებნა</p>
      )}

      {allProducts.length > 0 && maxPage > 1 && (
        <div className={styles.paginationWrapper}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            <Image
              src={currentPage === 1 ? "/arrowLeftDisabled.svg" : "/arrowLeftActive.svg"}
              alt="Previous"
              width={36}
              height={36}
            />
          </button>

          <div className={styles.pageNumbers}>
            {getPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={index}
                  className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ""
                    }`}
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
              src={currentPage === maxPage ? "/arrowRightDisabled.svg" : "/arrowRightActive.svg"}
              alt="Next"
              width={36}
              height={36}
            />
          </button>
        </div>
      )}


    </div>
  );
};

export default AllProductsContent;
