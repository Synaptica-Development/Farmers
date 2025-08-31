'use client'

import { useEffect, useMemo, useState } from "react";
// import styles from './page.module.scss'
import api from "@/lib/axios";
import BASE_URL from "../config/api";
import Header from "../components/Header/Header";
import Advertisements from "../components/Advertisements/Advertisements";
import ProductsSlider from "../components/ProductsSlider/ProductsSlider";
import Categories from "../components/Categories/Categories";
import FooterComponent from "../components/FooterComponent/FooterComponent";
// import AddCommentOnProductPopUp from "../components/AddCommentOnProductPopUp/AddCommentOnProductPopUp";

interface Category {
  id: number;
  name: string;
  imgLink: string;
}

interface Banner {
  id: string;
  title: string;
  imgLink: string;
  sectionID: number;
}

const SLIDER_COUNT = 3;

export default function Home() {
  console.log('base url:', BASE_URL);

  const [categoryIDs, setCategoryIDs] = useState<number[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  // const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    api.get<Category[]>('/Categories')
      .then(res => setCategoryIDs(res.data.map(c => c.id)))
      .catch(err => console.error('Categories fetch error:', err));

    api.get<Banner[]>('/api/Banner/banners')
      .then(res => setBanners(res.data))
      .catch(err => console.error('Banners fetch error:', err));
  }, []);

  const randomIDs = useMemo(() => {
    if (categoryIDs.length < SLIDER_COUNT) return [];
    const shuffled = [...categoryIDs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, SLIDER_COUNT);
  }, [categoryIDs]);

  if (randomIDs.length < SLIDER_COUNT) return null;

  return (
    <div>
      {/* <p className={styles.viewDetales} onClick={() => setIsPopupOpen(true)}>
        დეტალები
      </p> */}
      <Header />
      <Categories />

      <Advertisements banners={banners.slice(0, 5)} />

      <ProductsSlider categoryId={randomIDs[0]} />
      <ProductsSlider categoryId={randomIDs[1]} />

      <div style={{ marginTop: '24px' }}>
        <Advertisements banners={banners.slice(5, 10)} />
      </div>

      <ProductsSlider categoryId={randomIDs[2]} />
      <div style={{ marginTop: '90px' }}>
        <FooterComponent />
      </div>
      {/* {isPopupOpen && (
        <AddCommentOnProductPopUp onClose={() => setIsPopupOpen(false)}/>
      )} */}
    </div>
  );
}
