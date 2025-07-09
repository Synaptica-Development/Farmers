'use client';

import Image from 'next/image'
import styles from './SearchBar.module.scss'
import { useRef } from 'react'

const SearchBar = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleIconClick = () => {
        inputRef.current?.focus(); 
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.searchIcon} onClick={handleIconClick}>
                <Image
                    src={'/search.svg'}
                    alt='search icon'
                    width={21}
                    height={21}
                />
            </div>
            <input
                ref={inputRef}
                type="text"
                placeholder="ძიება"
                className={styles.searchInput}
            />
        </div>
    )
}

export default SearchBar;
