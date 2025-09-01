'use client';

import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import api from "@/lib/axios";
import styles from "./page.module.scss";
import BASE_URL from "@/app/config/api";

interface Product {
  id: string;
  productName: string;
  productDescription: string;
  price: number;
  image1: string;
  location: string;
  farmerName: string | null;
  isSaved: boolean;
}

interface ApiResponse {
  items: Product[];
  maxPageCount: number;
}

const ITEMS_PER_PAGE = 32;

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        setTotalPages(res.data.maxPageCount || 1);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [currentPage]);

  const handleRemoveFavorite = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className={styles.wrapper}>
      <h1>შენახული პროდუქტები</h1>
      <div className={styles.productsGrid}>
        {products.length > 0 ? (
          products.map((product) => (
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
            />
          ))
        ) : (
          <p>No favorites found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? styles.active : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
