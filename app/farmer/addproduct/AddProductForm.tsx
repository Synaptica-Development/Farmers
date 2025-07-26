'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

type FormData = {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    type: string;
    photo1: FileList;
    photo2: FileList;
    price: string;
    regionID: string;
    cityID: string;
};

type Category = { id: number; name: string };
type SubCategory = { id: number; name: string; categoryID: number };
type SubSubCategory = { id: number; name: string };
type Region = { id: number; name: string };
type City = { id: number; name: string };

export default function AddProductForm() {
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
    const [regions, setRegions] = useState<Region[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
    const [selectedRegionID, setSelectedRegionID] = useState<number | null>(null);
    const [selectedCityID, setSelectedCityID] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const router = useRouter();

    useEffect(() => {
        if (!productId) return;

        api
            .get('/product-details', { params: { productID: productId } })
            .then((res) => {
                const data = res.data;
                reset({
                    title: data.productName || '',
                    description: data.productDescription || '',
                    category: String(data.categoryID || ''),
                    subcategory: String(data.subCategoryID || ''),
                    type: String(data.subSubCategoryID || ''),
                    price: String(data.price || ''),
                    regionID: String(data.regionID || ''),
                    cityID: String(data.cityID || ''),
                });
                setSelectedCategoryId(data.categoryID);
                setSelectedSubCategoryId(data.subCategoryID);
                setSelectedRegionID(data.regionID);
                setSelectedCityID(data.cityID);
            })
            .catch((err) => console.error('❌ Error fetching product details:', err));
    }, [productId]);

    useEffect(() => {
        api
            .get('/api/Farmer/licensed-categories')
            .then((res) => setCategories(res.data))
            .catch((err) => console.error('❌ Error fetching licensed categories:', err));
    }, []);

    useEffect(() => {
        if (selectedCategoryId !== null) {
            api
                .get(`/api/Farmer/licensed-sub-categories?categoryID=${selectedCategoryId}`)
                .then((res) => setSubCategories(res.data))
                .catch((err) => console.error('❌ Error fetching sub-categories:', err));
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        if (selectedCategoryId !== null && selectedSubCategoryId !== null) {
            api
                .get(
                    `/api/Farmer/licensed-sub-sub-categories?categoryID=${selectedCategoryId}&subCategoryID=${selectedSubCategoryId}`
                )
                .then((res) => setSubSubCategories(res.data))
                .catch((err) => console.error('❌ Error fetching sub-sub-categories:', err));
        }
    }, [selectedCategoryId, selectedSubCategoryId]);

    useEffect(() => {
        api
            .get('/regions')
            .then((res) => setRegions(res.data))
            .catch((err) => console.error('❌ Error fetching regions:', err));
    }, []);

    useEffect(() => {
        if (selectedRegionID !== null) {
            api
                .get(`/cities?regionID=${selectedRegionID}`)
                .then((res) => setCities(res.data))
                .catch((err) => console.error('❌ Error fetching cities:', err));
        } else {
            setCities([]);
        }
    }, [selectedRegionID]);


    const onSubmit = async (data: FormData) => {
        if (!data.photo1?.[0] || !data.photo2?.[0]) {
            console.error('Both images are required');
            return;
        }

        const formData = new FormData();
        formData.append('ImageFile1', data.photo1[0]);
        formData.append('ImageFile2', data.photo2[0]);

        const params = new URLSearchParams({
            productName: data.title,
            productDescription: data.description,
            price: data.price,
            categoryID: data.category,
            subCategoryID: data.subcategory,
            subSubCategoryID: data.type,
            regionID: String(selectedRegionID),
            cityID: String(selectedCityID),
            count: '1',
        });

        const endpoint = productId
            ? `/api/Farmer/edit-product?productID=${productId}&${params.toString()}`
            : `/api/Farmer/add-product?${params.toString()}`;

        try {
            const response = await api.put(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Success:', response.data);
            router.push('/farmer/myfarm');
        } catch (err) {
            console.error('Failed to submit:', err);
        }
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
                        {categories.map((cat) => (
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
                        {subCategories.map((sub) => (
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
                        {subSubCategories.map((type) => (
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

            {/* second update  */}

            <div className={styles.imagefieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>ატვირთე ფოტო</label>
                        <p>ატვირთე პროდუქტის ფოტო</p>
                    </div>
                    <div className={styles.imageinputsWrapper}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="/chooseImage.png"
                                alt="Choose"
                                width={32}
                                height={32}
                                className={styles.chooseImage}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.photo}
                                id="photo1"
                                {...register('photo1', {
                                    required: 'პირველი ფოტო სავალდებულოა',
                                })}
                            />
                        </div>

                        <div className={styles.imageWrapper}>
                            <Image
                                src="/chooseImage.png"
                                alt="Choose"
                                width={32}
                                height={32}
                                className={styles.chooseImage}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.photo}
                                id="photo2"
                                {...register('photo2', {
                                    required: 'მეორე ფოტო სავალდებულოა',
                                })}
                            />
                        </div>
                    </div>
                </div>
                {errors.photo1 && <p className={styles.error}>{errors.photo1.message}</p>}
                {errors.photo2 && <p className={styles.error}>{errors.photo2.message}</p>}
            </div>

            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>ფასი</label>
                        <p>ფასი უნდა იყოს დადებითი რიცხვი</p>
                    </div>
                    <input
                        className={styles.price}
                        type="number"
                        min={1}
                        {...register('price', {
                            required: 'ფასი სავალდებულოა',
                            min: { value: 1, message: 'ფასი უნდა იყოს 1 ან მეტი' },
                        })}
                    />
                </div>
                {errors.price && <p className={styles.error}>{errors.price.message}</p>}
            </div>

            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>რეგიონი</label>
                    </div>
                    <div className={styles.dropDowns}>
                        <select
                            defaultValue=""
                            {...register('regionID', { required: 'აირჩიე რეგიონი' })}
                            onChange={(e) => {
                                const id = Number(e.target.value);
                                setSelectedRegionID(id);
                                setValue('regionID', e.target.value);
                            }}
                        >
                            <option value="" disabled>აირჩიე რეგიონი</option>
                            {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.name}
                                </option>
                            ))}
                        </select>

                        {errors.regionID && <p className={styles.error}>{errors.regionID.message}</p>}
                    </div>
                </div>
            </div>

            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>ქალაქი / სოფელი</label>
                    </div>
                    <div className={styles.dropDowns}>
                        <select
                            defaultValue=""
                            disabled={!selectedRegionID || !cities.length}
                            {...register('cityID', { required: 'აირჩიე ქალაქი ან სოფელი' })}
                            onChange={(e) => {
                                setSelectedCityID(e.target.value);
                                setValue('cityID', e.target.value);
                            }}
                        >
                            <option value="" disabled>აირჩიე ქალაქი ან სოფელი</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {errors.cityID && <p className={styles.error}>{errors.cityID.message}</p>}
            </div>

            <button type="submit" className={styles.submitBtn}>გაგზავნა</button>
        </form>
    );
}
