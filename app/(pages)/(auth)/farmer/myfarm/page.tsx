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
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/user/profile/me');
        const userData = res.data;
        setUser(userData);

        if (userData?.id) {
          const farmerRes = await api.get(`/api/Farmer/farmer-details`, {
            params: { UID: userData.id },
          });
          console.log("Farmer details:", farmerRes.data);
        } else {
          console.warn("Invalid or missing UID:", userData?.id);
        }
      } catch (err) {
        console.error("Error fetching user or farmer details:", err);
      }

      const cookieRole = Cookies.get("role");
      setRole(cookieRole ?? null);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      {role === 'Farmer' && user ? (
        <>
          <h1>ჩემი საწარმო</h1>
          <div className={styles.sectionsWrapper}>
            <FarmerMyProducts id={user.id} />
          </div>
        </>
      ) : (
        <BecomeFarmer setRole={setRole} />
      )}
    </div>
  );
}
