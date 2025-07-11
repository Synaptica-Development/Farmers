'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.scss';
import OtpInput from '../components/OtpInput/OtpInput';

const CORRECT_OTP = '123456';

const OtpPage = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);
  };

  useEffect(() => {
    const joinedOtp = otp.join('');
    if (joinedOtp.length === 6 && !otp.includes('')) {
      if (joinedOtp === CORRECT_OTP) {
        alert('✅ OTP is correct!');
      } else {
        setError(true);
        setOtp(Array(6).fill(''));
        setTimeout(() => {
          firstInputRef.current?.focus();
        }, 0);
      }
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
