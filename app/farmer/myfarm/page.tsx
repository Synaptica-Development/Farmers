'use client';

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import FarmerMyProducts from "@/app/components/FarmerMyProducts/FarmerMyProducts";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import BecomeFarmer from "@/app/components/BecomeFarmer/BecomeFarmer";

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

  const role = Cookies.get("role");
  console.log("Role from cookie:", role);

  useEffect(() => {
    api.get('/user/profile/me')
      .then(res => setUser(res.data))
      .catch(err => console.log("error: ", err));
      const role = Cookies.get("role");
  console.log("Role from cookie:", role);
  }, []);

  return (
    <div className={styles.wrapper}>
      <BecomeFarmer/>
      {/* {user && (
        <>
          <h1>ჩემი ფერმა</h1>

          <div className={styles.sectionsWrapper}>
            <FarmerMyProducts id={user.id} />
          </div>
        </>
      )} */}
    </div>
  );
}
