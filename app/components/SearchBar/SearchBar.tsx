'use client';

import Image from 'next/image';
import styles from './SearchBar.module.scss';
import { useRef, useState } from 'react';
import SearchSuggestion from '../SearchSuggestion/SearchSuggestion';

const SearchBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
        type='text'
        placeholder='ძიება'
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />

      {isFocused && searchTerm.trim().length > 0 && (
        <SearchSuggestion query={searchTerm} onClose={() => setIsFocused(false)} />
      )}
    </div>
  );
};

export default SearchBar;
