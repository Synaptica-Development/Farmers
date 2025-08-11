'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useScrollOnRedirect } from '@/app/hooks/useScrollOnRedirect';

type FormData = {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    type: string;
};

type Category = {
    id: number;
    name: string;
};

type SubCategory = {
    id: number;
    name: string;
    categoryID: number;
};

type SubSubCategory = {
    id: number;
    name: string;
};

export default function AddLicensePage() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FormData>();

    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);

  const { pushAndScroll } = useScrollOnRedirect();

    useEffect(() => {
        api.get('/api/Farmer/unlicensed-categories')
            .then((res) => setCategories(res.data))
            .catch((err) => console.error('Error fetching categories:', err));
    }, []);

    useEffect(() => {
        if (selectedCategoryId !== null) {
            api.get(`/api/Farmer/unlicensed-sub-categories?categoryID=${selectedCategoryId}`)
                .then((res) => setSubCategories(res.data.categories))
                .catch((err) => console.error('Error fetching subcategories:', err));
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        if (selectedCategoryId !== null && selectedSubCategoryId !== null) {
            api.get(`/api/Farmer/unlicensed-sub-sub-categories?categoryID=${selectedCategoryId}&subCategoryID=${selectedSubCategoryId}`)
                .then((res) => setSubSubCategories(res.data))
                .catch((err) => console.error('Error fetching sub-subcategories:', err));
        }
    }, [selectedCategoryId, selectedSubCategoryId]);

    const onSubmit = (data: FormData) => {
        api.put('/api/Farmer/send-license-request', {
            jobName: data.title,
            jobDescription: data.description,
            categoryID: Number(data.category),
            subCategoryID: Number(data.subcategory),
            subSubCategoryID: Number(data.type),
        })
            .then((response) => {
                console.log('License request sent successfully:', response.data);
                pushAndScroll('/farmer/licenses')
                reset();
                setSelectedCategoryId(null);
                setSelectedSubCategoryId(null);
                setSubCategories([]);
                setSubSubCategories([]);
                toast.success('ლიცენზიის მოთხოვნა წარმატებით გაიგზავნა!', {
                    duration: 5000,
                    style: {
                        fontSize: '20px',
                        padding: '16px 24px',
                        minWidth: '450px',
                    },
                });
            })
            .catch((error) => {
                console.error('Error sending license request:', error.response?.data || error.message);
            });
    };

    return (
        <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>საქმიანობის დასახელება</label>
                        <p>საქმიანობის დასახელება რას აწარმოებთ</p>
                    </div>
                    <input
                        type="text"
                        {...register('title', {
                            required: 'საქმიანობის დასახელება სავალდებულოა',
                            minLength: { value: 5, message: 'მინიმუმ 5 სიმბოლო' },
                            maxLength: { value: 30, message: 'მაქსიმუმ 30 სიმბოლო' },
                        })}
                    />
                </div>
                {errors.title && <p className={styles.error}>{errors.title.message}</p>}
            </div>

            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>საქმიანობის აღწერა</label>
                        <p>აღწერე შენი საქმიანობა და პროდუქტი ვრცლად</p>
                    </div>
                    <textarea
                        {...register('description', {
                            required: 'საქმიანობის აღწერა სავალდებულოა',
                            minLength: { value: 10, message: 'მინიმუმ 10 სიმბოლო' },
                            maxLength: { value: 80, message: 'მაქსიმუმ 80 სიმბოლო' },
                        })}
                    />
                </div>
                {errors.description && (
                    <p className={styles.error}>{errors.description.message}</p>
                )}
            </div>

            <div className={styles.fieldSection}>
                <div className={styles.texts}>
                    <label>აირჩიე კატეგორია </label>
                    <p>აირჩიე შენი პროდუქტის კატეგორია და ქვე კატეგორია</p>
                </div>

                <div className={styles.dropDowns}>
                    {/* Category Dropdown */}
                    <select
                        defaultValue=""
                        {...register('category', { required: 'აირჩიე კატეგორია' })}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            setSelectedCategoryId(selectedId);
                            setSelectedSubCategoryId(null);
                            setSubCategories([]);
                            setSubSubCategories([]);
                            setValue('subcategory', '');
                            setValue('type', '');
                        }}
                    >
                        <option value="" disabled>კატეგორია</option>
                        {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className={styles.error}>{errors.category.message}</p>
                    )}

                    {/* Subcategory Dropdown */}
                    <select
                        defaultValue=""
                        {...register('subcategory', { required: 'აირჩიე ქვეკატეგორია' })}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            setSelectedSubCategoryId(selectedId);
                            setSubSubCategories([]);
                            setValue('type', '');
                        }}
                        disabled={!subCategories.length}
                    >
                        <option value="" disabled>ქვეკატეგორია</option>
                        {subCategories?.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                    {errors.subcategory && (
                        <p className={styles.error}>{errors.subcategory.message}</p>
                    )}

                    {/* Sub-Subcategory Dropdown */}
                    <select
                        defaultValue=""
                        {...register('type', { required: 'აირჩიე ჯიში / სახეობა' })}
                        disabled={!subSubCategories.length}
                    >
                        <option value="" disabled>ჯიში / სახეობა</option>
                        {subSubCategories?.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                    {errors.type && (
                        <p className={styles.error}>{errors.type.message}</p>
                    )}
                </div>
            </div>

            <button type="submit" className={styles.submitBtn}>გაგზავნა</button>
        </form>
    );
}
