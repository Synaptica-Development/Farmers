'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import ReusableButton from '../../ReusableButton/ReusableButton';
import styles from './ProductDetailsInfoDescriptions.module.scss';
import { toast } from 'react-hot-toast';
import ProductDetailCount from '../../ProductDetailCount/ProductDetailCount';
import { useCart } from '@/contexts/CartContext';

interface ProductDetailsInfoDescriptionsProps {
  grammage: string;
  id: string;
  maxCount: number;
  minCount: number;
  price: number;
  productDescription: string;
  productName: string;
  addComment?: boolean;
}

const ProductDetailsInfoDescriptions = ({
  grammage,
  id,
  maxCount,
  minCount,
  price,
  productDescription,
  productName,
  addComment = false,
}: ProductDetailsInfoDescriptionsProps) => {
  const [count, setCount] = useState<number>(minCount);
  const { setCountFromApi } = useCart();

  const handleAddToCart = () => {
    api
      .post('/api/Cart/add-product', {
        productID: id,
        quantity: count,
      })
      .then((res) => {
        toast.success('პროდუქტი წარმატებით დაემატა კალათაში!');
        setCountFromApi(res.data.cartItemsCount);
        console.log('Product added to cart:', res.data);
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error, id);
        toast.error('დაფიქსირდა შეცდომა კალათაში დამატებისას!');
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h2>{productName}</h2>
        <div className={styles.textsWrapper}>
          <div className={styles.textsWrapperItem}>
            <p>ფასი: {price}₾</p>
            <p>მარაგი: {maxCount} {grammage}</p>
            <p>მინ. ოდენობა: {minCount} {grammage}</p>
          </div>
          <p>{productDescription}</p>
        </div>
      </div>

      {addComment || (

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

      )}

    </div>
  );
};

export default ProductDetailsInfoDescriptions;
