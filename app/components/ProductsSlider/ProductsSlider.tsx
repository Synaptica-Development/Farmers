'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import styles from './ProductsSlider.module.scss';
import ProductCard from '../ProductCard/ProductCard';
import { useState } from 'react';

const ProductsSlider = () => {
  const [loaded, setLoaded] = useState(false);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 4,
      spacing: 32,
    },
    mode: 'snap',
    created() {
      setLoaded(true);
    },
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2>ხილი</h2>
        <span className={styles.seeAll}>ყველას ნახვა</span>
      </div>

      <div className={styles.sliderWrapper}>
        <div
          ref={sliderRef}
          className={`keen-slider ${styles.slider} ${loaded ? styles.loaded : ''}`}
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`keen-slider__slide ${styles.slide}`}>
              <ProductCard
                image="testproduct"
                productName="გორის ვაშლი"
                location="თბილისი"
                farmerName="გურამის ფერმა"
                isFavorite={false}
                price={120.5}
              />
            </div>
          ))}
        </div>

        {/* {loaded && (
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
