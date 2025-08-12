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
}

const CitiesFilter = ({ regionIds }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [activeCityIds, setActiveCityIds] = useState<number[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (regionIds.length > 0) {
      const params = regionIds.map((id) => `regionIDS=${id}`).join('&');
      api.get(`/cities?${params}`)
        .then((res) => {
          setCities(res.data || []);
        })
        .catch((err) => console.error(err));
    }
  }, [regionIds]);

  const toggleActive = (id: number) => {
    setActiveCityIds((prev) =>
      prev.includes(id)
        ? prev.filter((activeId) => activeId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.header}
      >
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
          maxHeight: isOpen
            ? `${contentRef.current?.scrollHeight || 0}px`
            : '0px',
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
