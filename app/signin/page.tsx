'use client';

import React, { useState } from 'react';
import styles from './page.module.scss';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

type FormData = {
  phone: string;
  password: string;
};

const SignInPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = (data: FormData) => {
    setServerError(null);

    axios.post('https://185.49.165.101:5001/api/Auth/login', {
      phonenumber: data.phone,
      password: data.password,
    })
    .then(res => {
      const { token, expires } = res.data;
      Cookies.set('token', token, {
        expires: new Date(expires),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });
      reset();
      router.push('/');
    })
    .catch(err => {
      setServerError(err.response?.data?.message || 'ავტორიზაცია ვერ განხორციელდა');
    });
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
        <h2>შესვლა</h2>
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

          <div className={styles.passwordWrapper}>
            <div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="პაროლი"
                {...register('password', { required: 'შეიყვანე პაროლი' })}
              />
              <Image
                src={showPassword ? '/openEye.svg' : '/closeEye.svg'}
                alt=""
                width={22}
                height={22}
                onClick={() => setShowPassword(prev => !prev)}
                style={{ cursor: 'pointer' }}
              />
            </div>
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
          </div>
        </div>

        {serverError && <p className={styles.error}>{serverError}</p>}

        <div className={styles.buttonsWrapper}>
          <button type="submit">შესვლა</button>
          <p>
            არ გაქვს ანგარიში? <Link href="/signup">დარეგისტრირდი</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
