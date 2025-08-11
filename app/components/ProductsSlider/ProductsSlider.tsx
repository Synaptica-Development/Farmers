'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import styles from './ProductsSlider.module.scss';
import ProductCard from '../ProductCard/ProductCard';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import BASE_URL from '@/app/config/api';

interface Props {
  categoryId: number;
}

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

interface CategoryWithProducts {
  categoryName: string;
  products: Product[];
}

const ProductsSlider = ({ categoryId }: Props) => {
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
        const res = await api.get('/products', {
          params: {
            categoryID: categoryId,
            page: 1,
            pageSize: pageSize,
          },
        });
        setProducts(res.data);
      } catch (err) {
        console.log('error:', err);
      }
    };

    fetchProducts();
  }, [categoryId]);

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
          {Array.isArray(products?.products) && products.products.length > 0 ? (
            products.products.map((product, i) => (
              <div key={i} className={`keen-slider__slide ${styles.slide}`}>
                <ProductCard
                  image={`${BASE_URL}${product.image1}`}
                  productName={product.productName}
                  location={product.location || 'უცნობი'}
                  farmerName={product.farmName}
                  isFavorite={false}
                  price={product.price}
                  id={product.id}
                />
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsSlider;
