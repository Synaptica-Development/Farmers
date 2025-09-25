'use client';

import Link from 'next/link';
import styles from './SecondaryHeader.module.scss';

const SecondaryHeader = () => {
    return (
        <nav className={styles.wrapper}>
            <ul className={styles.inner}>
                <li>
                    <Link href="/aboutus">ჩვენს შესახებ</Link>
                </li>
                <li>
                    <Link href="/faq">ხდკ</Link>
                </li>
                <li>
                    <Link href="/agroschool">აგრო სკოლა</Link>
                </li>
                <li>
                    <Link href="/contact">კონტაქტი</Link>
                </li>
                <li>
                    <Link href="/allproducts">პროდუქტები</Link>
                </li>
            </ul>
        </nav>
    );
};

export default SecondaryHeader;
