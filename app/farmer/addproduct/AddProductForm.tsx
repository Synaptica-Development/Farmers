'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type FormData = {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    type: string;
    photo1: FileList;
    photo2: FileList;
    price: string;
    quantity: string;
    minQuantity: string;
    unit: string;
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

    const [previewImage1, setPreviewImage1] = useState<string | null>(null);
    const [previewImage2, setPreviewImage2] = useState<string | null>(null);

    const [quantity, setQuantity] = useState<string>('');
    const [minQuantity, setMinQuantity] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [unit, setUnit] = useState<string>('');

    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const router = useRouter();

    // Fetch product details if editing
    useEffect(() => {
        if (!productId) return;

        api.get('/product-details', { params: { productID: productId } })
            .then((res) => {
                const data = res.data;
                reset({
                    title: data.productName || '',
                    description: data.productDescription || '',
                    category: String(data.categoryID || ''),
                    subcategory: String(data.subCategoryID || ''),
                    type: String(data.subSubCategoryID || ''),
                    price: String(data.price || ''),
                    quantity: String(data.quantity || ''),
                    minQuantity: String(data.minQuantity || ''),
                    unit: data.unit || '',
                    regionID: String(data.regionID || ''),
                    cityID: String(data.cityID || ''),
                });
                setSelectedCategoryId(data.categoryID);
                setSelectedSubCategoryId(data.subCategoryID);
                setSelectedRegionID(data.regionID);
                setSelectedCityID(data.cityID);

                // Fill states
                setPrice(String(data.price || ''));
                setQuantity(String(data.quantity || ''));
                setMinQuantity(String(data.minQuantity || ''));
                setUnit(data.unit || '');
            })
            .catch((err) => console.error('Error fetching product details:', err));
    }, [productId, reset]);

    // Fetch categories
    useEffect(() => {
        api.get('/api/Farmer/licensed-categories')
            .then((res) => setCategories(res.data))
            .catch((err) => console.error('Error fetching licensed categories:', err));
    }, []);

    // Fetch subcategories
    useEffect(() => {
        if (selectedCategoryId !== null) {
            api.get(`/api/Farmer/licensed-sub-categories?categoryID=${selectedCategoryId}`)
                .then((res) => setSubCategories(res.data))
                .catch((err) => console.error('Error fetching sub-categories:', err));
        }
    }, [selectedCategoryId]);

    // Fetch sub-subcategories
    useEffect(() => {
        if (selectedCategoryId !== null && selectedSubCategoryId !== null) {
            api.get(
                `/api/Farmer/licensed-sub-sub-categories?categoryID=${selectedCategoryId}&subCategoryID=${selectedSubCategoryId}`
            )
                .then((res) => setSubSubCategories(res.data))
                .catch((err) => console.error('Error fetching sub-sub-categories:', err));
        }
    }, [selectedCategoryId, selectedSubCategoryId]);

    // Fetch regions
    useEffect(() => {
        api.get('/regions')
            .then((res) => setRegions(res.data))
            .catch((err) => console.error('Error fetching regions:', err));
    }, []);

    // Fetch cities
    useEffect(() => {
        if (selectedRegionID !== null) {
            api.get(`/cities?regionID=${selectedRegionID}`)
                .then((res) => setCities(res.data))
                .catch((err) => console.error('Error fetching cities:', err));
        } else {
            setCities([]);
        }
    }, [selectedRegionID]);

    // Submit form
    const onSubmit = async (data: FormData) => {
        console.log(data)
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
            price,
            quantity,
            minQuantity,
            unit,
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
            toast.success('თქვენ წარმატებით დაამატეთ პროდუქტი!');
            router.push('/farmer/myfarm');
        } catch (err) {
            console.error('Failed to submit:', err);
        }
    };

    return (
        <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Title */}
            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>პროდუქტის დასახელება</label>
                        <p>პროდუქტის დასახელება რას აწარმოებთ</p>
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

            {/* Description */}
            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>პროდუქტის აღწერა</label>
                        <p>რა გამოარჩევს თქვენს პროდუქტციას</p>
                    </div>
                    <textarea
                        {...register('description', {
                            required: 'პროდუქტის აღწერა სავალდებულოა',
                            minLength: { value: 10, message: 'მინიმუმ 10 სიმბოლო' },
                            maxLength: { value: 80, message: 'მაქსიმუმ 200 სიმბოლო' },
                        })}
                    />
                </div>
                {errors.description && <p className={styles.error}>{errors.description.message}</p>}
            </div>

            {/* Category selection */}
            <div className={styles.fieldSection}>
                <div className={styles.texts}>
                    <label>აირჩიე კატეგორია </label>
                    <p>აირჩიე შენი პროდუქტის კატეგორია და ქვე კატეგორია</p>
                </div>
                <div className={styles.dropDowns}>
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
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category && <p className={styles.error}>{errors.category.message}</p>}

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
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>
                    {errors.subcategory && <p className={styles.error}>{errors.subcategory.message}</p>}

                    <select
                        defaultValue=""
                        {...register('type', { required: 'აირჩიე ჯიში / სახეობა' })}
                        disabled={!subSubCategories.length}
                    >
                        <option value="" disabled>ჯიში / სახეობა</option>
                        {subSubCategories.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                    {errors.type && <p className={styles.error}>{errors.type.message}</p>}
                </div>
            </div>

            {/* Image upload */}
            <div className={styles.imagefieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>ატვირთე ფოტო</label>
                        <p>ატვირთე პროდუქტის ფოტო</p>
                    </div>
                    <div className={styles.imageinputsWrapper}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={previewImage1 || "/chooseImage.png"}
                                alt="Choose"
                                width={32}
                                height={32}
                                className={`${styles.chooseImage} ${previewImage1 ? styles.fullImage : ''}`}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                {...register('photo1', {
                                    required: 'პირველი ფოტო სავალდებულოა',
                                    onChange: (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setPreviewImage1(URL.createObjectURL(file));
                                    },
                                })}
                            />
                        </div>

                        <div className={styles.imageWrapper}>
                            <Image
                                src={previewImage2 || "/chooseImage.png"}
                                alt="Choose"
                                width={32}
                                height={32}
                                className={`${styles.chooseImage} ${previewImage2 ? styles.fullImage : ''}`}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                {...register('photo2', {
                                    required: 'მეორე ფოტო სავალდებულოა',
                                    onChange: (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setPreviewImage2(URL.createObjectURL(file));
                                    },
                                })}
                            />
                        </div>
                    </div>
                </div>
                {errors.photo1 && <p className={styles.error}>{errors.photo1.message}</p>}
                {errors.photo2 && <p className={styles.error}>{errors.photo2.message}</p>}
            </div>

            {/* Quantity */}
            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}><label>პროდუქტის რაოდენობა</label></div>
                    <div className={styles.productQuantityWrapper}>
                        <input
                            className={styles.productQuantity}
                            type="text"
                            value={quantity}
                            {...register('quantity', {
                                required: 'პროდუქტის რაოდენობა სავალდებულოა',
                                validate: (value) => {
                                    if (!/^\d*\.?\d+$/.test(value)) return 'რაოდენობა უნდა იყოს მხოლოდ რიცხვი';
                                    if (Number(value) <= 0) return 'რაოდენობა უნდა იყოს 0 ზე დიდ რიცხვი';
                                    return true;
                                },
                                onChange: (e) => setQuantity(e.target.value),
                            })}
                        />
                    </div>
                </div>
                {errors.quantity && <p className={styles.error}>{errors.quantity.message}</p>}
            </div>

            {/* Min Quantity */}
            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}>
                        <label>შეკვეთის მინიმალური რაოდენობა</label>
                        <p>მიუთითეთ მინიმუმ რა რაოდენობაზე ნაკლები პროდუქციის შეკვეთა არ შეუძლია მომხმარებელს </p>
                    </div>
                    <div className={styles.productQuantityWrapper}>
                        <input
                            className={styles.productQuantity}
                            type="text"
                            value={minQuantity}
                            {...register('minQuantity', {
                                required: 'მინიმალური რაოდენობა სავალდებულოა',
                                validate: (value) => {
                                    if (!/^\d*\.?\d+$/.test(value)) return 'რაოდენობა უნდა იყოს მხოლოდ რიცხვი';
                                    if (Number(value) <= 0) return 'რაოდენობა უნდა იყოს 0 ზე დიდ რიცხვი';
                                    return true;
                                },
                                onChange: (e) => setMinQuantity(e.target.value),
                            })}
                        />

                    </div>
                </div>
                {errors.minQuantity && <p className={styles.error}>{errors.minQuantity.message}</p>}
            </div>

            {/* Unit Dropdown */}
            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}><label>პროდუქტის ერთეული</label></div>
                    <div className={styles.dropDowns}>
                        <select
                            defaultValue=""
                            {...register('unit', { required: 'აირჩიე ერთეული' })}
                        >
                            <option value="" disabled>აირჩიე ერთეული</option>
                            <option value="gram">გრამი</option>
                            <option value="kilo">კილო</option>
                            <option value="liter">ლიტრი</option>
                            <option value="piece">ცალი</option>
                        </select>
                        {errors.unit && <p className={styles.error}>{errors.unit.message}</p>}
                    </div>

                </div>
            </div>

            {/* Price */}
            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}><label>ფასი</label></div>
                    <div className={styles.priceWrapper}>
                        <div className={styles.priceContent}>
                            <input
                                className={styles.price}
                                type="text"
                                value={price}
                                {...register('price', {
                                    required: 'ფასი სავალდებულოა',
                                    validate: (value) => {
                                        if (!/^\d*\.?\d+$/.test(value)) return 'ფასი უნდა იყოს მხოლოდ რიცხვი';
                                        if (Number(value) <= 0) return 'ფასი უნდა იყოს 0 ზე დიდ რიცხვი';
                                        return true;
                                    },
                                    onChange: (e) => setPrice(e.target.value),
                                })}
                            />

                            <span>₾</span>
                        </div>
                    </div>
                </div>
                {errors.price && <p className={styles.error}>{errors.price.message}</p>}
            </div>

            {/* Region */}
            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}><label>რეგიონი</label></div>
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
                                <option key={region.id} value={region.id}>{region.name}</option>
                            ))}
                        </select>
                        {errors.regionID && <p className={styles.error}>{errors.regionID.message}</p>}
                    </div>
                </div>
            </div>

            {/* City */}
            <div className={styles.fieldSectionWrapper}>
                <div className={styles.fieldSection}>
                    <div className={styles.texts}><label>ქალაქი / სოფელი</label></div>
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
                            <option value="" disabled>აირჩიე ქალაქი / სოფელი</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                            ))}
                        </select>
                        {errors.cityID && <p className={styles.error}>{errors.cityID.message}</p>}
                    </div>
                </div>
            </div>

            <button type="submit" className={styles.submitBtn}>დამატება</button>
        </form>
    );
}
