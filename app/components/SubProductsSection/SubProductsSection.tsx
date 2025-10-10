'use client';

import { useEffect, useState } from "react";
import styles from "./SubProductsSection.module.scss";
import api from "@/lib/axios";
import ProductsSlider from "../ProductsSlider/ProductsSlider"; 

interface SubCategory {
  id: number;
  name: string;
}

interface CategoryIdsResponse {
  title: string;
  subCategories: SubCategory[];
  maxPageCount: number;
}

interface Props {
  categoryID: string;
}

const ITEMS_PER_PAGE = 4;

const SubProductsSection = ({ categoryID }: Props) => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await api.get<CategoryIdsResponse>("/categoryids", {
          params: {
            categoryID,
            page: currentPage,
            pageSize: ITEMS_PER_PAGE,
          },
        });

        setTotalPages(categoryRes.data.maxPageCount || 1);
        setSubCategories(categoryRes.data.subCategories || []);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };

    fetchData();
  }, [categoryID, currentPage]);

  return (
    <div className={styles.wrapper}>
      {subCategories.map((subCat) => (
        <div key={subCat.id} className={styles.sliderBlock}>
          <ProductsSlider categoryId={parseInt(categoryID)} subCategoryId={subCat.id} />
        </div>
      ))}

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
};

export default SubProductsSection;
