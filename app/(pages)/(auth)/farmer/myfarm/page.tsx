'use client';

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import FarmerMyProducts from "@/app/components/FarmerMyProducts/FarmerMyProducts";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import BecomeFarmer from "@/app/components/BecomeFarmer/BecomeFarmer";
import FarmerDetails from "@/app/components/FarmerDetails/FarmerDetails";
import FarmerVideo from "@/app/components/FarmerVideo/FarmerVideo";
import FarmerDetailsDescription from "@/app/components/FarmerDetailsDescription/FarmerDetailsDescription";

interface UserProfile {
  id: string;
  userName: string;
  phoneNumber: string;
  profileImgLink: string | null;
  email: string | null;
  role: number;
}

interface FarmerInfo {
  name: string;
  lastName: string;
  location: string;
  income: string;
  licenseIcons: string[];
  videoLink: string;
  description: string;
}

export default function MyFarmPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userFullInfo, setUserFullInfo] = useState<FarmerInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch basic user info
        const res = await api.get('/user/profile/me');
        const userData = res.data;
        setUser(userData);

        // 2️⃣ Fetch farmer details
        if (userData?.id) {
          const farmerRes = await api.get(`/api/Farmer/farmer-details`, {
            params: { UID: userData.id },
          });
          console.log("Farmer details:", farmerRes.data);

          // Save the full info
          setUserFullInfo(farmerRes.data);
        } else {
          console.warn("Invalid or missing UID:", userData?.id);
        }
      } catch (err) {
        console.error("Error fetching user or farmer details:", err);
      }

      // 3️⃣ Get role from cookies
      const cookieRole = Cookies.get("role");
      setRole(cookieRole ?? null);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      {role === "Farmer" && user ? (
        <>
          <h1>ჩემი საწარმო</h1>

          {userFullInfo && (
            <div className={styles.uppercontent}>
              <FarmerDetails
                name={userFullInfo.name}
                lastName={userFullInfo.lastName}
                location={userFullInfo.location}
                income={userFullInfo.income}
                licenseIcons={userFullInfo.licenseIcons}
              />

              <FarmerVideo videoLink={userFullInfo.videoLink} />
            </div>
          )}
          {userFullInfo && (
            <div className={styles.descriptionWrapper}>
              <FarmerDetailsDescription
                description={userFullInfo.description}
              />
            </div>
          )}


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
