"use client";

import Header from "@/app/components/Header/Header";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import styles from './page.module.scss';
import FarmerDetails from "@/app/components/FarmerDetails/FarmerDetails";
import FarmerVideo from "@/app/components/FarmerVideo/FarmerVideo";
import FarmerDetailsDescription from "@/app/components/FarmerDetailsDescription/FarmerDetailsDescription";
import FarmerDetailProducts from "@/app/components/FarmerDetailProducts/FarmerDetailProducts";

interface Props {
  params: Promise<{ id: string }>;
}

interface FarmerFullInfo {
  name: string;
  lastName: string;
  description: string;
  videoLink: string;
  location: string;
  licenseIcons: string[];
}

export default function FarmerProfilePage({ params }: Props) {
  const { id } = React.use(params);
  console.log(id)
  const [userId, setUserId] = useState<string>("");
  const [userFullInfo, setUserFullInfo] = useState<FarmerFullInfo | null>(null);

  console.log(userFullInfo,  userId)
  useEffect(() => {
    api.get("/user/profile/me")
      .then((res) => {
        setUserId(res.data.id);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, []);

  useEffect(() => {
    if (!userId) return;

    api.get(`/api/Farmer/farmer-details?UID=${userId}`)
      .then((res) => {
        console.log(res.data)
        setUserFullInfo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching fullInfo:", err);
      });
  }, [userId]);

  if (!userFullInfo) return;

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <h1>{userFullInfo.name}ს ფერმა</h1>
        <div className={styles.uppercontent}>
          <FarmerDetails
            name={userFullInfo.name}
            lastName={userFullInfo.lastName}
            location={userFullInfo.location}
            licenseIcons={userFullInfo.licenseIcons}
          />
        
          <FarmerVideo videoLink={userFullInfo.videoLink} />

          <FarmerDetailsDescription description={userFullInfo.description}/>

        </div>
        <FarmerDetailProducts userId={userId}/>
      </div>
    </>
  );
}
