'use client';

import React from 'react';
import styles from './page.module.scss';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

type FormData = {
    phone: string;
};

const PhoneNumberPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        try {

            const res = await api.get(`/api/Auth/request-recover-password`, {
                params: { phoneNumber: data.phone },
            });

            const key = res.data?.key;

            if (!key) {
                throw new Error("Key not found in response");
            }

            await api.post(
                `/api/Auth/send-otp?key=${encodeURIComponent(key)}`
            );

            Cookies.set("changeProfileKey", key, {
                expires: 1 / 24,
                secure: true,
                sameSite: "none",
            });

            reset();
            router.push("/profilechangeotp");
        } catch (err) {
            console.error("Recover password request failed:", err);
        }
    };


    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
                <h2>პაროლის აღდგენა</h2>
                <div className={styles.inputsWrapper}>
                    <input
                        type="tel"
                        placeholder="ტელ. ნომერი"
                        {...register('phone', {
                            required: 'შეიყვანე ტელეფონის ნომერი',
                            pattern: { value: /^[0-9]{9}$/, message: 'ტელეფონი უნდა იყოს 9 ციფრი' },
                        })}
                    />
                    {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
                </div>

                <div className={styles.buttonsWrapper}>
                    <button type="submit">გაგრძელება</button>
                </div>
            </form>
        </div>
    );
};

export default PhoneNumberPage;
