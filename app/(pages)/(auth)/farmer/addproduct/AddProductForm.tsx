'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/axios';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import { filterGeorgianInput } from "@/utils/filterGeorgianInput";
import BASE_URL from '@/app/config/api';

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
    location: string
    grammage: string;
};

type Category = { id: number; name: string };
type SubCategory = { id: number; name: string; categoryID: number };
type SubSubCategory = { id: number; name: string };

const grammageMap: Record<number, string> = {
    0: "გრამი",
    1: "კილო",
    2: "ლიტრი",
    3: "ცალი",
};

export default function AddProductForm() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
        setError,
        clearErrors,
    } = useForm<FormData>();

    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);

    const [previewImage1, setPreviewImage1] = useState<string | null>(null);
    const [previewImage2, setPreviewImage2] = useState<string | null>(null);

    const prevBlob1Ref = useRef<string | null>(null);
    const prevBlob2Ref = useRef<string | null>(null);

    const [quantity, setQuantity] = useState<string>('');
    const [minQuantity, setMinQuantity] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [location, setLocation] = useState<string>('');

    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const router = useRouter();
    const pathname = usePathname();


    useEffect(() => {
        if (!productId) return;
        api.get('/product-details', { params: { productID: productId } })
            .then((res) => {
                const data = res.data;
                console.log(data);
                console.log(grammageMap[data.grammageType]);

                reset({
                    title: data.productName || '',
                    description: data.productDescription || '',
                    category: String(data.categoryID || ''),
                    subcategory: String(data.subCategoryID || ''),
                    type: String(data.subSubCategoryID || ''),
                    price: String(data.price || ''),
                    quantity: String(data.quantity || ''),
                    minQuantity: String(data.minCount || ''),
                    grammage: data.grammageType
                });
                setSelectedCategoryId(data.categoryID);
                setSelectedSubCategoryId(data.subCategoryID);

                setPrice(String(data.price || ''));
                setQuantity(String(data.quantity || ''));
                setMinQuantity(String(data.minCount || ''));
                setLocation(data.location || '')

                if (data.image1) setPreviewImage1(`${BASE_URL}${data.image1}?t=${Date.now()}`);
                if (data.image2) setPreviewImage2(`${BASE_URL}${data.image2}?t=${Date.now()}`);

            })
            .catch((err) => console.error('Error fetching product details:', err));
    }, [productId, reset, pathname]);

    useEffect(() => {
        api.get('/api/Farmer/licensed-categories')
            .then((res) => setCategories(res.data))
            .catch((err) => console.error('Error fetching licensed categories:', err));

        api.get('/user/profile/me')
            .then((res) => setLocation(res.data.location || ''))
            .catch((err) => console.error('profile information:', err));
    }, []);

    useEffect(() => {
        if (selectedCategoryId !== null) {
            api.get(`/api/Farmer/licensed-sub-categories?categoryID=${selectedCategoryId}`)
                .then((res) => setSubCategories(res.data))
                .catch((err) => console.error('Error fetching sub-categories:', err));
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        if (selectedCategoryId !== null && selectedSubCategoryId !== null) {
            api.get(
                `/api/Farmer/licensed-sub-sub-categories?categoryID=${selectedCategoryId}&subCategoryID=${selectedSubCategoryId}`
            )
                .then((res) => setSubSubCategories(res.data))
                .catch((err) => console.error('Error fetching sub-sub-categories:', err));
        }
    }, [selectedCategoryId, selectedSubCategoryId]);

    useEffect(() => {
        return () => {
            if (prevBlob1Ref.current && prevBlob1Ref.current.startsWith('blob:')) {
                URL.revokeObjectURL(prevBlob1Ref.current);
            }
            if (prevBlob2Ref.current && prevBlob2Ref.current.startsWith('blob:')) {
                URL.revokeObjectURL(prevBlob2Ref.current);
            }
        };
    }, []);

    const photo1Register = register('photo1');
    const photo2Register = register('photo2');

    const handlePhoto1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        photo1Register.onChange?.(e);

        const file = e.target.files?.[0];
        if (file) {
            const newUrl = URL.createObjectURL(file);
            if (prevBlob1Ref.current && prevBlob1Ref.current.startsWith('blob:')) {
                URL.revokeObjectURL(prevBlob1Ref.current);
            }
            prevBlob1Ref.current = newUrl;
            setPreviewImage1(newUrl);
            clearErrors('photo1');
        } else {
            if (prevBlob1Ref.current && prevBlob1Ref.current.startsWith('blob:')) {
                URL.revokeObjectURL(prevBlob1Ref.current);
                prevBlob1Ref.current = null;
            }
            setPreviewImage1(null);
        }
    };

    const handlePhoto2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        photo2Register.onChange?.(e);

        const file = e.target.files?.[0];
        if (file) {
            const newUrl = URL.createObjectURL(file);
            if (prevBlob2Ref.current && prevBlob2Ref.current.startsWith('blob:')) {
                URL.revokeObjectURL(prevBlob2Ref.current);
            }
            prevBlob2Ref.current = newUrl;
            setPreviewImage2(newUrl);
            clearErrors('photo2');
        } else {
            if (prevBlob2Ref.current && prevBlob2Ref.current.startsWith('blob:')) {
                URL.revokeObjectURL(prevBlob2Ref.current);
                prevBlob2Ref.current = null;
            }
            setPreviewImage2(null);
        }
    };

    const onSubmit = async (data: FormData) => {

        if (!productId) {
            let hasError = false;
            if (!data.photo1?.[0]) {
                setError('photo1', { type: 'required', message: 'პირველი ფოტო სავალდებულოა' });
                hasError = true;
            }
            if (!data.photo2?.[0]) {
                setError('photo2', { type: 'required', message: 'მეორე ფოტო სავალდებულოა' });
                hasError = true;
            }
            if (hasError) return;
        }

        const formData = new FormData();

        if (data.photo1?.[0]) {
            formData.append('ImageFile1', data.photo1[0]);
        }

        if (data.photo2?.[0]) {
            formData.append('ImageFile2', data.photo2[0]);
        }

        const params = new URLSearchParams({
            productName: data.title,
            productDescription: data.description,
            price: data.price,
            minCount: data.minQuantity,
            grammage: String(data.grammage),
            categoryID: data.category,
            subCategoryID: data.subcategory,
            subSubCategoryID: data.type,
            count: data.quantity,
        });

        const endpoint = productId
            ? `/api/Farmer/edit-product?productID=${productId}&${params.toString()}`
            : `/api/Farmer/add-product?${params.toString()}`;

        try {
            const response = await api.put(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (productId) {
                console.log('asdaas', response.data)
                toast.success('პროდუქტი წარმატებით დარედაქტირდა!');
            } else {
                toast.success('თქვენ წარმატებით დაამატეთ პროდუქტი!');
            }
            router.push('/farmer/myfarm');
        } catch (err) {
            console.error('Failed to submit:', err);
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || 'დაფიქსირდა შეცდომა, სცადეთ თავიდან';
            toast.error(message);
        }
    };

    return (
        <div className={styles.background}>
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
                            {...register("title", {
                                required: "საქმიანობის დასახელება სავალდებულოა",
                                minLength: { value: 5, message: "მინიმუმ 5 სიმბოლო" },
                                maxLength: { value: 30, message: "მაქსიმუმ 30 სიმბოლო" },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
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
                                maxLength: { value: 300, message: 'მაქსიმუმ 300 სიმბოლო' },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
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
                            {categories?.map((cat) => (
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
                            {subCategories?.map((sub) => (
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
                            {subSubCategories?.map((type) => (
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
                                <img
                                    src={previewImage1 || "/chooseImage.png"}
                                    alt="Choose"
                                    width={32}
                                    height={32}
                                    className={`${styles.chooseImage} ${previewImage1 ? styles.fullImage : ''}`}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...photo1Register}
                                    onChange={(e) => handlePhoto1Change(e)}
                                />
                            </div>

                            <div className={styles.imageWrapper}>
                                <img
                                    src={previewImage2 || "/chooseImage.png"}
                                    alt="Choose"
                                    width={32}
                                    height={32}
                                    className={`${styles.chooseImage} ${previewImage2 ? styles.fullImage : ''}`}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...photo2Register}
                                    onChange={(e) => handlePhoto2Change(e)}
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
                                        if (!/^\d*\.?\d+$/.test(value)) return 'რაოდენობა უნდა იყოს მხოლოდ მთელი რიცხვი';
                                        if (Number(value) < 0) return 'რაოდენობა უნდა იყოს 0 ზე დიდ რიცხვი';
                                        return true;
                                    },
                                    onChange: (e) => setQuantity(e.target.value.replace(/\D/g, '')),
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
                                    onChange: (e) => setMinQuantity(e.target.value.replace(/\D/g, '')),
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
                                {...register('grammage', { required: 'აირჩიე ერთეული' })}
                                className={styles.grammage}
                            >
                                <option value="" disabled>აირჩიე</option>
                                <option value="0">გრამი</option>
                                <option value="1">კილო</option>
                                <option value="2">ლიტრი</option>
                                <option value="3">ცალი</option>
                            </select>
                            {errors.grammage && <p className={styles.error}>{errors.grammage.message}</p>}
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
                                            if (!/^\d*\.?\d+$/.test(value)) return 'ფასი უნდა იყოს მხოლოდ რიცხვი (გამოყენე წერტილი, არა მძიმედი)';
                                            if (Number(value) <= 0) return 'ფასი უნდა იყოს 0 ზე დიდ რიცხვი';
                                            return true;
                                        },
                                        onChange: (e) => {
                                            let val = e.target.value.replace(/,/g, '');
                                            val = val.replace(/[^0-9.]/g, '');
                                            const parts = val.split('.');
                                            if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
                                            setPrice(val);
                                        },
                                    })}
                                />

                                <span>₾</span>
                            </div>
                        </div>
                    </div>
                    {errors.price && <p className={styles.error}>{errors.price.message}</p>}
                </div>

                <div className={styles.fieldSectionWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}><label>მდებარეობა</label></div>
                        <div className={styles.dropDowns}>
                            <input
                                type="text"
                                value={location}
                                readOnly
                                className={styles.location}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className={styles.submitBtn}>{productId ? 'რედაქტირება' : 'დამატება'}</button>
            </form>
        </div>
    );
}
