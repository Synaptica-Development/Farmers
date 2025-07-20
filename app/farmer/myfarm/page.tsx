'use client';

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import FarmerMyProducts from "@/app/components/FarmerMyProducts/FarmerMyProducts";
import api from "@/lib/axios";

interface UserProfile {
  id: string;
  userName: string;
  phoneNumber: string;
  profileImgLink: string | null;
  email: string | null;
  role: number;
}

export default function MyFarmPage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    api.get('/user/profile/me')
      .then(res => setUser(res.data))
      .catch(err => console.log("error: ", err));
  }, []);

  return (
    <div className={styles.wrapper}>
      {user && (
        <>
          <h1>ჩემი ფერმა</h1>

          <div className={styles.sectionsWrapper}>
            <FarmerMyProducts id={user.id} />
          </div>
        </>
      )}
    </div>
  );
}
