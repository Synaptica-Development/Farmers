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
      {/* -------- Desktop / large screens -------- */}
      <div className={styles.wrapperDesktop}>
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

      {/* -------- Mobile / under 768px -------- */}
      <div className={styles.wrapperMobile}>
        <div className={styles.bigRow}>
          {banners.slice(0, 2).map((banner) => (
            <Link
              key={banner.id}
              href={`/faq?id=${banner.sectionID}`}
              className={styles.banner}
              style={{ backgroundImage: `url(${BASE_URL}${banner.imgLink})` }}
            />
          ))}
        </div>

        <div className={styles.smallRow}>
          {banners.slice(2, 5).map((banner) => (
            <Link
              key={banner.id}
              href={`/faq?id=${banner.sectionID}`}
              className={styles.banner}
              style={{ backgroundImage: `url(${BASE_URL}${banner.imgLink})` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Advertisements;
