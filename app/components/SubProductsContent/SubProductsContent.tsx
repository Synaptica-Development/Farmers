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
  maxCount: string;
  grammage: string;
}

interface SubProductsContentProps {
  minPrice?: number | null;
  maxPrice?: number | null;
  regionIDs?: number[];
  cityIDs?: number[];
  selectedSubSubCategoryIds?: number[];
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
}: SubProductsContentProps) {
  const paramsFromUrl = useParams();

  const categoryIdRaw = paramsFromUrl.categoryId;
  const subCategoryIDRaw = paramsFromUrl.subCategoryID;

  const categoryId = Array.isArray(categoryIdRaw) ? categoryIdRaw[0] : categoryIdRaw;
  const subCategoryID = Array.isArray(subCategoryIDRaw) ? subCategoryIDRaw[0] : subCategoryIDRaw;

  const [subProducts, setSubProducts] = useState<Product[]>([]);
  const [subProductTitle, setSubProductTitle] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    setLoading(true);

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
      page: 1,
      pageSize: 32,
    };

    if (subCategoryID) {
      params.subCategoryID = subCategoryID;
    }

    if (selectedSubSubCategoryIds.length > 0) {
      params.subSubCategoryIDS = selectedSubSubCategoryIds;
    }

    if (minPrice !== null) {
      params.minPrice = minPrice;
    }
    if (maxPrice !== null) {
      params.maxPrice = maxPrice;
    }
    if (regionIDs.length > 0) {
      params.regionIDS = regionIDs;
    }
    if (cityIDs.length > 0) {
      params.cityIDS = cityIDs;
    }

    const queryString = serializeParams(params);

    api
      .get(`/sub-products?${queryString}`)
      .then((res) => {
        console.log(res.data.products)
        setSubProducts(res.data.products || []);
        setSubProductTitle(res.data.categoryName);
      })
      .catch((err) => console.error("Categories fetch error:", err))
      .finally(() => setLoading(false));

    api
      .get(
        `/products?${serializeParams({
          categoryID: categoryId,
          page: 1,
          pageSize: 1,
        })}`
      )
      .then((res) => {
        setProductTitle(res.data.categoryName);
      })
      .catch((err) => console.error("Products fetch error:", err));
  }, [
    categoryId,
    subCategoryID,
    minPrice,
    maxPrice,
    regionIDs,
    cityIDs,
    selectedSubSubCategoryIds,
  ]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.content}>
      <div className={styles.headerNav}>
        <div className={styles.headerNav}>
          <Link href="/" className={styles.homeLink}>
            <Image src="/productHomeIcon.svg" alt="home icon" width={24} height={24} />
          </Link>
          <Image src="/grayLeftArrow.svg" alt="arrow" width={8} height={20} />

          <Link href="/" className={styles.link}>
            კატეგორიები
          </Link>

          <Image src="/grayLeftArrow.svg" alt="arrow" width={8} height={20} />

          <Link href={`/subcategories/${categoryId}`} className={styles.link}>
            {productTitle}
          </Link>

          <Image src="/grayLeftArrow.svg" alt="arrow" width={8} height={20} />

          <p>{subProductTitle}</p>
        </div>
      </div>

      <div className={styles.cardsWrapper}>
        {subProducts.length > 0 ? (
          subProducts.map((product, index) => (
            <ProductCard
              key={index}
              id={product.id}
              image={`${BASE_URL}${product.image1}`}
              productName={product.productName}
              location={product.location || "უცნობი"}
              farmerName={product.farmName}
              isFavorite={false}
              price={product.price}
              maxCount={product.maxCount}
              grammage={product.grammage}
            />
          ))
        ) : (
          <p>პროდუქტი ვერ მოიძებნა</p>
        )}
      </div>
    </div>
  );
}
