'use client';
import Image from 'next/image';
import styles from './Header.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import SecondaryHeader from '../SecondaryHeader/SecondaryHeader';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import FarmerSideBar from '../FarmerSideBar/FarmerSideBar';
import { usePathname } from 'next/navigation';

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const { count } = useCart();
    const pathname = usePathname();

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        const storedRole = Cookies.get('role');
        const storedToken = Cookies.get('token');
        setRole(storedRole || null);
        setToken(storedToken || null);
    }, []);

    useEffect(() => {
        if (sidebarOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || "0") * -1);
            }
        }
    }, [sidebarOpen]);



    const profileHref = role === 'User' ? '/farmer/mypurchases' : '/farmer/myfarm';
    const isLoggedIn = !!role && !!token;

    return (
        <>
            <header className={styles.header}>
                <div className={styles.inner}>
                    <Link href="/" className={styles.logoWrapper}>
                        <Image src="/logo.png" alt="Logo" width={232} height={72} />
                    </Link>

                    <div className={styles.searchBarWrapper}>
                        <SearchBar />
                    </div>

                    <div className={styles.actions}>
                        {isLoggedIn ? (
                            <Link className={styles.actionButton} href={profileHref}>
                                <Image src="/profile.svg" alt="Profile" width={24} height={24} />
                                <span>პროფილი</span>
                            </Link>
                        ) : (
                            <Link className={styles.actionButton} href="/signin">
                                <Image src="/profile.svg" alt="Profile" width={24} height={24} />
                                <span>შესვლა</span>
                            </Link>
                        )}

                        <Link className={styles.actionButton} href="/cart">
                            <div className={styles.cartWrapper}>
                                <Image src="/cart.svg" alt="Cart" width={24} height={24} />
                                {count > 0 && <span className={styles.cartBadge}>{count}</span>}
                            </div>
                            <span>კალათა</span>
                        </Link>
                    </div>

                    <div
                        className={styles.burgerMenu}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Image src="/burgerMenu.svg" alt="Menu" width={36} height={36} />
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
