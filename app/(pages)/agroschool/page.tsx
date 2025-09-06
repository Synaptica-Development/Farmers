'use client';

import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch("https://api.staging.natsarmi.ge/api/AgroSchool/agroschool")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        if (json.length > 0) setSelected(json[0]); // select first by default
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        <h1>აგრო სკოლა</h1>

        <div className={styles.content}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {loading && <p>იტვირთება...</p>}
            {!loading &&
              data.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`${styles.sidebarItem} ${selected?.id === item.id ? styles.active : ""
                    }`}
                >
                  <p>{item.title}</p>
                </div>
              ))}
          </aside>

          <div className={styles.details}>
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
