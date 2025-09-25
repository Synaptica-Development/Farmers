'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import styles from './CategoriesFilter.module.scss';
import Image from 'next/image';

interface Props {
    activeIds: number[];
    onChange: (ids: number[]) => void;
}

interface Category {
    id: number;
    name: string;
}

const CategoriesFilter = ({ activeIds, onChange }: Props) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        api.get('/categories').then(res => {
            const payload = res.data;
            if (Array.isArray(payload)) setCategories(payload);
            else if (Array.isArray(payload?.categories)) setCategories(payload.categories);
            else setCategories([]);
        }).catch(() => {
            setCategories([]);
        });
    }, []);

    const toggleId = (id: number) => {
        if (activeIds.includes(id)) onChange([]);
        else onChange([id]);
    };

    return (
        <div>
            <button className={styles.header} onClick={() => setOpen(!open)}>
                <span>კატეგორია</span>
                <Image
                    src={'/dropDownArrow.svg'}
                    alt="arrow"
                    width={14}
                    height={8}
                    className={`${styles.arrow} ${open ? styles.open : ''}`}
                />
            </button>
            <div className={`${styles.content} ${open ? styles.show : ''}`} style={{ maxHeight: open ? '500px' : '0' }}>
                <div className={styles.radioWrapper}>
                    {(categories || []).map(c => (
                        <label key={c.id} className={styles.radioItem}>
                            <input
                                type="checkbox"
                                checked={activeIds.includes(c.id)}
                                onChange={() => toggleId(c.id)}
                            />
                            <span className={styles.customRadio}></span>
                            {c.name}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesFilter;
