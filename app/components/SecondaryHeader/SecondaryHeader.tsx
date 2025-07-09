'use client';

import Link from 'next/link';
import styles from './SecondaryHeader.module.scss';

const SecondaryHeader = () => {
    return (
        <nav className={styles.wrapper}>
            <ul className={styles.inner}>
                <li>
                    <Link href="/">ჩვენს შესახებ</Link>
                </li>
                <li>
                    <Link href="/">ხშირად დასმული  კითხვები</Link>
                </li>
                <li>
                    <Link href="/">აგრო სკოლა</Link>
                </li>
                <li>
                    <Link href="/">კონტაქტი</Link>
                </li>
            </ul>
        </nav>
    );
};

export default SecondaryHeader;
