'use client';
import Image from 'next/image';
import styles from './Header.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import SecondaryHeader from '../SecondaryHeader/SecondaryHeader';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import FarmerSideBar from '../FarmerSideBar/FarmerSideBar';
import { usePathname } from 'next/navigation';
import api from '@/lib/axios';
import Cookies from "js-cookie";

interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  profileImgLink: string | null;
  email: string | null;
  role: number;
}

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { count } = useCart();
  const pathname = usePathname();
  const { setCountFromApi } = useCart();


  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await api.get<UserProfile>('/user/profile/me');
        setUser(res.data);
      } catch {
        setUser(null);
        Cookies.remove("token");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    api
      .get('/api/Cart/my-cart')
      .then((res) => {
        setCountFromApi(res.data.cartItemsCount);
      })
      .catch((err) => {
        console.error('კალათის ჩატვირთვის შეცდომა:', err);
      });
  }, [user, setCountFromApi]);

  useEffect(() => {
    if (sidebarOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [sidebarOpen]);


  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logoWrapper}>
            <Image src="/mainLogo.svg" alt="Logo" width={180} height={80} />
          </Link>

          <div className={styles.searchBarWrapper}>
            <SearchBar />
          </div>

          <div className={styles.actions}>
            {loading ? (
              <div className={`${styles.actionButton} ${styles.desktopActionButtons}`} aria-hidden>
                <Image src="/profile.svg" alt="Profile" width={24} height={24} />
                <span>პროფილი</span>
              </div>
            ) : user ? (
              <Link
                className={`${styles.actionButton} ${styles.desktopActionButtons}`}
                href={user.role === 0 ? '/farmer/mypurchases' : '/farmer/myfarm'}
              >
                <Image src="/profile.svg" alt="Profile" width={24} height={24} />
                <span>პროფილი</span>
              </Link>
            ) : (
              <Link className={`${styles.actionButton} ${styles.desktopActionButtons}`} href="/signin">
                <Image src="/profile.svg" alt="Profile" width={24} height={24} />
                <span>შესვლა</span>
              </Link>
            )}

            <Link
              className={`${styles.actionButton} ${styles.desktopActionButtons}`}
              href={user ? '/cart' : '/signin'}
            >
              <div className={styles.cartWrapper}>
                <Image src="/cart.svg" alt="Cart" width={24} height={24} />
                {count > 0 && <span className={styles.cartBadge}>{count}</span>}
              </div>
              <span>კალათა</span>
            </Link>
          </div>

          <div className={styles.secondaryActionsWrapper}>

            <Link
              className={`${styles.cartButton}`}
              href={user ? '/cart' : '/signin'}
            >
              <div className={styles.cartWrapper}>
                <Image src="/cart.svg" alt="Cart" width={24} height={24} />
                {count > 0 && <span className={styles.cartBadge}>{count}</span>}
              </div>
            </Link>

            <div
              className={styles.burgerMenu}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Image src="/burgerMenu.svg" alt="Menu" width={36} height={36} />
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setSidebarOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <FarmerSideBar />
            </div>
          </div>
        )}
      </header>

      <SecondaryHeader />
    </>
  );
};

export default Header;
