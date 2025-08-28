import Link from 'next/link';
import BASE_URL from '@/app/config/api';
import styles from './TitleBlock.module.scss';

interface Props {
  id: string;
  productName: string;
  image1: string;
  price: number;
  location: string;
}

const TitleBlock = ({ id, productName, image1, price, location }: Props) => {
  return (
    <Link href={`/product/${id}`}>
      <div className={styles.item} key={id}>
        <img
          src={`${BASE_URL}${image1}`}
          alt={productName ?? 'No Product Name'}
        />
        <h3>{productName ?? 'სახელი ვერ მოიძებნა'}</h3>
        <p>{location ?? 'ლოკაცია ვერ მოიძებნა'}</p>
        <p>{price !== null && price !== undefined ? `${price}₾` : 'ფასი ვერ მოიძებნა'}</p>
      </div>
    </Link>
  );
};

export default TitleBlock;
