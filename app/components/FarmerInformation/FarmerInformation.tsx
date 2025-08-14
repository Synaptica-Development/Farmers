'use client';

import Image from 'next/image';
import styles from './FarmerInformation.module.scss';
import Link from 'next/link';

interface Props {
  farmName: string;
  location: string;
}

const FarmerInformation = ({ farmName, location}: Props) => {

    const  licensesCount = 6 ;

  return (
    <div className={styles.wrapper}>
      <div className={styles.texts}>
        <div className={styles.row}>
          <Image
            src="/farmerProfileIcon.svg"  
            alt="Farmer profile"
            width={24}
            height={24}
            className={styles.icon}
          />
          <Link href="#" className={styles.value}>{farmName}</Link>
        </div>

        <div className={styles.row}>
          <Image
            src="/farmerLocationIcon.svg"
            alt="Location"
            width={24}
            height={24}
            className={styles.icon}
          />
          <span className={styles.value}>{location}</span>
        </div>
      </div>

      <div className={styles.licenses}>
        {Array.from({ length: licensesCount }).map((_, i) => (
          <div key={i} className={styles.licenseDot} />
        ))}
      </div>
    </div>
  );
};

export default FarmerInformation;
