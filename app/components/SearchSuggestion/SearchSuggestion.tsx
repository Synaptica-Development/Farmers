'use client';

import { useEffect, useState } from 'react';
import styles from './SearchSuggestion.module.scss';
import api from '@/lib/axios';
import SearchSubCategory from '../SearchSubCategory/SearchSubCategory';
import TitleBlock from '../TitleBlock/TitleBlock';

interface Product {
  id: string;
  productName: string;
  image1: string;
  price: number;
  location: string;
}

interface SubCategory {
  id: number;
  categoryID: number;
  name: string;
  imgLink: string;
}

interface SearchResponse {
  products: Product[];
  subCategories: SubCategory[];
}

interface Props {
  query: string;
  onClose: () => void;
}

const SearchSuggestion = ({ query, onClose }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      try {
        const res = await api.get<SearchResponse>(
          `/search-products?name=${encodeURIComponent(query)}&page=1&pageSize=8`
        );
        setProducts(res.data.products || []);
        setSubCategories(res.data.subCategories || []);
      } catch (err) {
        console.error('Search fetch error:', err);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {(subCategories.length > 0) || (products.length > 0) ? (
          <>
            {subCategories.length > 0 && (
              <div className={styles.subCategories}>
                {subCategories.map((sub) => (
                  <SearchSubCategory
                    key={sub.id}
                    id={sub.id}
                    categoryID={sub.categoryID}
                    name={sub.name}
                    imgLink={sub.imgLink}
                  />
                ))}
              </div>
            )}

            {products.length > 0 && (
              <div className={styles.titleBlockWrapper}>
                <div className={styles.headerRow}>
                  <div />
                  <p>დასახელება</p>
                  <p className={styles.location}>მდებარეობა</p>
                  <p>ფასი</p>
                </div>

                {products.map((product) => (
                  <TitleBlock
                    key={product.id}
                    id={product.id}
                    productName={product.productName}
                    image1={product.image1}
                    price={product.price}
                    location={product.location}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className={styles.noData}>პროდუქცია ვერ მოიძებნა</p>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestion;
