'use client';

import { useState, useRef, useEffect, MutableRefObject } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './ProfileInput.module.scss';
import Image from 'next/image';

interface Props {
  label: string;
  name: string;
  value: string;
  originalValue: string;
  register: UseFormRegisterReturn;
  type?: string;
  error?: string;
  onEditToggle?: (name: string, isEditing: boolean) => void;
}

const ProfileInput = ({ 
  label, 
  name, 
  value, 
  originalValue,
  register, 
  type = 'text', 
  error,
  onEditToggle 
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'password') {
        inputRef.current.value = '';
      }
    }
  }, [isEditing, type]);


  const { ref: registerRef, onChange: registerOnChange, ...registerProps } = register;

  const setRefs = (element: HTMLInputElement | null) => {
    inputRef.current = element;
    if (registerRef) {
      if (typeof registerRef === 'function') {
        registerRef(element);
      } else {
        (registerRef as MutableRefObject<HTMLInputElement | null>).current = element;
      }
    }
  };

  const handleEditClick = () => {
    const newEditingState = !isEditing;
    setIsEditing(newEditingState);
    
    if (onEditToggle) {
      onEditToggle(name, newEditingState);
    }

    if (!newEditingState && inputRef.current) {
      if (error || inputRef.current.value === '') {
        if (type === 'password') {
          inputRef.current.value = '**************';
        } else {
          inputRef.current.value = originalValue;
        }
      } else if (type === 'password' && inputRef.current.value !== '') {

      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (registerOnChange) {
      registerOnChange(e);
    }
  };

  return (
    <>
      <div className={styles.fieldWrapper}>
        <div className={`${styles.texts} ${isEditing ? styles.editing : ''}`}>
          <label>{label}</label>
          <input
            type={type === 'password' && !isEditing ? 'password' : 'text'}
            defaultValue={type === 'password' ? '**************' : value}
            readOnly={!isEditing}
            className={`${isEditing ? styles.editable : styles.readOnly}`}
            {...registerProps}
            onChange={handleChange}
            ref={setRefs}
          />
        </div>

        <Image
          src="/editPen.svg"
          alt="Edit"
          width={20}
          height={16}
          className={styles.editIcon}
          onClick={handleEditClick}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
};

export default ProfileInput;