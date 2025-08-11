'use client';

import React, { useState } from 'react';
import styles from './page.module.scss';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

type FormData = {
  name: string;
  lastname: string;
  phone: string;
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


const SignUpPage = () => {
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
  const georgianRegex = /^[ა-ჰ]{2,}$/u;

  const password = watch('password') || '';

  const getPasswordErrors = (value: string): string[] => {
    const errs: string[] = [];
    if (!value || value.length === 0) {
      errs.push('შეიყვანე პაროლი');
      return errs;
    }
    if (/[^\x00-\x7F]/.test(value)) {
      errs.push('პაროლი უნდა შეიცავდეს მხოლოდ ინგლისურ ასოებს, ციფრებს და სიმბოლოებს');
    }
    if (value.length < 8) {
      errs.push('მინიმუმ 8 სიმბოლო');
    }
    if (!/[A-Z]/.test(value)) {
      errs.push('მინიმუმ ერთი დიდი ინგლისური ასო');
    }
    if (!/[a-z]/.test(value)) {
      errs.push('მინიმუმ ერთი პატარა ინგლისური ასო');
    }
    if (!/[0-9]/.test(value)) {
      errs.push('მინიმუმ ერთი ციფრი');
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      errs.push('მინიმუმ ერთი სიმბოლო (მაგ. !, ?, @, #)');
    }
    return errs;
  };

  const passwordValidate = (value: string) => {
    const errs = getPasswordErrors(value);
    return errs.length === 0 || 'პაროლი ვერ აკმაყოფილებს მოთხოვნებს';
  };

  const onSubmit = async (data: FormData) => {
    try {
      const registerResponse = await api.post('/api/Auth/register', {
        name: data.name.trim(),
        lastname: data.lastname.trim(),
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const keyFromBackend = registerResponse.data.key;

      await api.post(
        `/api/Auth/send-otp?key=${encodeURIComponent(keyFromBackend)}`
      );

      Cookies.set('key', keyFromBackend, {
        expires: 1 / 24,
        secure: true,
        sameSite: 'none',
      });

      router.push('/otp');
    } catch (e: unknown) {
      if (typeof e === 'object' && e !== null && 'response' in e) {
        const error = e as ApiError;
        console.error('Error:', error.response.data.message);
        setServerErrorMessage(error.response.data.message);
      } else {
        console.error('Unexpected error:', e);
        setServerErrorMessage('დაფიქსირდა გაუთვალისწინებელი შეცდომა');
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
        <h2>რეგისტრაცია</h2>
        <div className={styles.inputsWrapper}>
          {/* Phone */}
          <input
            type="tel"
            placeholder="ტელ. ნომერი"
            {...register('phone', {
              required: 'შეიყვანე ტელეფონის ნომერი',
              pattern: {
                value: /^[0-9]{9}$/,
                message: 'ტელეფონი უნდა იყოს 9 ციფრი',
              },
            })}
          />
          {errors.phone && (
            <p className={styles.error}>{errors.phone.message}</p>
          )}

          {/* Name */}
          <input
            type="text"
            placeholder="სახელი"
            {...register('name', {
              required: 'შეიყვანე სახელი',
              validate: value =>
                georgianRegex.test(value.trim()) || 'გამოიყენე ქართული ასოები',
            })}
          />
          {errors.name && (
            <p className={styles.error}>{errors.name.message}</p>
          )}

          {/* Last Name */}
          <input
            type="text"
            placeholder="გვარი"
            {...register('lastname', {
              required: 'შეიყვანე გვარი',
              validate: value =>
                georgianRegex.test(value.trim()) || 'გამოიყენე ქართული ასოები',
            })}
          />
          {errors.lastname && (
            <p className={styles.error}>{errors.lastname.message}</p>
          )}

          {/* Password */}
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
                  <p key={i} className={styles.error}>
                    {msg}
                  </p>
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
              <p className={styles.error}>
                {errors.confirmPassword.message}
              </p>
            )}

            {serverErrorMessage && (
              <p className={styles.error}>
                {serverErrorMessage}
              </p>
            )}
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          <button type="submit">რეგისტრაცია</button>
          <p>
            გაქვს ანგარიში? <Link href="/signin">შესვლა</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
