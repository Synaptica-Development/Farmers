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
  fullName: string;
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
      const registerResponse = await axios.post('http://185.49.165.101:5000/api/Auth/register', {
        username: data.fullName,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      const keyFromBackend = registerResponse.data.key;


      await axios.post(
        `http://185.49.165.101:5000/api/Auth/send-otp?key=${encodeURIComponent(keyFromBackend)}`
      );
      
      Cookies.set('key', keyFromBackend, {
        expires: 1 / 24,
        secure: true,
        sameSite: 'strict',
      });


      router.push('/otp');
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
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

          {/* Full Name */}
          <input
            type="text"
            placeholder="სახელი და გვარი"
            {...register('fullName', {
              required: 'შეიყვანე სახელი და გვარი',
              minLength: { value: 2, message: 'მინიმუმ 2 ასო' },
            })}
          />
          {errors.fullName && <p className={styles.error}>{errors.fullName.message}</p>}

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
                  validate: (value) => value === password || 'პაროლები არ ემთხვევა',
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
