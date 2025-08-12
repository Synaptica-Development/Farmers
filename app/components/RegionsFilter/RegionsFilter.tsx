'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './RegionsFilter.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';
import CitiesFilter from '../CitiesFilter/CitiesFilter';

interface Region {
  id: number;
  name: string;
}

interface Props {
  activeRegionIds: number[];
  onRegionChange: (ids: number[]) => void;

  activeCityIds: number[];
  onCityChange: (ids: number[]) => void;
}

const RegionsFilter = ({ activeRegionIds, onRegionChange, activeCityIds, onCityChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/regions')
      .then((res) => setRegions(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const toggleActive = (id: number) => {
    if (activeRegionIds.includes(id)) {
      onRegionChange(activeRegionIds.filter((activeId) => activeId !== id));
      // Optional: Also clear cities from that region if you want here
      // But you can leave it as is, user can manually update cities
    } else {
      onRegionChange([...activeRegionIds, id]);
    }
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <button onClick={() => setIsOpen(!isOpen)} className={styles.header}>
          <span>რეგიონები</span>
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
          }}
        >
          <div className={styles.radioWrapper}>
            {regions.map((region) => (
              <label key={region.id} className={styles.radioItem}>
                <input
                  type="checkbox"
                  checked={activeRegionIds.includes(region.id)}
                  onChange={() => toggleActive(region.id)}
                />
                <span className={styles.customRadio}></span>
                {region.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      {activeRegionIds.length > 0 && (
        <CitiesFilter
          regionIds={activeRegionIds}
          activeCityIds={activeCityIds}
          onCityChange={onCityChange}
        />
      )}
    </div>
  );
};

export default RegionsFilter;
