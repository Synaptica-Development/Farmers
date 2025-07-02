'use client';

import React, { useState } from 'react';
import styles from './page.module.scss';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';

type FormData = {
  fullName: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);

    reset();
  };


  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
        <h2>შესვლა</h2>
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
        </div>

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
