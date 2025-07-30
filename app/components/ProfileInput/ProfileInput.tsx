'use client';

import { useState, useRef, useEffect } from 'react';
import { UseFormRegister } from 'react-hook-form';
import styles from './ProfileInput.module.scss';
import Image from 'next/image';

interface ProfileFormValues {
  email: string;
  name: string;
  lastname: string;
  phone: string;
  password: string;
}

interface Props {
  label: string;
  name: keyof ProfileFormValues;
  value: string;
  register: UseFormRegister<ProfileFormValues>;
  type?: string;
}

const ProfileInput = ({ label, name, value, register, type = 'text' }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    ref: registerRef,
    ...restRegister
  } = register(name);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className={styles.fieldWrapper}>
      <div className={`${styles.texts} ${isEditing ? styles.editing : ''}`}>
        <label>{label}</label>
        <input
          type={type}
          defaultValue={value}
          readOnly={!isEditing}
          className={`${isEditing ? styles.editable : styles.readOnly}`}
          ref={(e) => {
            inputRef.current = e;
            registerRef(e);
          }}
          {...restRegister}
        />
      </div>

      <Image
        src="/editPen.svg"
        alt="Edit"
        width={20}
        height={16}
        className={styles.editIcon}
        onClick={() => setIsEditing((prev) => !prev)}
      />
    </div>
  );
};

export default ProfileInput;
