'use client';

import Header from "@/app/components/Header/Header";
import Link from "next/link";
import styles from "./page.module.scss";
import FooterComponent from "@/app/components/FooterComponent/FooterComponent";
import ContactForm from "@/app/components/ContactForm/ContactForm";

interface ContactItem {
  id: string;
  icon: string;
  label: string;
  href?: string;
}

const contacts: ContactItem[] = [
  {
    id: "location",
    icon: "/greenLocation.svg",
    label: "თბილისი, საქართველო",
  },
  {
    id: "email",
    icon: "/greenEmail.svg",
    label: "example@gmail.com",
    href: "mailto:example@gmail.com",
  },
  {
    id: "phone",
    icon: "/greenPhone.svg",
    label: "+995 599 123 456",
    href: "tel:+995599123456",
  },
  {
    id: "facebook",
    icon: "/greenEmail.svg",
    label: "Facebook",
    href: "https://facebook.com/yourpage",
  },
  {
    id: "youtube",
    icon: "/greenEmail.svg",
    label: "YouTube",
    href: "https://youtube.com/yourchannel",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <h1>კონტაქტი</h1>

        <div className={styles.content}>
          <div className={styles.contactInfoWrapper}>
            <div className={styles.contactInfo}>
              {contacts.map((item) => (
                <div key={item.id} className={styles.contactInfoItem}>
                  {item.href ? (
                    <Link href={item.href} target="_blank" className={styles.contactRow}>
                      <img src={item.icon} alt={item.label} />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <div className={styles.contactRow}>
                      <img src={item.icon} alt={item.label} />
                      <span>{item.label}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
