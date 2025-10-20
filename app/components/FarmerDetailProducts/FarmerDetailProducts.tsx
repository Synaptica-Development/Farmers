"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import styles from "./FarmerDetailProducts.module.scss";
import ProductCard from "../ProductCard/ProductCard";
import BASE_URL from "@/app/config/api";

interface Props {
  userId: string;
}

interface Product {
  id: string;
  image1: string;
  productName: string;
  location?: string;
  farmName: string;
  price: number;
  quantity: string;
  grammage: string;
  isSaved: boolean;
}


const FarmerDetailProducts = ({ userId }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!userId) return;

    api
      .get(`/api/Farmer/products?UID=${userId}&page=1&pagesize=32`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching farmer products:", err);
      });
  }, [userId]);

  return (
    <div className={styles.wholeWrapper}>
      <h2>მწარმოებელის პროდუქტები</h2>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={`${BASE_URL}${product.image1}`}
            productName={product.productName}
            location={product.location || "უცნობი"}
            farmerName={product.farmName}
            isFavorite={product.isSaved}
            price={product.price}
            id={product.id}
            quantity={product.quantity}
            grammage={product.grammage}
          />
        ))}
      </div>
    </div>
  );
};

export default FarmerDetailProducts;
