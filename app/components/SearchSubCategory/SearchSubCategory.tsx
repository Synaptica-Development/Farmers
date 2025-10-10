import Link from 'next/link';
import styles from './SearchSubCategory.module.scss';
import BASE_URL from '@/app/config/api';

interface Props {
  id: number;
  categoryID: number;
  name: string;
  imgLink: string;
}

const SearchSubCategory = ({ categoryID, name, id, imgLink }: Props) => {
  return (
    <Link href={`/subcategories/${categoryID}/subproducts/${id}`}>
      <div className={styles.item}>
        <img
          src={`${BASE_URL}${imgLink}`}
          alt={name}
          className={styles.image}
        />
        <p className={styles.name}>{name}</p>
      </div>
    </Link>
  );
};

export default SearchSubCategory;
