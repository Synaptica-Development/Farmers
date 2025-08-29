'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import ReusableButton from '../../ReusableButton/ReusableButton';
import styles from './ProductDetailsInfoDescriptions.module.scss';
import { toast } from 'react-hot-toast';
import ProductDetailCount from '../../ProductDetailCount/ProductDetailCount';

interface ProductDetailsInfoDescriptionsProps {
  grammage: string;
  id: string;
  maxCount: number;
  minCount: number;
  price: number;
  productDescription: string;
  productName: string;
}

const ProductDetailsInfoDescriptions = ({
  grammage,
  id,
  maxCount,
  minCount,
  price,
  productDescription,
  productName,
}: ProductDetailsInfoDescriptionsProps) => {
  const [count, setCount] = useState<number>(minCount);

  const handleAddToCart = () => {
    api
      .put('/api/Cart/add-product', {
        productID: id,
        quantity: count, // send the updated count
      })
      .then((response) => {
        toast.success('პროდუქტი წარმატებით დაემატა კალათაში!');
        console.log('Product added to cart:', response.data);
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error, id);
        alert('დაფიქსირდა შეცდომა კალათაში დამატებისას!');
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h2>{productName}</h2>
        <div className={styles.textsWrapper}>
          <div className={styles.textsWrapperItem}>
            <p>ფასი : {price}₾ {grammage}</p>
            <p>მარაგი : {maxCount} {grammage}</p>
            <p>მინ. ყიდვის რაოდენობა : {minCount} {grammage}</p>
          </div>
          <p>{productDescription}</p>
        </div>
      </div>

      <div className={styles.actions}>
        <ProductDetailCount
          initialCount={minCount}
          maxCount={maxCount}
          minCount={minCount}
          onChange={(newCount) => setCount(newCount)}
        />

        <ReusableButton
          title="კალათაში დამატება"
          size="large"
          onClick={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default ProductDetailsInfoDescriptions;
