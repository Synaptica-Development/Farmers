'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import styles from "./SubProductsContent.module.scss";
import Image from 'next/image';
import Link from "next/link";
import BASE_URL from "@/app/config/api";

interface Product {
  id: string;
  farmName: string;
  image1: string;
  image2: string;
  location: string | null;
  price: number;
  productDescription: string;
  productName: string;
  quantity: string;
  grammage: string;
  isSaved: boolean;
}

interface SubProductsContentProps {
  minPrice?: number | null;
  maxPrice?: number | null;
  regionIDs?: number[];
  cityIDs?: number[];
  selectedSubSubCategoryIds?: number[];
  toggleSidebar?: () => void;
}

function serializeParams(params: {
  [key: string]: string | number | Array<string | number> | null | undefined;
}): string {
  const parts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });

  return parts.join('&');
}

export default function SubProductsContent({
  minPrice = null,
  maxPrice = null,
  regionIDs = [],
  cityIDs = [],
  selectedSubSubCategoryIds = [],
  toggleSidebar,
}: SubProductsContentProps) {
  const paramsFromUrl = useParams();

  const categoryIdRaw = paramsFromUrl.categoryId;
  const subCategoryIDRaw = paramsFromUrl.subCategoryID;

  const categoryId = Array.isArray(categoryIdRaw) ? categoryIdRaw[0] : categoryIdRaw;
  const subCategoryID = Array.isArray(subCategoryIDRaw) ? subCategoryIDRaw[0] : subCategoryIDRaw;

  const [subProducts, setSubProducts] = useState<Product[]>([]);
  const [subProductTitle, setSubProductTitle] = useState('');
  const [productTitle, setProductTitle] = useState('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  useEffect(() => {
    if (!categoryId) return;

    const params: {
      categoryID: string;
      page: number;
      pageSize: number;
      subCategoryID?: string;
      subSubCategoryIDS?: number[];
      minPrice?: number;
      maxPrice?: number;
      regionIDS?: number[];
      cityIDS?: number[];
    } = {
      categoryID: categoryId,
      page: currentPage,
      pageSize: 32,
    };

    if (subCategoryID) params.subCategoryID = subCategoryID;
    if (selectedSubSubCategoryIds.length > 0) params.subSubCategoryIDS = selectedSubSubCategoryIds;
    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;
    if (regionIDs.length > 0) params.regionIDS = regionIDs;
    if (cityIDs.length > 0) params.cityIDS = cityIDs;

    const queryString = serializeParams(params);

    api
      .get(`/sub-products?${queryString}`)
      .then((res) => {
        setSubProducts(res.data.products || []);
        setSubProductTitle(res.data.categoryName);
        setMaxPage(res.data.maxPageCount || 1);
      })
      .catch((err) => console.error("Categories fetch error:", err))

    api
      .get(
        `/products?${serializeParams({
          categoryID: categoryId,
          page: 1,
          pageSize: 32,
        })}`
      )
      .then((res) => setProductTitle(res.data.categoryName))
      .catch((err) => console.error("Products fetch error:", err));
  }, [
    categoryId,
    subCategoryID,
    minPrice,
    maxPrice,
    regionIDs,
    cityIDs,
    selectedSubSubCategoryIds,
    currentPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice, regionIDs, cityIDs, selectedSubSubCategoryIds]);

  const handlePrev = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  const handleNext = () => setCurrentPage(prev => (prev < maxPage ? prev + 1 : prev));

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (currentPage > 1 + delta) {
      pages.push(1);
      if (currentPage > 2 + delta) pages.push("...");
    }

    for (let i = Math.max(1, currentPage - delta); i <= Math.min(maxPage, currentPage + delta); i++) {
      pages.push(i);
    }

    if (currentPage < maxPage - delta) {
      if (currentPage < maxPage - delta - 1) pages.push("...");
      pages.push(maxPage);
    }

    return pages;
  };

  return (
    <div className={styles.content}>
      <div className={styles.headerNavWrapper}>
        <div className={styles.headerNav}>
          <Link href="/" className={styles.homeLink}>
            <Image src="/productHomeIcon.svg" alt="home icon" width={24} height={24} />
          </Link>
          <Image src="/grayLeftArrow.svg" alt="arrow" width={8} height={20} />
          <Link href={`/subcategories/${categoryId}`} className={styles.link}>{productTitle}</Link>
          <Image src="/grayLeftArrow.svg" alt="arrow" width={8} height={20} />
          <p>{subProductTitle}</p>
        </div>
        <Image
          src="/filterIcon.svg"
          alt="filter"
          width={20}
          height={20}
          className={styles.filterIcon}
          onClick={() => toggleSidebar?.()}
        />
      </div>

      <div className={styles.cardsWrapper}>
        {subProducts.length > 0 && (
          subProducts.map((product, index) => (
            <ProductCard
              key={index}
              id={product.id}
              image={`${BASE_URL}${product.image1}`}
              productName={product.productName}
              location={product.location || "უცნობი"}
              farmerName={product.farmName}
              isFavorite={product.isSaved}
              price={product.price}
              quantity={product.quantity}
              grammage={product.grammage}
            />
          ))
        )}
      </div>
      {subProducts.length <= 0 && (
        <p className={styles.noData}>პროდუქტი ვერ მოიძებნა</p>
      )}

      {/* Pagination */}
      {maxPage > 1 && (
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
                  className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className={styles.ellipsis}>{page}</span>
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
}
