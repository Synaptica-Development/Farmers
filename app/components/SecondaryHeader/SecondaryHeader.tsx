'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SecondaryHeader.module.scss';

const SecondaryHeader = () => {
    const pathname = usePathname();

    return (
        <nav className={styles.wrapper}>
            <ul className={styles.inner}>
                <li>
                    <Link
                        href="/allproducts"
                        className={pathname === '/allproducts' ? styles.active : ''}
                    >
                        პროდუქტები
                    </Link>
                </li>
                <li>
                    <Link
                        href="/faq"
                        className={pathname === '/faq' ? styles.active : ''}
                    >
                        კითხვები
                    </Link>
                </li>
                <li>
                    <Link
                        href="/agroschool"
                        className={pathname === '/agroschool' ? styles.active : ''}
                    >
                        აგრო სკოლა
                    </Link>
                </li>
                <li>
                    <Link
                        href="/aboutus"
                        className={pathname === '/aboutus' ? styles.active : ''}
                    >
                        ჩვენს შესახებ
                    </Link>
                </li>
                <li>
                    <Link
                        href="/contact"
                        className={pathname === '/contact' ? styles.active : ''}
                    >
                        კონტაქტი
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default SecondaryHeader;
