'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import styles from './SubProductsSlider.module.scss';
import ProductCard from '../ProductCard/ProductCard';
import { useEffect, useState } from 'react';
import BASE_URL from '@/app/config/api';

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

interface Props {
  products: Product[];
}

const SubProductsSlider = ({ products }: Props) => {
  const [loaded, setLoaded] = useState(false);
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
    slider?.current?.update();
  }, [products]);

  return (
    <div className={styles.wrapper}>
      <div
        ref={sliderRef}
        className={`keen-slider ${styles.slider} ${loaded ? styles.loaded : ''}`}
      >
        {products.length > 0 ? (
          products.map((product, i) => (
            <div key={`${product.id}-${i}`} className={`keen-slider__slide ${styles.slide}`}>
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
  );
};

export default SubProductsSlider;
