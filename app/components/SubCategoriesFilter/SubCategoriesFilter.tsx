'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import styles from './SubCategoriesFilter.module.scss';
import Image from 'next/image';

interface Props {
    categoryIds: number[];
    activeIds: number[];
    onChange: (ids: number[]) => void;
}

interface SubCategory {
    id: number;
    name: string;
}

const SubCategoriesFilter = ({ categoryIds, activeIds, onChange }: Props) => {
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (categoryIds.length === 1) {
            const catId = categoryIds[0];
            api.get(`/subcategories?categoryID=${catId}`)
                .then(res => {
                    const payload = res.data;
                    if (Array.isArray(payload)) setSubcategories(payload);
                    else if (Array.isArray(payload?.categories)) setSubcategories(payload.categories);
                    else setSubcategories([]);
                })
                .catch(() => {
                    setSubcategories([]);
                });
        } else {
            setSubcategories([]);
        }
    }, [categoryIds]);

    const toggleId = (id: number) => {
        if (activeIds.includes(id)) {
            onChange([]);
        } else {
            onChange([id]);
        }
        setOpen(false)
    };


    if (categoryIds.length !== 1) return null;

    return (
        <div>
            <button className={styles.header} onClick={() => setOpen(!open)}>
                <span>სახეობა</span>
                <Image
                    src={'/dropDownArrow.svg'}
                    alt="arrow"
                    width={14}
                    height={8}
                    className={`${styles.arrow} ${open ? styles.open : ''}`}
                />
            </button>
            <div
                className={`${styles.content} ${open ? styles.show : ''}`}
                style={{ maxHeight: open ? '100%' : '0' }}
            >
                <div className={styles.radioWrapper}>
                    {subcategories.length > 0 ? (
                        subcategories.map((c) => (
                            <label key={c.id} className={styles.radioItem}>
                                <input
                                    type="checkbox"
                                    checked={activeIds.includes(c.id)}
                                    onChange={() => toggleId(c.id)}
                                />
                                <span className={styles.customRadio}></span>
                                {c.name}
                            </label>
                        ))
                    ) : (
                        open && <p className={styles.noItems}>სახეობა ვერ მოიძებნა</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default SubCategoriesFilter;
