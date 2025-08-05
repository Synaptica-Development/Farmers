'use client';

import { useForm } from 'react-hook-form';
import styles from './BecomeFarmer.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import { extractRoleFromToken } from '@/lib/extractRoleFromToken';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
}

type FormData = {
    personalId: string;
    photo: FileList;
    activityDescription: string;
    expectations: string;
    heardAbout: string;
    pricingAndIncome: string;
    productAdvantage: string;
};

const BecomeFarmer = (props: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const [passportPreview, setPassportPreview] = useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData();
            formData.append('PersonalIDImg', data.photo[0]);

            const queryParams = new URLSearchParams();
            queryParams.append('PersonalID', data.personalId);
            queryParams.append('Description', data.activityDescription);

            const questions = [
                data.expectations,
                data.heardAbout,
                data.pricingAndIncome,
                data.productAdvantage,
            ];

            questions.forEach(q => queryParams.append('Questions', q));

            const response = await api.put(`/api/Farmer/create-farm?${queryParams.toString()}`, formData);

            const role = extractRoleFromToken(response.data.token);

            Cookies.set('token', response.data.token, { secure: true, sameSite: 'none' });

            if (role) {
                props.setRole(role);
                Cookies.set('role', role, { secure: true, sameSite: 'none' });
            }
            toast.success('თქვენ გახდით ფერმერი!');
            reset();
        } catch (err) {
            console.error('Upload error:', err);
        }
    };


    return (
        <div className={styles.wrapper}>
            <h1>გახდი ფერმერი</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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

                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>
                            <label htmlFor="activityDescription">საქმიანობის აღწერა</label>
                            <p>
                                მოკლედ აღწერეთ თქვენი ფერმერული მეურნეობა. რას აწარმოებთ (ჯიში, სახეობა)? რამდენი ხანია?
                                რა რაოდენობის პროდუქტს აწარმოებთ საშუალოდ დღეში, თვეში, წელიწადში?
                            </p>
                        </div>
                        <textarea
                            className={styles.description}
                            id="activityDescription"
                            {...register('activityDescription', {
                                required: 'აღწერა სავალდებულოა',
                                minLength: { value: 30, message: 'მინიმუმ 30 სიმბოლო' },
                                maxLength: { value: 120, message: 'მაქსიმუმ 500 სიმბოლო' },
                            })}
                        />
                    </div>
                    {errors.activityDescription && (
                        <p className={styles.error}>{errors.activityDescription.message as string}</p>
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
                                minLength: { value: 30, message: 'მინიმუმ 30 სიმბოლო' },
                                maxLength: { value: 120, message: 'მაქსიმუმ 100 სიმბოლო' },
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
                                minLength: { value: 30, message: 'მინიმუმ 30 სიმბოლო' },
                                maxLength: { value: 120, message: 'მაქსიმუმ 50 სიმბოლო' },
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
                                minLength: { value: 30, message: 'მინიმუმ 30 სიმბოლო' },
                                maxLength: { value: 120, message: 'მაქსიმუმ 300 სიმბოლო' },
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
                                minLength: { value: 30, message: 'მინიმუმ 30 სიმბოლო' },
                                maxLength: { value: 120, message: 'მაქსიმუმ 300 სიმბოლო' },
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
