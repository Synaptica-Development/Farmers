'use client';

import api from '@/lib/axios';
import styles from './FarmerSideBar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  userName: string;
  phoneNumber: string;
  profileImgLink: string | null;
  email: string | null;
  role: number;
}

const navItems = [
  {
    label: 'ჩემი ფერმა',
    icon: '/myShop.svg',
    activeIcon: '/activemyShop.svg',
    href: '/farmer/myfarm',
  },
  {
    label: 'პროდუქტის დამატება',
    icon: '/addProduct.svg',
    activeIcon: '/activeaddProduct.svg',
    href: '/farmer/addproduct',
  },
  {
    label: 'შეკვეთები',
    icon: '/orders.svg',
    activeIcon: '/activeorders.svg',
    href: '/farmer/orders',
  },
  {
    label: 'სტატისტიკა',
    icon: '/statistic.svg',
    activeIcon: '/activestatistic.svg',
    href: '/statistics',
  },
  {
    label: 'ლიცენზია',
    icon: '/license.svg',
    activeIcon: '/activelicense.svg',
    href: '/farmer/licenses',
    matchPaths: ['/farmer/licenses/addlicense'],
  },
  {
    label: 'შეტყობინებები',
    icon: '/notification.svg',
    activeIcon: '/activenotification.svg',
    href: '/farmer/notifications',
  },
  {
    label: 'ნაყიდი პროდუქტები',
    icon: '/boughtProduct.svg',
    activeIcon: '/activeboughtProduct.svg',
    href: '/farmer/mypurchases',
  },
  {
    label: 'პროფილის რედაქტირება',
    icon: '/sidebarProfile.svg',
    activeIcon: '/activesidebarProfile.svg',
    href: '/farmer/profileinformation',

  },
  {
    label: 'გამოსვლა',
    icon: '/logOut.svg',
    activeIcon: '/activelogOut.svg',
    href: '/logout',
  },
];

const FarmerSideBar = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
    api.get<UserProfile>('/user/profile/me')
      .then((response) => {
        setUser(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Failed to fetch user profile:', error);
      });
  }, []);


  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles.profile}>
        <Image
          src="/testProfile.png"
          alt="Profile"
          width={65}
          height={65}
          className={styles.avatar}
        />
        <span>{user?.userName}</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = item.matchPaths
            ? item.matchPaths.includes(pathname)
            : pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : styles.notActive}`}
            >
              <Image
                src={isActive ? item.activeIcon : item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={styles.icon}
              />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default FarmerSideBar;
