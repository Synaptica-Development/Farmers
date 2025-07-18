"use client"

import Header from "@/app/components/Header/Header";
import styles from "./page.module.scss"
import ProductCard from "@/app/components/ProductCard/ProductCard";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";


interface Product {
  farmName: string;
  image1: string;
  image2: string;
  location: string | null;
  price: number;
  productDescription: string;
  productName: string;
}

export default function Subproducts() {
  const pageSize = 32;
  const { categoryId, subCategoryID } = useParams();
  const [subProducts, setSubProducts] = useState<Product[]>([])

  useEffect(() => {
    api.get('/sub-products', {
      params: {
        categoryID: categoryId,
        subCategoryID: subCategoryID,
        page: 1,
        pageSize: pageSize,
      },
    })
      .then(res => setSubProducts(res.data.products))
      .catch(err => console.error('Categories fetch error:', err));
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.contantWrapper}>
        <div className={styles.sideBar}>
            sideBar
        </div>
        <div className={styles.content}>
          <div>
            navigation
          </div>
          <div className={styles.cardsWrapper}>
            {subProducts.map((product, index) => (
              <ProductCard
                key={index}
                image={`/testproduct.jpg`}
                productName={product.productName}
                location={product.location || "უცნობი"}
                farmerName={product.farmName}
                isFavorite={false}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
