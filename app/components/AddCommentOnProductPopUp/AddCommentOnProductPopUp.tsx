'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './AddCommentOnProductPopUp.module.scss';
import api from '@/lib/axios';
import BASE_URL from '@/app/config/api';
import ProductDetailsInfoDescriptions from '../ProductDetailsInfo/ProductDetailsInfoDescriptions/ProductDetailsInfoDescriptions';
import { toast } from 'react-hot-toast';

interface Props {
  onClose: () => void;
  productID: string | null;
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

const AddQuestionOnProductPopUp = ({ onClose, productID }: Props) => {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!productID) return;
    setLoading(true);
    api
      .get<ProductDetails>(`/product-details?productID=${productID}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Product fetch error:', err))
      .finally(() => setLoading(false));
  }, [productID]);

  const onSubmit = (data: FormValues) => {
    if (!product) return;

    api
      .put(`/add-comment`, null, {
        params: {
          productID: product.id,
          Comment: data.comment,
        },
      })
      .then(() => {
        toast.success('კომენტარი წარმატებით დაემატა!');
        reset();
        onClose();
      })
      .catch((err) => {
        console.error('Error adding comment:', err);
        toast.error('კომენტარის დამატება ვერ მოხერხდა');
      });
  };

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.loading}>ჩატვირთვა...</div>
      </div>
    );
  }

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
              id={product.id || 'უცნობი-ID'}
              grammage={product.grammage || 'მონაცემები არ არის'}
              maxCount={product.maxCount ?? 0}
              minCount={product.minCount ?? 0}
              price={product.price ?? 0}
              productDescription={product.productDescription || 'აღწერა არ არის'}
              productName={product.productName || 'სახელი არ არის'}
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
              {...register('comment', {
                required: 'კომენტარი აუცილებელია',
                pattern: {
                  value: /^[\u10A0-\u10FF0-9.,!?ა-ჰ\s]+$/,
                  message: 'შეიყვანეთ მხოლოდ ქართული ასოები, ციფრები და . , ! ?'
                }
              })}
            />

            {errors.comment && <p className={styles.error}>{errors.comment.message}</p>}

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
