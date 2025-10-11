'use client';

import { useEffect, useState, useRef } from "react";
import Header from "@/app/components/Header/Header";
import FooterComponent from "@/app/components/FooterComponent/FooterComponent";
import styles from "./page.module.scss";
import BASE_URL from "@/app/config/api";

interface AgroSchoolItem {
  id: string;
  title: string;
  description: string;
  videoLink?: string | null;
  imageLink?: string | null;
}

export default function ContactPage() {
  const [data, setData] = useState<AgroSchoolItem[]>([]);
  const [selected, setSelected] = useState<AgroSchoolItem | null>(null);
  const [loading, setLoading] = useState(true);
  const detailsRef = useRef<HTMLDivElement>(null);  

  useEffect(() => {
    fetch("/api/AgroSchool/agroschool")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        if (json.length > 0) setSelected(json[0]); 
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

const handleSelect = (item: AgroSchoolItem) => {
  setSelected(item);

  if (window.innerWidth < 768 && detailsRef.current) {
    const headerOffset = 80; 
    const elementPosition =
      detailsRef.current.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};


  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        <h1>აგრო სკოლა</h1>

        <div className={styles.content}>
          <aside className={styles.sidebar}>
            {loading && <p>იტვირთება...</p>}
            {!loading &&
              data.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}   
                  className={`${styles.sidebarItem} ${
                    selected?.id === item.id ? styles.active : ""
                  }`}
                >
                  <p>{item.title}</p>
                </div>
              ))}
          </aside>

          <div ref={detailsRef} className={styles.details}>   
            {selected && (
              <div className={styles.detailsContent}>
                {selected.videoLink ? (
                  <div className={styles.mediaWrapper}>
                    <iframe
                      src={selected.videoLink.replace("watch?v=", "embed/")}
                      title={selected.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : selected.imageLink ? (
                  <div className={styles.mediaWrapper}>
                    <img
                      src={`${BASE_URL}${selected.imageLink}`}
                      alt={selected.title}
                    />
                  </div>
                ) : null}
                <p>{selected.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
}
