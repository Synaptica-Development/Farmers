'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import styles from './ProductsSlider.module.scss';
import ProductCard from '../ProductCard/ProductCard';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Props {
  categoryId: number;
  subCategoryId?: number;
}

interface Product {
  farmName: string;
  image1: string;
  image2: string;
  location: string | null;
  price: number;
  productDescription: string;
  productName: string;
}

interface CategoryWithProducts {
  categoryName: string;
  products: Product[];
}

const ProductsSlider = ({ categoryId, subCategoryId }: Props) => {
  const pageSize = 32;
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState<CategoryWithProducts | null>(null);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 5.3,
    },
    mode: 'snap',
    created() {
      setLoaded(true);
    },
  });


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (subCategoryId) {
          const res = await api.get('/sub-products', {
            params: {
              categoryID: categoryId,
              subCategoryID: subCategoryId,
              page: 1,
              pageSize: pageSize,
            },
          });
          setProducts(res.data);
        } else {
          const res = await api.get('/products', {
            params: {
              categoryID: categoryId,
              page: 1,
              pageSize: pageSize,
            },
          });
          setProducts(res.data);
        }
      } catch (err) {
        console.log("error:", err);
      }
    };

    fetchProducts();
  }, [categoryId, subCategoryId]);



  useEffect(() => {
    if (slider) {
      slider.current?.update();
    }
  }, [products]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>{products?.categoryName || '...'}</h2>
        <span className={styles.seeAll}>ყველას ნახვა</span>
      </div>
      
      <div className={styles.sliderWrapper}>
        <div
          ref={sliderRef}
          className={`keen-slider ${styles.slider} ${loaded ? styles.loaded : ''}`}
        >
          {products?.products.map((product, i) => (
            <div key={i} className={`keen-slider__slide ${styles.slide}`}>
              <ProductCard
                image={`/testproduct.jpg`}
                productName={product.productName}
                location={product.location || 'უცნობი'}
                farmerName={product.farmName}
                isFavorite={false}
                price={product.price}
              />
            </div>
          ))}
        </div>

        {/* Uncomment this if slider navigation is needed
        {loaded && (
          <>
            <button
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={() => slider.current?.prev()}
            />
            <button
              className={`${styles.arrow} ${styles.arrowRight}`}
              onClick={() => slider.current?.next()}
            />
          </>
        )} */}
      </div>
    </div>
  );
};

export default ProductsSlider;
