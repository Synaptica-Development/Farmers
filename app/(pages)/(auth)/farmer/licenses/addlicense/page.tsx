'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useScrollOnRedirect } from '@/app/hooks/useScrollOnRedirect';
import { filterGeorgianInput } from '@/utils/filterGeorgianInput';

type FormData = {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    chemicalsUsage: string;
    averageIncome: string;
    productStrengths: string
    type: string;
    productionDuration: string;
    minQuantity: string;
    minPrice: string;
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
                .then((res) => {
                    const categories = res.data?.categories || [];
                    setSubCategories(categories);
                })
                .catch((err) => {
                    console.error('Error fetching subcategories:', err);
                    setSubCategories([]);
                });
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        if (selectedCategoryId !== null && selectedSubCategoryId !== null) {
            api.get(`/api/Farmer/unlicensed-sub-sub-categories?categoryID=${selectedCategoryId}&subCategoryID=${selectedSubCategoryId}`)
                .then((res) => {
                    const subSubCats = res.data || [];
                    setSubSubCategories(subSubCats);
                })
                .catch((err) => {
                    console.error('Error fetching sub-subcategories:', err);
                    setSubSubCategories([]);
                });
        }
    }, [selectedCategoryId, selectedSubCategoryId]);
    const onSubmit = (data: FormData) => {
        api.put('/api/Farmer/send-license-request', {
            jobName: data.title,
            jobDescription: data.description,
            categoryID: Number(data.category),
            subCategoryID: Number(data.subcategory),
            subSubCategoryID: Number(data.type),
            minimumQuantity: Number(data.minQuantity),
            minimumPrice: Number(data.minPrice),
            questions: [data.chemicalsUsage, data.averageIncome, data.productStrengths, data.productionDuration,]
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
        <div className={styles.background}>
            <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.fieldSectionWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label>პროდუქტის დასახელება</label>
                            <p>რას აწარმოებთ?</p>
                        </div>
                        <input
                            type="text"
                            {...register('title', {
                                required: 'პროდუქტის დასახელება სავალდებულოა',
                                minLength: { value: 5, message: 'მინიმუმ 5 სიმბოლო' },
                                maxLength: { value: 30, message: 'მაქსიმუმ 30 სიმბოლო' },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.title && <p className={styles.error}>{errors.title.message}</p>}
                </div>

                <div className={styles.fieldSectionWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label>საქმიანობის აღწერა</label>
                            <p>აღწერეთ თქვენი საქმიანობა</p>
                        </div>
                        <textarea
                            {...register('description', {
                                required: 'საქმიანობის აღწერა სავალდებულოა',
                                minLength: { value: 5, message: 'მინიმუმ 5 სიმბოლო' },
                                maxLength: { value: 150, message: 'მაქსიმუმ 150 სიმბოლო' },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.description && (
                        <p className={styles.error}>{errors.description.message}</p>
                    )}
                </div>

                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>აირჩიეთ კატეგორია </label>
                        <p>აირჩიეთ თქვენი პროდუქტის კატეგორია, ქვე-კატეგორია და ჯიში/სახეობა</p>
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
                            disabled={!subCategories || subCategories.length === 0}
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
                            disabled={!subSubCategories || subSubCategories.length === 0}
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


                <div className={styles.fieldSectionWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label>იყენებთ თუ არა რაიმე არაბუნებრივ (ქიმიურ) საშუალებას პროდუქციის წარმოებისას?</label>
                            <p>თუ იყენებთ შხამ-ქიმიკატებს მიუთითეთ რომელს და რის წინააღმდეგ?</p>
                        </div>
                        <textarea
                            {...register('chemicalsUsage', {
                                required: 'შევსება სავალდებულოა სავალდებულოა',
                                minLength: { value: 1, message: 'მინიმუმ 1 სიმბოლო' },
                                maxLength: { value: 150, message: 'მაქსიმუმ 150 სიმბოლო' },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.chemicalsUsage && (
                        <p className={styles.error}>{errors.chemicalsUsage.message}</p>
                    )}
                </div>

                <div className={styles.fieldSectionWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label>საშუალოდ რა ფასად ყიდით თქვენს პროდუქციას და რამდენია შემოსავალი ჯამში (დღეში, თვეში, წელიწადში)?</label>
                            <p>{`(რომ განვსაზღვროთ რამდენად შეძლებთ ჩვენი პლატფორმა თქვენს დახმარებას)`}</p>
                        </div>
                        <textarea
                            {...register('averageIncome', {
                                required: 'შევსება სავალდებულოა',
                                minLength: { value: 1, message: 'მინიმუმ 1 სიმბოლო' },
                                maxLength: { value: 150, message: 'მაქსიმუმ 150 სიმბოლო' },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.averageIncome && (
                        <p className={styles.error}>{errors.averageIncome.message}</p>
                    )}
                </div>


                <div className={styles.fieldSectionWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label>რა გამოარჩევს თქვენს პროდუქციას (ასეთის არსებობის შემთხვევაში) სხვა მსგავსი პროდუქციისაგან?</label>
                            <p>რა არის თქვენი ან თქვენი პროდუქციის ძლიერი მხარე?</p>
                        </div>
                        <textarea
                            {...register('productStrengths', {
                                required: 'შევსება სავალდებულოა',
                                minLength: { value: 1, message: 'მინიმუმ 1 სიმბოლო' },
                                maxLength: { value: 150, message: 'მაქსიმუმ 150 სიმბოლო' },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.productStrengths && (
                        <p className={styles.error}>{errors.productStrengths.message}</p>
                    )}
                </div>


                <div className={styles.fieldSectionWrapper}>
                    <div className={styles.fieldSection}>

                        <div className={styles.texts}>
                            <label>რამდენი ხანია აწარმოებთ პროდუქციას?</label>
                            <p>მოგვიყევით თქვენი გამოცდილების შესახებ</p>
                        </div>
                        <textarea
                            {...register('productionDuration', {
                                required: 'შევსება სავალდებულოა',
                                minLength: { value: 1, message: 'მინიმუმ 1 სიმბოლო' },
                                maxLength: { value: 300, message: 'მაქსიმუმ 300 სიმბოლო' },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.productionDuration && (
                        <p className={styles.error}>{errors.productionDuration.message}</p>
                    )}
                </div>

                <div className={styles.fieldSectionWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label>შეკვეთის მინიმალური რაოდენობა</label>
                            <p>მიუთითეთ მინიმუმ, რა რაოდენობაზე ნაკლები პროდუქციის შეკვეთა არ შეუძლია მომხმარებელს?</p>
                        </div>
                        <div className={styles.productQuantityWrapper}>
                            <input
                                className={styles.productQuantity}
                                type="text"
                                {...register('minQuantity', {
                                    required: 'მინიმალური რაოდენობა სავალდებულოა',
                                    validate: (value) => {
                                        if (!/^\d*\.?\d+$/.test(value)) return 'რაოდენობა უნდა იყოს მხოლოდ რიცხვი';
                                        if (Number(value) <= 0) return 'რაოდენობა უნდა იყოს 0 ზე დიდ რიცხვი';
                                        return true;
                                    },
                                })}
                            />
                        </div>
                    </div>
                    {errors.minQuantity && <p className={styles.error}>{errors.minQuantity.message}</p>}
                </div>


                <div className={styles.fieldSectionWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label>მინიმალური ფასი</label>
                            <p>მიუთითეთ მინიმუმ, რა ფასად აპირებთ თქვენი პროდუქციის გაყიდვას?</p>
                        </div>
                        <div className={styles.productQuantityWrapper}>
                            <input
                                className={styles.productQuantity}
                                type="text"
                                {...register('minPrice', {
                                    required: 'მინიმალური ფასი სავალდებულოა',
                                    validate: (value) => {
                                        if (!/^\d*\.?\d+$/.test(value)) return 'ფასი უნდა იყოს მხოლოდ რიცხვი';
                                        if (Number(value) <= 0) return 'ფასი უნდა იყოს 0 ზე დიდ რიცხვი';
                                        return true;
                                    },
                                })}
                            />
                        </div>
                    </div>
                    {errors.minPrice && <p className={styles.error}>{errors.minPrice.message}</p>}
                </div>

                <button type="submit" className={styles.submitBtn}>გაგზავნა</button>
            </form>
        </div>
    );
}
