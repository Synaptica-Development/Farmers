'use client';
import Image from 'next/image';
import styles from './Header.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import SecondaryHeader from '../SecondaryHeader/SecondaryHeader';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const Header = () => {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = Cookies.get('role');
        setRole(storedRole || null);
    }, []);

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
                            <Link className={styles.actionButton} href="/farmer/myfarm">
                                <Image src="/profile.svg" alt="Profile" width={24} height={24} />
                                <span>პროფილი</span>
                            </Link>
                        )
                            :
                            (
                                <Link className={styles.actionButton} href="/signin">
                                    <Image src="/profile.svg" alt="Profile" width={24} height={24} />
                                    <span>შესვლა</span>
                                </Link>
                            )
                        }
                        <div className={styles.actionButton}>
                            <Image src="/cart.svg" alt="Logo" width={24} height={24} />
                            <span>კალათა</span>
                        </div>
                    </div>
                </div>
            </header>
            <SecondaryHeader />
        </>
    );
};

export default Header;
