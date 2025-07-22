'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.scss';
import OtpInput from '../components/OtpInput/OtpInput';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const OtpPage = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);
  };

  useEffect(() => {
  const joinedOtp = otp.join('');
  const key = Cookies.get('key');

  if (joinedOtp.length === 6 && !otp.includes('') && key) {
    axios.post('https://185.49.165.101:5000/api/Auth/verify-otp', null, {
      params: {
        key: key,
        otp: joinedOtp,
      },
    })
    .then(() => {
      Cookies.remove('key');
      router.push('/signin');
    })
    .catch((err) => {
      console.error('OTP verification error:', err.response?.data || err.message);
      setError(true);
      setOtp(Array(6).fill(''));
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 0);
    });
  }
}, [otp]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.otpCard}>
        <h2>ერთჯერადი კოდი</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.otpInputs}>
            {otp.map((value, index) => (
              <OtpInput
                key={index}
                index={index}
                value={value}
                onChange={handleChange}
                hasError={error}
                inputRef={index === 0 ? firstInputRef : undefined}
              />
            ))}
          </div>
        </form>
        <div className={styles.counter}>
          <p>გაგზავნე ხელახლა</p>
          <span>2:00</span>
        </div>
        {error && <p className={styles.errorText}>კოდი არასწორია</p>}
      </div>
    </div>
  );
};

export default OtpPage;
