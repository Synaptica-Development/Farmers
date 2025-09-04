'use client';

import api from '@/lib/axios';
import styles from './FarmerSideBar.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/types/roles';
import Cookies from 'js-cookie';

interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  profileImgLink: string | null;
  email: string | null;
  role: number;
}

export const navItems = [
  {
    label: 'ჩემი საწარმო',
    icon: '/myShop.svg',
    activeIcon: '/activemyShop.svg',
    href: '/farmer/myfarm',
    roles: [UserRole.Farmer, UserRole.User],
  },
  {
    label: 'პროდუქტის დამატება',
    icon: '/addProduct.svg',
    activeIcon: '/activeaddProduct.svg',
    href: '/farmer/addproduct',
    roles: [UserRole.Farmer],
  },
  {
    label: 'შეკვეთები',
    icon: '/orders.svg',
    activeIcon: '/activeorders.svg',
    href: '/farmer/orders',
    roles: [UserRole.Farmer],
  },
  {
    label: 'რჩეული პროდუქტები',
    icon: '/facoriteWhiteHeart.svg',
    activeIcon: '/activeFacoriteWhiteHeart.svg',
    href: '/farmer/favorites',
    roles: [UserRole.Farmer, UserRole.User],
  },
  {
    label: 'სტატისტიკა',
    icon: '/statistic.svg',
    activeIcon: '/activestatistic.svg',
    href: '/statistics',
    roles: [UserRole.Farmer],
  },
  {
    label: 'ლიცენზია',
    icon: '/license.svg',
    activeIcon: '/activelicense.svg',
    href: '/farmer/licenses',
    matchPaths: ['/farmer/licenses/addlicense', '/farmer/licenses'],
    roles: [UserRole.Farmer],
  },
  {
    label: 'შეტყობინებები',
    icon: '/notification.svg',
    activeIcon: '/activenotification.svg',
    href: '/farmer/notifications',
    roles: [UserRole.Farmer, UserRole.User],
  },
  {
    label: 'ნაყიდი პროდუქტები',
    icon: '/boughtProduct.svg',
    activeIcon: '/activeboughtProduct.svg',
    href: '/farmer/mypurchases',
    roles: [UserRole.Farmer, UserRole.User],
  },
  {
    label: 'პროფილის რედაქტირება',
    icon: '/sidebarProfile.svg',
    activeIcon: '/activesidebarProfile.svg',
    href: '/farmer/profileinformation',
    roles: [UserRole.Farmer, UserRole.User],
  },
  {
    label: 'გამოსვლა',
    icon: '/logOut.svg',
    activeIcon: '/activelogOut.svg',
    href: '/logout',
    roles: [UserRole.Farmer, UserRole.User],
  },
];

const FarmerSideBar = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    api.get<UserProfile>('/user/profile/me')
      .then((response) => {
        setUser(response.data);
        if (response.data.role === 0) {
          setRole(UserRole.User);
        } else if (response.data.role === 1) {
          setRole(UserRole.Farmer);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch user profile:', error);
      });
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    router.push('/signin');
  };

  let filteredNavItems = navItems.filter(
    (item) => role !== null && item.roles.includes(role)
  );

  if (role === UserRole.User) {
    const boughtProducts = filteredNavItems.find(i => i.href === '/farmer/mypurchases');
    const myFarm = filteredNavItems.find(i => i.href === '/farmer/myfarm');
    const logoutItem = filteredNavItems.find(i => i.href === '/logout');

    if (myFarm) {
      myFarm.label = 'გახდი მეწარმე';
    }

    filteredNavItems = filteredNavItems.filter(i =>
      i.href !== '/farmer/mypurchases' && i.href !== '/farmer/myfarm' && i.href !== '/logout'
    );

    filteredNavItems = [
      ...(boughtProducts ? [boughtProducts] : []),
      ...filteredNavItems,
      ...(myFarm ? [myFarm] : []),
      ...(logoutItem ? [logoutItem] : [])
    ];
  }


  return (
    <div className={styles.sidebar}>
      <div className={styles.profile}>
        <span>{user?.name} {user?.lastName}</span>
      </div>

      <nav className={styles.nav}>
        {filteredNavItems?.map((item) => {
          const isActive = item.matchPaths
            ? item.matchPaths.some(path => pathname.startsWith(path))
            : pathname === item.href || pathname.startsWith(item.href + '/');

          if (item.href === '/logout') {
            return (
              <button
                key={item.label}
                onClick={handleLogout}
                className={`${styles.navItem} ${styles.notActive}`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={styles.icon}
                />
                <span className={styles.label}>{item.label}</span>
              </button>
            );
          }

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
