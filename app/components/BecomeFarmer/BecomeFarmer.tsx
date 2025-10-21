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
import { useRouter } from 'next/navigation';

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
type Village = { id: number; name: string };

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

    const [villageInput, setVillageInput] = useState('');
    const [villageSuggestions, setVillageSuggestions] = useState<Village[]>([]);

    const router = useRouter();

    useEffect(() => {
        api
            .get('/regions')
            .then((res) => setRegions(res.data))
            .catch((err) => console.error('Error fetching regions:', err));
    }, []);

    useEffect(() => {
        if (selectedRegionID !== null) {
            api
                .get(`/cities?regionID=${selectedRegionID}`)
                .then((res) => setCities(res.data))
                .catch((err) => console.error('Error fetching cities:', err));
        } else {
            setCities([]);
        }
    }, [selectedRegionID]);

    const fetchVillages = async (title: string) => {
        if (!selectedCityID) return;

        try {
            const res = await api.get(`/villages`, {
                params: {
                    cityID: selectedCityID,
                    title: title,
                    page: 1,
                    pageSize: 5,
                },
            });
            setVillageSuggestions(res.data);
        } catch (err) {
            console.error('Error fetching villages:', err);
            setVillageSuggestions([]);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData();

            formData.append('PersonalIDImg', data.photo[0]);
            formData.append('PersonalID', data.personalId);
            formData.append('Description', data.activityDescription);
            formData.append('RegionID', String(selectedRegionID));
            formData.append('CityID', String(selectedCityID));
            formData.append('Village', data.village || '');
            formData.append('Address', data.address);

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
            questions.forEach((q) => formData.append('Questions', q));

            const response = await api.put('/api/Farmer/create-farm', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const role = extractRoleFromToken(response.data.token);

            Cookies.set('token', response.data.token, {
                secure: true,
                sameSite: 'none',
                expires: 1,
            });

            if (role) {
                props.setRole(role);
                Cookies.set('role', role, { secure: true, sameSite: 'none', expires: 1 });
            }

            toast.success('მოთხოვნა გაგზავნილია!');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            reset();
            router.push('/');
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
                        <label htmlFor="photo">ატვირთეთ პირადობის/პასპორტის ფოტო</label>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={passportPreview || '/chooseImage.png'}
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
                            <p>მოკლედ აღწერეთ თქვენი წარმოება</p>
                        </div>
                        <textarea
                            className={styles.description}
                            id="activityDescription"
                            {...register('activityDescription', {
                                required: 'აღწერა სავალდებულოა',
                                maxLength: { value: 500, message: 'მაქსიმუმ 500 სიმბოლო' },
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
                                    setVillageInput('');
                                    setVillageSuggestions([]);
                                }}
                            >
                                <option value="" disabled>
                                    აირჩიე რეგიონი
                                </option>
                                {regions?.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
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
                            <label>ქალაქი/რაიონი</label>
                            <p>აირჩიეთ ქალაქი/რაიონი სადაც მდებარეობს თქვენი საწარმო</p>
                        </div>
                        <div className={styles.dropDowns}>
                            <select
                                defaultValue=""
                                disabled={!selectedRegionID || !cities.length}
                                {...register('cityID', { required: 'აირჩიე ქალაქი' })}
                                onChange={(e) => {
                                    setSelectedCityID(e.target.value);
                                    setValue('cityID', e.target.value);
                                    setVillageInput('');
                                    setVillageSuggestions([]);
                                }}
                            >
                                <option value="" disabled>
                                    აირჩიე ქალაქი
                                </option>
                                {cities?.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {errors.cityID && <p className={styles.error}>{errors.cityID.message}</p>}
                </div>

                {/* Village*/}
                <div className={styles.fieldWrapper}>
                    <div className={styles.fieldSection}>
                        <div className={styles.texts}>
                            <label htmlFor="village">სოფელი (არასავალდებულო)</label>
                            <p>ჩაწერეთ სოფლი სადაც მდებარეობს თქვენი საწარმო</p>
                        </div>
                        <div className={styles.villageSearchWrapper}>
                            <input
                                id="village"
                                type="text"
                                placeholder="ჩაწერე სოფლის სახელი"
                                disabled={!selectedCityID}
                                {...register('village')}
                                value={villageInput}
                                onChange={(e) => {
                                    const val = filterGeorgianInput(e.target.value);
                                    setVillageInput(val);
                                    setValue('village', val);
                                    fetchVillages(val);
                                }}
                                onFocus={() => {
                                    fetchVillages(villageInput);
                                }}
                                onBlur={() => {
                                    setTimeout(() => setVillageSuggestions([]), 150);
                                }}
                            />
                            {villageSuggestions.length > 0 && (
                                <ul className={styles.suggestionsList}>
                                    {villageSuggestions.map((v) => (
                                        <li
                                            key={v.id}
                                            onClick={() => {
                                                setVillageInput(v.name);
                                                setValue('village', v.name);
                                                setVillageSuggestions([]);
                                            }}
                                        >
                                            {v.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    {errors.village && <p className={styles.error}>{errors.village.message as string}</p>}
                </div>


                {/* Address */}
                <div className={styles.fieldWrapper}>
                    <div className={`${styles.field} ${styles.addressField}`}>
                        <div className={styles.texts}>
                            <label htmlFor="address">მისამართი</label>
                            <p>ჩაწერეთ მისამართი სადაც მდებარეობს თქვენი საწარმო</p>
                        </div>
                        <input
                            id="address"
                            type="text"
                            {...register('address', {
                                required: 'მისამართი სავალდებულოა',
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


                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>
                            <label htmlFor="chemicalsUsage">იყენებთ თუ არა რაიმე არაბუნებრივ (ქიმიურ) საშუალებას პროდუქციის წარმოებისას?</label>
                            <p>თუ იყენებთ შხამ-ქიმიკატებს მიუთითეთ რომელს და რის წინააღმდეგ?</p>
                        </div>
                        <textarea
                            className={styles.chemicalsUsage}
                            id="chemicalsUsage"
                            {...register('chemicalsUsage', {
                                required: 'პასუხი სავალდებულოა',
                                maxLength: { value: 500, message: 'მაქსიმუმ 500 სიმბოლო' },
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
                        <div className={styles.fieldLabel}>
                            <label htmlFor="expectations">რა არის ყველაზე დიდი სირთულე რაშიც გსურთ დახმარება?</label>
                            <p>როგორ ფიქრობთ რაში დაგეხმარებათ ჩვენი პლატფორმა?</p>
                        </div>
                        <textarea
                            className={styles.expectations}
                            id="expectations"
                            {...register('expectations', {
                                required: 'მოლოდინები სავალდებულოა',
                                maxLength: { value: 500, message: 'მაქსიმუმ 500 სიმბოლო' },
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
                        <div className={styles.fieldLabel}>
                            <label htmlFor="heardAbout">რა გზით შეიტყვეთ ჩვენს შესახებ?</label>
                            <p>სოც. ქსელი, ტელევიზიით, ახლობლისგან და ა.შ</p>
                        </div>
                        <textarea
                            className={styles.heardAbout}
                            id="heardAbout"
                            {...register('heardAbout', {
                                required: 'გთხოვთ მიუთითოთ',
                                maxLength: { value: 500, message: 'მაქსიმუმ 500 სიმბოლო' },
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
                        <div className={styles.fieldLabel}>
                            <label htmlFor="pricingAndIncome">რამდენი ადამიანია დასაქმებული თქვენს წარმოებაში?</label>
                            <p>მიუთითეთ თქვენ საწარმოში დასაქმებლ ადამიანთა რაოდენობა</p>
                        </div>

                        <textarea
                            className={styles.pricingAndIncome}
                            id="pricingAndIncome"
                            {...register('pricingAndIncome', {
                                required: 'სავალდებულოა',
                                maxLength: { value: 500, message: 'მაქსიმუმ 500 სიმბოლო' },
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
                        <div className={styles.fieldLabel}>
                        <label htmlFor="productAdvantage">როგორ წარმოგიდგენიათ თქვენი საქმიანობის განვითარების მინიმალური და მაქიმალური პერსპექტივები?</label>
                            <p>აღწერეთ თქვენი სამომავლო ხედვა, მინიმუმ და მაქსიმუმ რა შედეგებამდე გსურთ გასვლა</p>
                        </div>
                        <textarea
                            className={styles.productAdvantage}
                            id="productAdvantage"
                            {...register('productAdvantage', {
                                required: 'სავალდებულოა',
                                maxLength: { value: 500, message: 'მაქსიმუმ 500 სიმბოლო' },
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
