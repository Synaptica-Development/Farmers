import ProductDetailsInfoDescriptions from './ProductDetailsInfoDescriptions/ProductDetailsInfoDescriptions';
import ProductDetailsInfoImages from './ProductDetailsInfoImages/ProductDetailsInfoImages';
import styles from './ProductDetailsInfo.module.scss';

interface ProductDetails {
  id: string;
  grammage: string;
  maxCount: number;
  price: number;
  productDescription: string;
  productName: string;
  image1: string;
  image2: string;
}

const ProductDetailsInfo = ({ product }: { product: ProductDetails }) => {
  return (
    <div className={styles.infoWrapper}>
      <ProductDetailsInfoImages
        image1={product.image1}
        image2={product.image2}
      />
      <ProductDetailsInfoDescriptions
        id={product.id}
        grammage={product.grammage}
        maxCount={product.maxCount}
        price={product.price}
        productDescription={product.productDescription}
        productName={product.productName}
      />
    </div>
  );
};

export default ProductDetailsInfo;
