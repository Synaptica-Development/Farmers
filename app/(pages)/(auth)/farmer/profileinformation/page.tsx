'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import Image from 'next/image';
import ProfileInput from '@/app/components/ProfileInput/ProfileInput';

interface ProfileFormValues {
  email: string;
  name: string;
  lastname: string;
  phone: string;
  password: string;
}

export default function ProfileInformationPage() {
  const { register, watch } = useForm<ProfileFormValues>({
    defaultValues: {
      email: 'testtes@gmail.com',
      name: 'მარი',
      lastname: 'მუმლაძე',
      phone: '555 55 55 55',
      password: '**************',
    },
  });

  return (
    <div className={styles.wrapper}>
      <Image
        src="/testProfile.png"
        alt="Profile"
        width={100}
        height={100}
        className={styles.avatar}
      />

      <form className={styles.formWrapper}>
        <ProfileInput
          label="ელ-ფოსტა"
          name="email"
          value={watch('email')}
          register={register}
        />
        <ProfileInput
          label="სახელი"
          name="name"
          value={watch('name')}
          register={register}
        />
        <ProfileInput
          label="გვარი"
          name="lastname"
          value={watch('lastname')}
          register={register}
        />
        <ProfileInput
          label="მობილურის ნომერი"
          name="phone"
          value={watch('phone')}
          register={register}
        />
        <ProfileInput
          label="პაროლი"
          name="password"
          value={watch('password')}
          register={register}
          type="password"
        />
      </form>
    </div>
  );
}
