'use client';

import React, { useState } from 'react';
import styles from './page.module.scss';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

type FormData = {
    password: string;
    confirmPassword: string;
};

interface ApiErrorResponse {
    message: string;
}

interface ApiError {
    response: {
        data: ApiErrorResponse;
    };
}

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({ mode: 'onTouched' });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverErrorMessage, setServerErrorMessage] = useState('');
    const router = useRouter();

    const password = watch('password') || '';

    const getPasswordErrors = (value: string): string[] => {
        const errs: string[] = [];
        if (!value) {
            errs.push('შეიყვანე პაროლი');
            return errs;
        }
        if (/[^\x00-\x7F]/.test(value)) {
            errs.push('პაროლი უნდა შეიცავდეს მხოლოდ ინგლისურ ასოებს, ციფრებს და სიმბოლოებს');
        }
        if (value.length < 8) errs.push('მინიმუმ 8 სიმბოლო');
        if (!/[A-Z]/.test(value)) errs.push('მინიმუმ ერთი დიდი ინგლისური ასო');
        if (!/[a-z]/.test(value)) errs.push('მინიმუმ ერთი პატარა ინგლისური ასო');
        if (!/[0-9]/.test(value)) errs.push('მინიმუმ ერთი ციფრი');
        if (!/[^A-Za-z0-9]/.test(value)) errs.push('მინიმუმ ერთი სიმბოლო (მაგ. !, ?, @, #)');
        return errs;
    };

    const passwordValidate = (value: string) => {
        const errs = getPasswordErrors(value);
        return errs.length === 0 || 'პაროლი ვერ აკმაყოფილებს მოთხოვნებს';
    };

    const onSubmit = async (data: FormData) => {
        try {
            const sessionID = Cookies.get("sessionID");
            if (!sessionID) {
                setServerErrorMessage("Session ID ვერ მოიძებნა");
                return;
            }

            await api.post('/api/Auth/change-password', {
                sessionID: sessionID,
                newPassword: data.password,
                reNewPassword: data.confirmPassword,
            });

            Cookies.remove("sessionID");
            router.push('/signin');
        } catch (e: unknown) {
            if (typeof e === 'object' && e !== null && 'response' in e) {
                const error = e as ApiError;
                setServerErrorMessage(error.response.data.message);
            } else {
                setServerErrorMessage('დაფიქსირდა გაუთვალისწინებელი შეცდომა');
            }
        }
    }

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
                <h2>პაროლის შეცვლა</h2>
                {/* Password */}
                <div className={styles.inputsWrapper}>
                    <div className={styles.passwordWrapper}>
                        <div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="პაროლი"
                                {...register('password', {
                                    required: 'შეიყვანე პაროლი',
                                    validate: passwordValidate,
                                })}
                            />
                            <Image
                                src={showPassword ? '/openEye.svg' : '/closeEye.svg'}
                                alt="toggle password"
                                width={22}
                                height={22}
                                onClick={() => setShowPassword(prev => !prev)}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                        {password && (
                            <div>
                                {getPasswordErrors(password)?.map((msg, i) => (
                                    <p key={i} className={styles.error}>{msg}</p>
                                ))}
                            </div>
                        )}
                        {errors.password && (
                            <p className={styles.error}>{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className={styles.passwordWrapper}>
                        <div>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="გაიმეორე პაროლი"
                                {...register('confirmPassword', {
                                    required: 'გაიმეორე პაროლი',
                                    validate: value =>
                                        value === password || 'პაროლები არ ემთხვევა',
                                })}
                            />
                            <Image
                                src={showConfirmPassword ? '/openEye.svg' : '/closeEye.svg'}
                                alt="toggle confirm password"
                                width={22}
                                height={22}
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className={styles.error}>{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                {serverErrorMessage && (
                    <p className={styles.error}>{serverErrorMessage}</p>
                )}

                <div className={styles.buttonsWrapper}>
                    <button type="submit">პაროლის შეცვლა</button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
