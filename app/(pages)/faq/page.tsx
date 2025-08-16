'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.scss';
import Header from "@/app/components/Header/Header";
import api from '@/lib/axios';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sectionID: number;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const faqIdFromUrl = searchParams.get("id");

  useEffect(() => {
    api.get('/api/Banner/FAQ')
      .then(res => {
        setFaqs(res.data);
        if (faqIdFromUrl) {
          const matched = res.data.find((faq: FAQItem) => String(faq.sectionID) === faqIdFromUrl);
          if (matched) {
            setOpenId(matched.id);
          }
        }
      })
      .catch(err => console.error(err));
  }, [faqIdFromUrl]);

  const toggleFAQ = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <h1>ხშირად დასმული შეკითხვები</h1>

        <div className={styles.content}>
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`${styles.faqItem} ${openId === faq.id ? styles.openItem : ''}`}
            >
              <div
                className={`${styles.faqHeader} ${openId === faq.id ? styles.openHeader : ''}`}
                onClick={() => toggleFAQ(faq.id)}
              >
                <p>{faq.question}</p>
                <img
                  src="/dropDownArrow.svg"
                  alt="arrow"
                  className={`${styles.arrow} ${openId === faq.id ? styles.open : ''}`}
                />
              </div>

              <div className={`${styles.faqBody} ${openId === faq.id ? styles.show : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
