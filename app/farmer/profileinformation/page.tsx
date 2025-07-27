'use client';

import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import Image from 'next/image';
import ProfileInput from '@/app/components/ProfileInput/ProfileInput';

export default function ProfileInformationPage() {
  const { register, handleSubmit } = useForm({
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
          value="testtes@gmail.com"
          register={register}
        />
        <ProfileInput
          label="სახელი"
          name="name"
          value="მარი"
          register={register}
        />
        <ProfileInput
          label="გვარი"
          name="lastname"
          value="მუმლაძე"
          register={register}
        />
        <ProfileInput
          label="მობილურის ნომერი"
          name="phone"
          value="555 55 55 55"
          register={register}
        />
        <ProfileInput
          label="პაროლი"
          name="password"
          value="**************"
          type="password"
          register={register}
        />
      </form>
    </div>
  );
}
