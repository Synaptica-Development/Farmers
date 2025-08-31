'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './AddCommentOnProductPopUp.module.scss';
import api from '@/lib/axios';
import BASE_URL from '@/app/config/api';
import ProductDetailsInfoDescriptions from '../ProductDetailsInfo/ProductDetailsInfoDescriptions/ProductDetailsInfoDescriptions';

interface Props {
  onClose: () => void;
}

interface ProductDetails {
  id: string;
  grammage: string;
  maxCount: number;
  minCount: number;
  price: number;
  productDescription: string;
  productName: string;
  image1: string;
}

interface FormValues {
  comment: string;
}

const AddQuestionOnProductPopUp = ({ onClose }: Props) => {
  const [product, setProduct] = useState<ProductDetails | null>(null);

  useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = 'auto';
  };
}, []);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const productId = '08dde703-abea-404f-8c95-b074ca03413e';

  useEffect(() => {
    api
      .get<ProductDetails>(`/product-details?productID=${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Product fetch error:', err))
  }, []);

  const onSubmit = (data: FormValues) => {
    console.log('Question submitted:', data);
    reset(); 
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {product ? (
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          <div className={styles.mainInfo}>
            {product.image1 && (
              <div className={styles.imageWrapper}>
                <img
                  src={`${BASE_URL}${product.image1}`}
                  alt={product.productName}
                  className={styles.productImage}
                />
              </div>
            )}

            <ProductDetailsInfoDescriptions
              id={product.id}
              grammage={product.grammage}
              maxCount={product.maxCount}
              minCount={product.minCount}
              price={product.price}
              productDescription={product.productDescription}
              productName={product.productName}
              addComment
            />
          </div>

          <form
            className={styles.addCommentForm}
            onSubmit={handleSubmit(onSubmit)}
          >
            <textarea
              placeholder="თქვენი შეფასება და კომენტარი..."
              className={styles.input}
              {...register('comment', { required: true })}
            />
            <button type="submit" className={styles.submitBtn}>
              გაგზავნა
            </button>
          </form>
        </div>
      ) : (
        <p>პროდუქტი ვერ მოიძებნა</p>
      )}
    </div>
  );
};

export default AddQuestionOnProductPopUp;
