import BASE_URL from '@/app/config/api';
import styles from './Advertisements.module.scss';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  imgLink: string;
  sectionID: number;
}

interface Props {
  banners: Banner[];
}

const Advertisements = ({ banners }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        {banners[0] && (
          <Link
            href={`/faq?id=${banners[0].sectionID}`}
            className={styles.banner}
            style={{ backgroundImage: `url(${BASE_URL}${banners[0].imgLink})` }}
          />
        )}
      </div>

      <div className={styles.right}>
        {banners.slice(1, 5).map((banner) => (
          <Link
            key={banner.id}
            href={`/faq?id=${banner.sectionID}`}
            className={styles.banner}
            style={{ backgroundImage: `url(${BASE_URL}${banner.imgLink})` }}
          />
        ))}
      </div>
    </div>
  );
};

export default Advertisements;
