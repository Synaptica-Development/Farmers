'use client';

import { useForm } from 'react-hook-form';
import styles from './BecomeFarmer.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import { extractRoleFromToken } from '@/lib/extractRoleFromToken';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { filterGeorgianInput } from '@/utils/filterGeorgianInput';

interface Props {
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
}

type FormData = {
    personalId: string;
    photo: FileList;
    activityDescription: string;
    regionID: string;
    cityID: string;
    village?: string;
    address: string;
    chemicalsUsage: string;
    expectations: string;
    heardAbout: string;
    pricingAndIncome: string;
    productAdvantage: string;
};

type Region = { id: number; name: string };
type City = { id: number; name: string };

const BecomeFarmer = (props: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    const [passportPreview, setPassportPreview] = useState<string | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedRegionID, setSelectedRegionID] = useState<number | null>(null);
    const [selectedCityID, setSelectedCityID] = useState<string | null>(null);

    useEffect(() => {
        api.get('/regions')
            .then((res) => setRegions(res.data))
            .catch((err) => console.error('Error fetching regions:', err));
    }, []);

    useEffect(() => {
        if (selectedRegionID !== null) {
            api.get(`/cities?regionID=${selectedRegionID}`)
                .then((res) => setCities(res.data))
                .catch((err) => console.error('Error fetching cities:', err));
        } else {
            setCities([]);
        }
    }, [selectedRegionID]);

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData();

            formData.append('PersonalIDImg', data.photo[0]);
            formData.append('PersonalID', data.personalId);
            formData.append('Description', data.activityDescription);
            formData.append('RegionID', String(selectedRegionID));
            formData.append('CityID', String(selectedCityID));
            formData.append('Address', data.address);

            // ➕ Optional Village field
            if (data.village) {
                formData.append('Village', data.village);
            }

            const questions = [
                data.chemicalsUsage,
                data.expectations,
                data.heardAbout,
                data.pricingAndIncome,
                data.productAdvantage,
            ];
            questions.forEach(q => formData.append('Questions', q));

            const response = await api.put('/api/Farmer/create-farm', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const role = extractRoleFromToken(response.data.token);

            Cookies.set('token', response.data.token, { secure: true, sameSite: 'none', expires: 1 });

            if (role) {
                props.setRole(role);
                Cookies.set('role', role, { secure: true, sameSite: 'none', expires: 1 });
            }

            toast.success('თქვენ გახდით მეწარმე!');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            reset();
        } catch (err) {
            console.error('Upload error:', err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1>გახდი მეწარმე</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {/* Personal ID */}
                <div className={styles.fieldWrapper}>
                    <div className={`${styles.field} ${styles.personalId}`}>
                        <label htmlFor="personalId">პირადი ნომერი</label>
                        <input
                            id="personalId"
                            {...register('personalId', {
                                required: 'პირადი ნომერი სავალდებულოა',
                                pattern: { value: /^[0-9]+$/, message: 'მხოლოდ რიცხვები' },
                                minLength: { value: 11, message: 'უნდა იყოს ზუსტად 11 ციფრი' },
                                maxLength: { value: 11, message: 'უნდა იყოს ზუსტად 11 ციფრი' },
                            })}
                        />
                    </div>
                    {errors.personalId && <p className={styles.error}>{errors.personalId.message as string}</p>}
                </div>

                {/* Photo */}
                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <label htmlFor="photo">ატვირთე პირადობის/პასპორტის ფოტო</label>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={passportPreview || "/chooseImage.png"}
                                alt="Profile"
                                width={52}
                                height={52}
                                className={`${styles.chooseImage} ${passportPreview ? styles.fullImage : ''}`}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.photo}
                                id="photo"
                                {...register('photo', {
                                    required: 'ფოტო სავალდებულოა',
                                    onChange: (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setPassportPreview(URL.createObjectURL(file));
                                    },
                                })}
                            />
                        </div>
                    </div>
                    {errors.photo && <p className={styles.error}>{errors.photo.message as string}</p>}
                </div>

                {/* Activity Description */}
                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>
                            <label htmlFor="activityDescription">საქმიანობის აღწერა</label>
                            <p>
                                მოკლედ აღწერეთ თქვენი ფერმერული მეურნეობა...
                            </p>
                        </div>
                        <textarea
                            className={styles.description}
                            id="activityDescription"
                            {...register('activityDescription', {
                                required: 'აღწერა სავალდებულოა',
                                maxLength: { value: 500, message: 'მაქსიმუმ 500 სიმბოლო' },
                                pattern: {
                                    value: /^[\u10A0-\u10FF0-9\s.,!?]+$/,
                                    message: 'მხოლოდ ქართული ასოები, რიცხვები და სიმბოლოები (.,!?)'
                                },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.activityDescription && (
                        <p className={styles.error}>{errors.activityDescription.message as string}</p>
                    )}
                </div>

                {/* Region */}
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label>რეგიონი</label>
                            <p>აირჩიეთ რეგიონი სადაც მდებარეობს თქვენი საწარმო</p>
                        </div>
                        <div className={styles.dropDowns}>
                            <select
                                defaultValue=""
                                {...register('regionID', { required: 'აირჩიე რეგიონი' })}
                                onChange={(e) => {
                                    const id = Number(e.target.value);
                                    setSelectedRegionID(id);
                                    setValue('regionID', e.target.value);
                                    setSelectedCityID(null);
                                    setValue('cityID', '');
                                }}
                            >
                                <option value="" disabled>აირჩიე რეგიონი</option>
                                {regions?.map((region) => (
                                    <option key={region.id} value={region.id}>{region.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {errors.regionID && <p className={styles.error}>{errors.regionID.message}</p>}
                </div>

                {/* City */}
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label>ქალაქი / სოფელი</label>
                            <p>აირჩიეთ ქალაქი ან სოფელი სადაც მდებარეობს თქვენი საწარმო</p>
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
                                <option value="" disabled>აირჩიე ქალაქი / სოფელი</option>
                                {cities?.map((city) => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {errors.cityID && <p className={styles.error}>{errors.cityID.message}</p>}
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <label htmlFor="village">სოფელი (არასავალდებულო)</label>
                        <input
                            id="village"
                            type="text"
                            placeholder="სოფლის სახელი (არასავალდებულო)"
                            {...register('village', {
                                pattern: {
                                    value: /^[\u10A0-\u10FF0-9\s]+$/,
                                    message: 'მხოლოდ ქართული ასოები, რიცხვები და სივრცეებია ნებადართული',
                                },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.village && <p className={styles.error}>{errors.village.message as string}</p>}
                </div>

                {/* Address */}
                <div className={styles.fieldWrapper}>
                    <div className={`${styles.field} ${styles.addressField}`}>
                        <label htmlFor="address">მიუთითეთ მისამართი</label>
                        <input
                            id="address"
                            type="text"
                            {...register('address', {
                                required: 'მისამართი სავალდებულოა',
                                pattern: {
                                    value: /^[\u10A0-\u10FF\s0-9.,/-]+$/,
                                    message: 'მხოლოდ ქართული ასოები, ციფრები და სიმბოლოები (.,/-)'
                                },
                                minLength: { value: 5, message: 'მინიმუმ 5 სიმბოლო' },
                                maxLength: { value: 100, message: 'მაქსიმუმ 100 სიმბოლო' },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.address && <p className={styles.error}>{errors.address.message as string}</p>}
                </div>

                {/* Other Questions remain unchanged … */}

                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>
                            <label htmlFor="chemicalsUsage">იყენებთ თუ არა რაიმე არაბუნებრივ (ქიმიურ) საშუალებას პროდუქციის წარმოებისას?</label>
                            <p>თუ იყენებთ შხამ-ქიმიკატებს მიუთითეთ რის საწინააღმდეგოდ</p>
                        </div>
                        <textarea
                            className={styles.chemicalsUsage}
                            id="chemicalsUsage"
                            {...register('chemicalsUsage', {
                                required: 'პასუხი სავალდებულოა',
                                maxLength: { value: 500, message: 'მაქსიმუმ 500 სიმბოლო' },
                                pattern: {
                                    value: /^[\u10A0-\u10FF0-9\s.,!?]+$/,
                                    message: 'მხოლოდ ქართული ასოები, რიცხვები და სიმბოლოები (.,!?)',
                                },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.chemicalsUsage && (
                        <p className={styles.error}>{errors.chemicalsUsage.message as string}</p>
                    )}
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <label htmlFor="expectations">რა მოლოდინი გაქვთ ჩვენი პლატფორმისგან?</label>
                        <textarea
                            className={styles.expectations}
                            id="expectations"
                            {...register('expectations', {
                                required: 'მოლოდინები სავალდებულოა',
                                maxLength: { value: 120, message: 'მაქსიმუმ 100 სიმბოლო' },
                                pattern: {
                                    value: /^[\u10A0-\u10FF0-9\s.,!?]+$/,
                                    message: 'მხოლოდ ქართული ასოები, რიცხვები და სიმბოლოები (.,!?)',
                                },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.expectations && <p className={styles.error}>{errors.expectations.message as string}</p>}
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <label htmlFor="heardAbout">როგორ გაიგეთ ჩვენს შესახებ?</label>
                        <textarea
                            className={styles.heardAbout}
                            id="heardAbout"
                            {...register('heardAbout', {
                                required: 'გთხოვთ მიუთითოთ',
                                maxLength: { value: 120, message: 'მაქსიმუმ 50 სიმბოლო' },
                                pattern: {
                                    value: /^[\u10A0-\u10FF0-9\s.,!?]+$/,
                                    message: 'მხოლოდ ქართული ასოები, რიცხვები და სიმბოლოები (.,!?)',
                                },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.heardAbout && <p className={styles.error}>{errors.heardAbout.message as string}</p>}
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <label htmlFor="pricingAndIncome">საშუალოდ რა ფასად ყიდით თქვენს პროდუქციას და რამდენია შემოსავალი ჯამში (დღეში, თვეში, წელიწადში)?</label>
                        <textarea
                            className={styles.pricingAndIncome}
                            id="pricingAndIncome"
                            {...register('pricingAndIncome', {
                                required: 'გთხოვთ მიუთითოთ',
                                maxLength: { value: 120, message: 'მაქსიმუმ 300 სიმბოლო' },
                                pattern: {
                                    value: /^[\u10A0-\u10FF0-9\s.,!?]+$/,
                                    message: 'მხოლოდ ქართული ასოები, რიცხვები და სიმბოლოები (.,!?)',
                                },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.pricingAndIncome && <p className={styles.error}>{errors.pricingAndIncome.message as string}</p>}
                </div>

                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <label htmlFor="productAdvantage">რა გამოარჩევს თქვენს პროდუქციას (ასეთის არსებობის შემთხვევაში) სხვა მსგავსი პროდუქციისაგან? რა არის თქვენი ან თქვენი პროდუქციის ძლიერი მხარე რაზეც შეიძლება თქვენი საქმიანობის რეკლამის აწყობა?</label>
                        <textarea
                            className={styles.productAdvantage}
                            id="productAdvantage"
                            {...register('productAdvantage', {
                                required: 'გთხოვთ მიუთითოთ',
                                maxLength: { value: 120, message: 'მაქსიმუმ 300 სიმბოლო' },
                                pattern: {
                                    value: /^[\u10A0-\u10FF0-9\s.,!?]+$/,
                                    message: 'მხოლოდ ქართული ასოები, რიცხვები და სიმბოლოები (.,!?)',
                                },
                                onChange: (e) => {
                                    e.target.value = filterGeorgianInput(e.target.value);
                                },
                            })}
                        />
                    </div>
                    {errors.productAdvantage && <p className={styles.error}>{errors.productAdvantage.message as string}</p>}
                </div>

                <button type="submit">გაგზავნა</button>
            </form>
        </div>
    );
};

export default BecomeFarmer;
