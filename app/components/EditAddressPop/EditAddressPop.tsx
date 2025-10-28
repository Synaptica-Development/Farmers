'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './EditAddressPop.module.scss';
import Image from 'next/image';
import api from '@/lib/axios';
import { filterGeorgianInput } from '@/utils/filterGeorgianInput';
import { toast } from 'react-hot-toast';

type FormValues = {
  fullName: string;
  region: string;
  city: string;
  location: string;
  phone: string;
};

interface Region {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

export interface EditAddress {
  id: string;
  fullName?: string;
  regionID?: number | null;
  cityID?: number | null;
  address?: string;
  phoneNumber?: string;
}

interface Props {
  onClose: () => void;
  fetchAddresses: () => void;
  address?: EditAddress | null;
  title?: string;
}

const EditAddressPop = ({ onClose, fetchAddresses, address = null, title }: Props) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const selectedRegion = watch('region');

  useEffect(() => {
    api
      .get('/regions')
      .then((res) => setRegions(res.data))
      .catch((err) => console.error('Error fetching regions:', err));
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      api
        .get(`/cities?regionID=${selectedRegion}`)
        .then((res) => setCities(res.data))
        .catch((err) => console.error('Error fetching cities:', err));
      setValue('city', '');
    } else {
      setCities([]);
      setValue('city', '');
    }
  }, [selectedRegion, setValue]);

  useEffect(() => {
    if (address) {
      reset({
        fullName: address.fullName ?? '',
        region: address.regionID ? String(address.regionID) : '',
        city: address.cityID ? String(address.cityID) : '',
        location: address.address ?? '',
        phone: address.phoneNumber ?? '',
      });
      if (address.regionID) {
        api
          .get(`/cities?regionID=${address.regionID}`)
          .then((res) => setCities(res.data))
          .catch((err) => console.error('Error fetching cities for prefill:', err));
      }
    } else {
      reset({
        fullName: '',
        region: '',
        city: '',
        location: '',
        phone: '',
      });
    }
  }, [address, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!address?.id) {
      console.error('No address ID provided for edit');
      return;
    }

    const params: Record<string, string | number | undefined> = {
      addressID: address.id,
    };

    if (data.fullName !== undefined) params.fullName = data.fullName;
    if (data.phone !== undefined) params.phoneNumber = data.phone;
    if (data.region !== '') params.regionID = Number(data.region);
    if (data.city !== '') params.cityID = Number(data.city);
    if (data.location !== undefined) params.address = data.location;

    try {
      await api.put('/api/Cart/edit-address', null, { params });
      toast.success('თქვენ წარმატებით შეცვალეთ ინფორმაცია!');
      fetchAddresses();
      onClose();
    } catch (err) {
      console.error('Error editing address:', err);
    }
  };

  return (
    <form
      className={styles.addAddressWrapper}
      onClick={onClose}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title ?? 'მისამართის რედაქტირება'}</h2>
          <button
            type="button"
            aria-label="Close"
            className={styles.closeButton}
            onClick={onClose}
          >
            <Image src="/greenDeleteIcon.svg" alt="Close" width={30} height={30} />
          </button>
        </div>

        {/* Full Name */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>სახელი და გვარი</label>
          <input
            type="text"
            placeholder="შეიყვანეთ სახელი და გვარი"
            {...register('fullName', {
              required: 'შეიყვანეთ სახელი და გვარი',
              minLength: { value: 2, message: 'სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს' },
              pattern: {
                value: /^[\u10A0-\u10FF\s]+$/,
                message: 'გამოიყენეთ მხოლოდ ქართული ასოები',
              },
              onChange: (e) => {
                e.target.value = filterGeorgianInput(e.target.value);
              },
            })}
          />
          {errors.fullName && <p className={styles.error}>{errors.fullName.message}</p>}
        </div>

        {/* Region dropdown */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>რეგიონი</label>
          <div className={styles.dropdown}>
            <select
              {...register('region', { required: 'აირჩიეთ რეგიონი' })}
              value={selectedRegion}
              onChange={(e) => setValue('region', e.target.value)}
            >
              <option value="">აირჩიეთ რეგიონი</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <Image
              src="/dropDownArrow.svg"
              alt="Dropdown Arrow"
              width={16}
              height={16}
              className={styles.dropdownArrow}
            />
          </div>
          {errors.region && <p className={styles.error}>{errors.region.message}</p>}
        </div>

        {/* City dropdown */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>ქალაქი</label>
          <div className={styles.dropdown}>
            <select {...register('city', { required: 'აირჩიეთ ქალაქი' })} disabled={!selectedRegion}>
              <option value="">აირჩიეთ ქალაქი</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Image
              src="/dropDownArrow.svg"
              alt="Dropdown Arrow"
              width={16}
              height={16}
              className={styles.dropdownArrow}
            />
          </div>
          {errors.city && <p className={styles.error}>{errors.city.message}</p>}
        </div>

        {/* Address */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>მისამართი</label>
          <input
            type="text"
            placeholder="უბანი, ქუჩა, კორპუსის ნომერი"
            {...register('location', {
              required: 'შეიყვანეთ მისამართი',
              validate: (val: string) =>
                val.trim().length >= 4 || 'მისამართი უნდა ჰქონდეს მინიმუმ 4 სიმბოლო.',
              onChange: (e) => {
                e.target.value = filterGeorgianInput(e.target.value);
              },
            })}
          />
          {errors.location && <p className={styles.error}>{errors.location.message}</p>}
        </div>

        {/* Phone */}
        <div className={styles.inputWrapper}>
          <label className={styles.label}>ტელეფონის ნომერი</label>
          <input
            type="text"
            placeholder="შეიყვანეთ 9-ნიშნა ნომერი"
            {...register('phone', {
              required: 'შეიყვანეთ ტელეფონის ნომერი',
              pattern: { value: /^\d{9}$/, message: 'ნომერი უნდა შეიცავდეს ზუსტად 9 ციფრს' },
            })}
          />
          {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
        </div>

        <button className={styles.submitButton} type="submit">
          შენახვა
        </button>
      </div>
    </form>
  );
};

export default EditAddressPop;
