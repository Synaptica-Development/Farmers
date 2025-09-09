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
  const [userFullInfo, setUserFullInfo] = useState<FarmerFullInfo | null>(null);

  console.log(userFullInfo,  id)


  useEffect(() => {
    if (!id) return;

    api.get(`/api/Farmer/farmer-details?UID=${id}`)
      .then((res) => {
        console.log(res.data)
        setUserFullInfo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching fullInfo:", err);
      });
  }, [id]);

  if (!userFullInfo) return;

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <h1>{userFullInfo.name}ს საწარმო</h1>
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
        <FarmerDetailProducts userId={id}/>
      </div>
    </>
  );
}
