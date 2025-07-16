import { useEffect, useState } from "react";
import styles from "./SubProductsSection.module.scss";
import api from "@/lib/axios";
import ProductsSlider from "../ProductsSlider/ProductsSlider";

interface Category {
  id: number;
  name: string;
  category: string | null;
  categoryID: number;
  imgLink: string;
}

interface Props {
  categoryID: string;
}

const ITEMS_PER_PAGE = 4;

const SubProductsSection = ({ categoryID }: Props) => {
  const [subCategoriesIDs, setSubCategoriesIDs] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    api
      .get("/subcategories", {
        params: { categoryID },
      })
      .then((res) => {
        const categories: Category[] = res.data.categories;
        const ids: number[] = categories.map((item) => item.id);

        // Shuffle
        for (let i = ids.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [ids[i], ids[j]] = [ids[j], ids[i]];
        }

        setSubCategoriesIDs(ids);
        console.log(ids)
        setCurrentPage(1); 
      })
      .catch((err) => console.log("error: ", err));
  }, [categoryID]);

  const totalPages = Math.ceil(subCategoriesIDs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleIDs = subCategoriesIDs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className={styles.wrapper}>
      {visibleIDs.map((id) => (
        <ProductsSlider key={id} subCategoryId={id} categoryId={Number(categoryID)} />
      ))}

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
    </div>
  );
};

export default SubProductsSection;
