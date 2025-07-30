'use client';

import React, { useState } from 'react';
import styles from './page.module.scss';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type FormData = {
  name: string;
  lastname: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const registerResponse = await axios.post('http://185.49.165.101:5002/api/Auth/register', {
        name: data.name,
        lastname: data.lastname,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const keyFromBackend = registerResponse.data.key;

      await axios.post(
        `http://185.49.165.101:5002/api/Auth/send-otp?key=${encodeURIComponent(keyFromBackend)}`
      );

      Cookies.set('key', keyFromBackend, {
        expires: 1 / 24,
        secure: true,
        sameSite: 'none',
      });

      router.push('/otp');
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const password = watch('password');

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
          {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}

          {/* Name */}
          <input
            type="text"
            placeholder="სახელი"
            {...register('name', {
              required: 'შეიყვანე სახელი',
              minLength: { value: 2, message: 'მინიმუმ 2 ასო' },
            })}
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}

          {/* Last Name */}
          <input
            type="text"
            placeholder="გვარი"
            {...register('lastname', {
              required: 'შეიყვანე გვარი',
              minLength: { value: 2, message: 'მინიმუმ 2 ასო' },
            })}
          />
          {errors.lastname && <p className={styles.error}>{errors.lastname.message}</p>}

          {/* Password */}
          <div className={styles.passwordWrapper}>
            <div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="პაროლი"
                {...register('password', { required: 'შეიყვანე პაროლი' })}
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
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className={styles.passwordWrapper}>
            <div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="გაიმეორე პაროლი"
                {...register('confirmPassword', {
                  required: 'გაიმეორე პაროლი',
                  validate: value => value === password || 'პაროლები არ ემთხვევა',
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
