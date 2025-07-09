'use client';
import Image from 'next/image';
import styles from './Header.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import SecondaryHeader from '../SecondaryHeader/SecondaryHeader';
import Link from 'next/link';

const Header = () => {
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
                        <div className={styles.actionButton}>
                            <Image src="/profile.svg" alt="Logo" width={24} height={24} />
                            <span>პროფილი</span>
                        </div>
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
