'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './page.module.scss';
import Image from 'next/image';
import ProfileInput from '@/app/components/ProfileInput/ProfileInput';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface ProfileFormValues {
  email: string;
  name: string;
  lastname: string;
  phone: string;
  password: string;
}

export default function ProfileInformationPage() {
  const [originalValues, setOriginalValues] = useState<ProfileFormValues>({
    email: '',
    name: '',
    lastname: '',
    phone: '',
    password: '**************',
  });
  const router = useRouter();

  const [hasChanges, setHasChanges] = useState(false);
  const [, setEditingFields] = useState<Set<string>>(new Set());

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: originalValues,
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/user/profile/me');
        const profileData = {
          email: data.email || '',
          name: data.name || '',
          lastname: data.lastName || '',
          phone: data.phoneNumber || '',
          password: '**************',
        };
        setOriginalValues(profileData);
        reset(profileData);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    fetchProfile();
  }, [reset]);

  const watchedValues = watch();

  useEffect(() => {
    const changed = Object.keys(watchedValues).some(key => {
      const fieldKey = key as keyof ProfileFormValues;
      if (fieldKey === 'password') {
        return watchedValues[fieldKey] !== '**************' && watchedValues[fieldKey] !== '';
      }
      return watchedValues[fieldKey] !== originalValues[fieldKey];
    });

    const hasErrors = Object.keys(errors).length > 0;

    setHasChanges(changed && !hasErrors);
  }, [watchedValues, originalValues, errors]);

  const georgianRegex = /^[ა-ჰ]{2,}$/u;

  const passwordValidate = (value: string) => {
    if (!value || value === '**************') return true;
    if (/[^\x00-\x7F]/.test(value)) return 'მხოლოდ ინგლისური ასოები';
    if (value.length < 8) return 'მინიმუმ 8 სიმბოლო';
    if (!/[A-Z]/.test(value)) return 'მინიმუმ ერთი დიდი ასო';
    if (!/[a-z]/.test(value)) return 'მინიმუმ ერთი პატარა ასო';
    if (!/[0-9]/.test(value)) return 'მინიმუმ ერთი ციფრი';
    if (!/[^A-Za-z0-9]/.test(value)) return 'მინიმუმ ერთი სიმბოლო (!,@,#)';
    return true;
  };

  const handleEditToggle = (fieldName: string, isEditing: boolean) => {
    setEditingFields(prev => {
      const newSet = new Set(prev);
      if (isEditing) {
        newSet.add(fieldName);
      } else {
        newSet.delete(fieldName);
      }
      return newSet;
    });
  };

  const onSubmit = async (data: ProfileFormValues) => {
    interface UpdateProfilePayload {
      email: string;
      name: string;
      lastName: string;
      phoneNumber: string;
      password?: string;
    }

    const apiPayload: UpdateProfilePayload = {
      email: data.email || originalValues.email,
      name: data.name || originalValues.name,
      lastName: data.lastname || originalValues.lastname,
      phoneNumber: data.phone || originalValues.phone,
    };

    if (data.password && data.password !== '**************' && data.password !== '') {
      apiPayload.password = data.password;
    }

    console.log('Sending to API:', apiPayload);

    try {
      const response = await api.post('/user/update-profile', apiPayload);

      const keyFromBackend = response.data.key;

      await api.post(
        `/api/Auth/send-otp?key=${encodeURIComponent(keyFromBackend)}`
      );

      Cookies.set('changeProfileKey', keyFromBackend, {
        expires: 1 / 24,
        secure: true,
        sameSite: 'none',
      });

      router.push('/profilechangeotp');
      
      setOriginalValues({
        ...originalValues,
        ...data,
        password: '**************'
      });

      reset({
        ...data,
        password: '**************'
      });

      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('პროფილის განახლება ვერ მოხერხდა');
    }
  };

  return (
    <div className={styles.wrapper}>
      <Image
        src="/testProfile.png"
        alt="Profile"
        width={100}
        height={100}
        className={styles.avatar}
      />

      <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
        <ProfileInput
          label="ელ-ფოსტა"
          name="email"
          value={watch('email')}
          originalValue={originalValues.email}
          register={register('email', {
            validate: (value) => {
              if (!value || value === '') return true;
              return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(value) || 'არასწორი ელ-ფოსტის ფორმატი';
            }
          })}
          error={errors.email?.message}
          onEditToggle={handleEditToggle}
        />

        <ProfileInput
          label="სახელი"
          name="name"
          value={watch('name')}
          originalValue={originalValues.name}
          register={register('name', {
            validate: (value) => {
              if (!value || value === '') return true;
              return georgianRegex.test(value.trim()) || 'გამოიყენე ქართული ასოები';
            }
          })}
          error={errors.name?.message}
          onEditToggle={handleEditToggle}
        />

        <ProfileInput
          label="გვარი"
          name="lastname"
          value={watch('lastname')}
          originalValue={originalValues.lastname}
          register={register('lastname', {
            validate: (value) => {
              if (!value || value === '') return true;
              return georgianRegex.test(value.trim()) || 'გამოიყენე ქართული ასოები';
            }
          })}
          error={errors.lastname?.message}
          onEditToggle={handleEditToggle}
        />

        <ProfileInput
          label="მობილურის ნომერი"
          name="phone"
          value={watch('phone')}
          originalValue={originalValues.phone}
          register={register('phone', {
            validate: (value) => {
              if (!value || value === '') return true;
              return /^[0-9]{9}$/.test(value) || 'ტელეფონი უნდა იყოს 9 ციფრი';
            }
          })}
          error={errors.phone?.message}
          onEditToggle={handleEditToggle}
        />

        <ProfileInput
          label="პაროლი"
          name="password"
          value={watch('password')}
          originalValue={originalValues.password}
          register={register('password', {
            validate: passwordValidate,
          })}
          type="password"
          error={errors.password?.message}
          onEditToggle={handleEditToggle}
        />

        {hasChanges && (
          <button
            type="submit"
            className={styles.submitButton}
          >
            შენახვა
          </button>
        )}
      </form>
    </div>
  );
}
