'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.scss';
import api from '@/lib/axios';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  sectionID: number;
  videoLink: string;
}

export default function FaqClient() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const faqIdFromUrl = searchParams.get('id');

  useEffect(() => {
    api.get('/api/Banner/FAQ')
      .then((res) => {
        setFaqs(res.data);
        if (faqIdFromUrl) {
          const matched = res.data.find(
            (faq: FAQItem) => String(faq.sectionID) === faqIdFromUrl
          );
          if (matched) {
            setOpenId(matched.id);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [faqIdFromUrl]);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const getYoutubeId = (url: string) => {
    try {
      const u = new URL(url);
      if (u.hostname === 'youtu.be') return u.pathname.slice(1);
      if (u.searchParams.get('v')) return u.searchParams.get('v')!;
      if (u.pathname.includes('/embed/')) return u.pathname.split('/embed/')[1];
      return '';
    } catch {
      return '';
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1>ხშირად დასმული შეკითხვები</h1>

      <div className={styles.content}>
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className={`${styles.faqItem} ${
              openId === faq.id ? styles.openItem : ''
            }`}
          >
            <div
              className={`${styles.faqHeader} ${
                openId === faq.id ? styles.openHeader : ''
              }`}
              onClick={() => toggleFAQ(faq.id)}
            >
              <p>{faq.question}</p>
              <img
                src="/dropDownArrow.svg"
                alt="arrow"
                className={`${styles.arrow} ${
                  openId === faq.id ? styles.open : ''
                }`}
              />
            </div>

            <div
              className={`${styles.faqBody} ${
                openId === faq.id ? styles.show : ''
              }`}
            >
              {faq.videoLink && (
                <div className={styles.videoWrapper}>
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${getYoutubeId(
                      faq.videoLink
                    )}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <p className={styles.faqText} >{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
