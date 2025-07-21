'use client';

import { useForm } from 'react-hook-form';
import styles from './BecomeFarmer.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';
import { useState } from 'react';

type FormData = {
    personalId: string;
    photo: FileList;
    activityDescription: string;
    expectations: string;
    heardAbout: string;
};

const BecomeFarmer = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
  try {
    const formData = new FormData();
    formData.append('PersonalIDImg', data.photo[0]);

    const queryParams = new URLSearchParams({
      PersonalID: data.personalId,
      Description: data.activityDescription,
      Answer1: data.expectations,
      Answer2: data.heardAbout,
    }).toString(); 


    const response = await api.put(`/api/Farmer/create-farm?${queryParams}`, formData);

    console.log('Success:', response.data);
    reset();
  } catch (err) {
    console.error('Upload error:', err);
  }
};



    return (
        <div className={styles.wrapper}>
            <h1>გახდი ფერმერი</h1>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {/* Personal ID */}
                <div className={styles.fieldWrapper}>
                    <div className={`${styles.field} ${styles.personalId}`}>
                        <label htmlFor="personalId">პირადი ნომერი</label>
                        <input
                            id="personalId"
                            {...register('personalId', {
                                required: 'პირადი ნომერი სავალდებულოა',
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'მხოლოდ რიცხვები',
                                },
                                minLength: {
                                    value: 11,
                                    message: 'უნდა იყოს ზუსტად 11 ციფრი',
                                },
                                maxLength: {
                                    value: 11,
                                    message: 'უნდა იყოს ზუსტად 11 ციფრი',
                                },
                            })}
                        />
                    </div>
                    {errors.personalId && <p className={styles.error}>{errors.personalId.message as string}</p>}
                </div>

                {/* Passport Photo */}
                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <label htmlFor="photo">ატვირთე პირადობის/პასპორტის ფოტო</label>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="/chooseImage.png"
                                alt="Profile"
                                width={52}
                                height={52}
                                className={styles.chooseImage}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className={styles.photo}
                                id="photo"
                                {...register('photo', {
                                    required: 'ფოტო სავალდებულოა',
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
                                საქმიანობის სრულად აღწერა, რა პროდუქციას აწარმოებ, რამდენი ხანია,
                                სად ყიდის, რა რაოდენობით (თვეში/დღეში), ასევე დაწერე კატეგორიები
                                მაგალითად ჯიში
                            </p>
                        </div>
                        <textarea
                            className={styles.description}
                            id="activityDescription"
                            {...register('activityDescription', {
                                required: 'აღწერა სავალდებულოა',
                                minLength: {
                                    value: 30,
                                    message: 'მინიმუმ 30 სიმბოლო',
                                },
                                maxLength: {
                                    value: 120,
                                    message: 'მაქსიმუმ 120 სიმბოლო',
                                },
                            })}
                        />
                    </div>
                    {errors.activityDescription && (
                        <p className={styles.error}>{errors.activityDescription.message as string}</p>
                    )}
                </div>

                {/* Expectations */}
                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <label htmlFor="expectations">რა მოლოდინი გაქვთ ჩვენი პლატფორმისგან?</label>
                        <textarea
                            className={styles.expectations}
                            id="expectations"
                            {...register('expectations', {
                                required: 'მოლოდინები სავალდებულოა',
                                minLength: {
                                    value: 30,
                                    message: 'მინიმუმ 30 სიმბოლო',
                                },
                                maxLength: {
                                    value: 120,
                                    message: 'მაქსიმუმ 120 სიმბოლო',
                                },
                            })}
                        />
                    </div>
                    {errors.expectations && <p className={styles.error}>{errors.expectations.message as string}</p>}
                </div>

                {/* Heard About */}
                <div className={styles.fieldWrapper}>
                    <div className={styles.field}>
                        <label htmlFor="heardAbout">საიდან გაიგეთ ჩვენს შესახებ?</label>
                        <textarea
                            className={styles.heardAbout}
                            id="heardAbout"
                            {...register('heardAbout', {
                                required: 'გთხოვთ მიუთითოთ',
                                minLength: {
                                    value: 30,
                                    message: 'მინიმუმ 30 სიმბოლო',
                                },
                                maxLength: {
                                    value: 120,
                                    message: 'მაქსიმუმ 120 სიმბოლო',
                                },
                            })}
                        />
                    </div>
                    {errors.heardAbout && <p className={styles.error}>{errors.heardAbout.message as string}</p>}
                </div>

                <button type="submit">გაგზავნა</button>
            </form>
        </div>
    );
};

export default BecomeFarmer;
