import styles from './CategoriesItem.module.scss';
import Link from 'next/link';

interface CategoriesItemProps {
  title: string;
  image: string;
  alt: string;
  href: string;
}

const CategoriesItem = ({ title, image, alt, href }: CategoriesItemProps) => {
  
  return (
    <div  className={styles.wrapper}>
      <Link href={href} className={styles.content}>
        <img src={`${image}`} alt={alt}/>
        <p className={styles.title}>{title}</p>
      </Link>
    </div>
  );
};

export default CategoriesItem;
