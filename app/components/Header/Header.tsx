'use client';
import Image from 'next/image';
import styles from './Header.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import SecondaryHeader from '../SecondaryHeader/SecondaryHeader';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
    const [role, setRole] = useState<string | null>(null);
    const { count } = useCart();

    useEffect(() => {
        const storedRole = Cookies.get('role');
        setRole(storedRole || null);
    }, []);
    const profileHref = role === "User" ? '/farmer/mypurchases' : '/farmer/myfarm';

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
                        {role ? (
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
                </div>
            </header>
            <SecondaryHeader />
        </>
    );
};

export default Header;
