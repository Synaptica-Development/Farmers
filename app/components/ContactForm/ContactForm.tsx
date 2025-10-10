'use client';

import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import styles from "./ContactForm.module.scss";
import { filterGeorgianInput } from '@/utils/filterGeorgianInput';

type FormValues = {
  gmail: string;
  fullname: string;
  phone: string;
  message: string;
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    setResponseMessage(null);

    api
      .put("/api/Contact/send-email", {
        email: data.gmail,
        fullName: data.fullname,
        phoneNumber: data.phone,
        message: data.message,
      })
      .then(() => {
        setResponseMessage("თქვენი წერილი წარმატებით გაიგზავნა!");
        reset();
      })
      .catch(() => {
        setResponseMessage("დაფიქსირდა შეცდომა! გთხოვთ სცადოთ თავიდან.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
      <h2>მოგვწერეთ</h2>

      {/* Gmail input */}
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="ელ. ფოსტა"
          {...register("gmail", {
            required: "ელ. ფოსტა აუცილებელია",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
              message: "მიუთითეთ სწორი ელ. ფოსტis მისამართი",
            },
          })}
        />
        {errors.gmail && <p className={styles.error}>{errors.gmail.message}</p>}
      </div>

      {/* Fullname input */}
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="სრული სახელი"
          {...register("fullname", {
            required: "სახელი აუცილებელია",
            minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
            onChange: (e) => {
              e.target.value = filterGeorgianInput(e.target.value);
            },
          })}
        />
        {errors.fullname && <p className={styles.error}>{errors.fullname.message}</p>}
      </div>

      {/* Phone input */}
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="ტელეფონი"
          {...register("phone", {
            required: "ტელეფონის ნომერი აუცილებელია",
            pattern: {
              value: /^[0-9]{9}$/,
              message: "ნომერი უნდა შეიცავდეს ზუსტად 9 ციფრს",
            },
          })}
        />
        {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
      </div>

      {/* Textarea */}
      <div className={styles.formGroup}>
        <textarea
          placeholder="შეტყობინება"
          rows={8}
          {...register("message", {
            required: "შეტყობინება აუცილებელია",
            minLength: { value: 5, message: "მინიმუმ 5 სიმბოლო" },
            pattern: {
              value: /^[\u10A0-\u10FF0-9,.?!\s]+$/,
              message: "მხოლოდ ქართული ასოები, რიცხვები და ,.?! სიმბოლოები",
            },
            onChange: (e) => {
              e.target.value = filterGeorgianInput(e.target.value);
            },
          })}
        />
        {errors.message && <p className={styles.error}>{errors.message.message}</p>}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "გაგზავნა..." : "გაგზავნა"}
      </button>

      {responseMessage && <p className={styles.response}>{responseMessage}</p>}
    </form>
  );
}
