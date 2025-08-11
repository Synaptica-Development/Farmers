'use client';

import { useEffect, useState } from "react";
import styles from "./SubProductsSection.module.scss";
import api from "@/lib/axios";
import SubProductsSlider from "../SubProductsSlider/SubProductsSlider";

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

interface SubProductGroup {
  categoryName: string;
  products: Product[];
}

interface CategoryIdsResponse {
  title: string;
  subCategories: {
    id: number;
    name: string;
  }[];
  maxPageCount: number;
}

interface SubProductsResponse {
  categoryName: string;
  products: Product[];
  maxPageCount: number;
}

interface Props {
  categoryID: string;
}

const ITEMS_PER_PAGE = 4;

const SubProductsSection = ({ categoryID }: Props) => {
  const [subProductGroups, setSubProductGroups] = useState<SubProductGroup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await api.get<CategoryIdsResponse>("/categoryids", {
          params: {
            categoryID,
            page: currentPage,
            pageSize: 4
          }
        });

        setTotalPages(categoryRes.data.maxPageCount || 1);

        const subCategories = categoryRes.data.subCategories;
        const productRequests = subCategories.map((subCat) =>
          api.get<SubProductsResponse>("/sub-products", {
            params: {
              categoryID,
              subCategoryID: subCat.id,
              page: 1,
              pageSize: 15
            }
          })
        );

        const productResponses = await Promise.all(productRequests);

        const groups: SubProductGroup[] = productResponses.map((res, idx) => ({
          categoryName: subCategories[idx].name,
          products: res.data.products || []
        }));

        setSubProductGroups(groups);
      } catch (err) {
        console.error("Error fetching sub products:", err);
      }
    };

    fetchData();
  }, [categoryID, currentPage]);

  return (
    <div className={styles.wrapper}>
      {subProductGroups
      .slice(0, ITEMS_PER_PAGE)
      .filter(group => group.products.length > 0)
      .map((group, idx) => (
        <div key={idx} className={styles.sliderBlock}>
          <div className={styles.header}>
            <h2 className={styles.subCategoryTitle}>{group.categoryName}</h2>
            <span className={styles.seeAll}>ყველას ნახვა</span>
          </div>
          <SubProductsSlider products={group.products} />
        </div>
      ))
    }

      {totalPages > 0 && (
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
