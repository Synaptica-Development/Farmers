'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './CitiesFilter.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';

interface City {
  id: number;
  name: string;
}

interface Props {
  regionIds: number[];
  activeCityIds: number[];
  onCityChange: (ids: number[]) => void;
}

const CitiesFilter = ({ regionIds, activeCityIds, onCityChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (regionIds.length > 0) {
      const params = regionIds.map((id) => `regionIDS=${id}`).join('&');
      api.get(`/cities?${params}`)
        .then((res) => {
          setCities(res.data || [])
          setIsOpen(true)
        })
        .catch((err) => console.error(err));
    } else {
      setCities([]);
      onCityChange([]);
    }
  }, [regionIds, onCityChange]);

  const toggleActive = (id: number) => {
    if (activeCityIds.includes(id)) {
      onCityChange(activeCityIds.filter((activeId) => activeId !== id));
    } else {
      onCityChange([...activeCityIds, id]);
    }
  };

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
    }
  }, [cities, isOpen]);

  return (
    <div className={styles.wrapper}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.header}>
        <span>ქალაქები / სოფელები</span>
        <Image
          src={'/dropDownArrow.svg'}
          alt="arrow"
          width={14}
          height={8}
          className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
        />
      </button>

      <div
        ref={contentRef}
        className={`${styles.content} ${isOpen ? styles.show : ''}`}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 0}px` : '0px',
          transition: 'max-height 0.3s ease',
        }}
      >
        <div className={styles.radioWrapper}>
          {cities.map((city) => (
            <label key={city.id} className={styles.radioItem}>
              <input
                type="checkbox"
                checked={activeCityIds.includes(city.id)}
                onChange={() => toggleActive(city.id)}
              />
              <span className={styles.customRadio}></span>
              {city.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitiesFilter;
