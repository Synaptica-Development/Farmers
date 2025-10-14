'use client';

import Image from 'next/image';
import styles from './FarmerInformation.module.scss';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import BASE_URL from '@/app/config/api';
import Link from 'next/link';

interface Props {
  farmerID: string;
}

interface FarmerDetails {
  name: string;
  lastName: string;
  farmName: string;
  location: string;
  licenseIcons: string[];
}

const FarmerInformation = ({ farmerID }: Props) => {
  const [farmer, setFarmer] = useState<FarmerDetails | null>(null);

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const farmerRes = await api.get(`/api/Farmer/farmer-details?UID=${farmerID}`);
        setFarmer(farmerRes.data);
      } catch (err) {
        console.error('Error fetching farmer info', err);
      }
    };

    fetchFarmer();
  }, []);

  if (!farmer) return <div>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.contentWrapper}>
        <div className={styles.texts}>
          <Link className={styles.farmerName} href={`/farmerProfile/${farmerID}`}>{farmer.farmName}</Link>
          <Link href={`/farmerProfile/${farmerID}`} className={styles.row}>
            <Image
              src="/farmerProfileIcon.svg"
              alt="Farmer profile"
              width={22}
              height={22}
              className={styles.icon}
            />
            <span className={styles.value}>{farmer.name} {farmer.lastName}</span>
          </Link>


          <div className={styles.row}>
            <Image
              src="/farmerLocationIcon.svg"
              alt="Location"
              width={22}
              height={22}
              className={styles.icon}
            />
            <span className={styles.value}>{farmer.location}</span>
          </div>

        </div>

        <div className={styles.licenses}>
          <h4 className={styles.licensesTitle}>ლიცენზიები</h4>
          <div className={styles.licensesIcons}>
            {farmer.licenseIcons.map((icon, idx) => (
              <img
                key={idx}
                src={`${BASE_URL}${icon}`}
                alt="License"
                className={styles.licenseIcon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerInformation;
