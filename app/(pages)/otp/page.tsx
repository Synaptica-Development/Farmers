'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.scss';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { extractRoleFromToken } from '@/lib/extractRoleFromToken';
import { toast } from 'react-hot-toast';
import OtpInput from '@/app/components/OtpInput/OtpInput';

const OtpPage = () => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [error, setError] = useState(false);
  const [counter, setCounter] = useState(120);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);
  };

  useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => setCounter(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter]);

  useEffect(() => {
    const joinedOtp = otp.join('');
    const key = Cookies.get('key');

    if (joinedOtp.length === 4 && !otp.includes('') && key) {
      api.post('/api/Auth/verify-otp', null, {
        params: { key: key, otp: joinedOtp },
      })
        .then((res) => {
          Cookies.remove('key');
          const { token } = res.data;
          const role = extractRoleFromToken(token);

          Cookies.set('token', token, {
            secure: true,
            sameSite: 'none',
          });


          if (role) {
            Cookies.set('role', role, {
              secure: true,
              sameSite: 'none',
            });
          }
          toast.success('თქვენ წარმატებით დარეგისტრირდით!');
          router.push('/');
        })
        .catch((err) => {
          console.error('OTP verification error:', err.response?.data || err.message);
          setError(true);
          setOtp(Array(4).fill(''));
          setTimeout(() => firstInputRef.current?.focus(), 0);
        });
    }
  }, [otp]);

  const resendOtp = async () => {
    const key = Cookies.get('key');
    if (!key) return;

    try {
      await api.post(`/api/Auth/send-otp?key=${encodeURIComponent(key)}`);
      setCounter(120);
      setError(false);
      setOtp(Array(4).fill(''));
      firstInputRef.current?.focus();
    } catch (err) {
      console.error('Resend OTP error:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => e.preventDefault();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(1, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.otpCard}>
        <h2>ერთჯერადი კოდი</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.otpInputs}>
            {otp?.map((value, index) => (
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
          {counter > 0 ? (
            <>
              <p>გაგზავნე ხელახლა</p>
              <span>{formatTime(counter)}</span>
            </>
          ) : (
            <button onClick={resendOtp} className={styles.resendBtn}>
              ხელახლა გაგზავნა
            </button>
          )}
        </div>

        {error && <p className={styles.errorText}>კოდი არასწორია</p>}
      </div>
    </div>
  );
};

export default OtpPage;
