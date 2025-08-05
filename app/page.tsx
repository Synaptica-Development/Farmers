'use client'

import { useEffect, useMemo, useState } from "react";
import Advertisements from "./components/Advertisements/Advertisements";
import Categories from "./components/Categories/Categories";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import Header from "./components/Header/Header";
import ProductsSlider from "./components/ProductsSlider/ProductsSlider";
import api from "@/lib/axios";
import BASE_URL from "./config/api";
import { toast } from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  imgLink: string;
}

const SLIDER_COUNT = 3;

export default function Home() {
  console.log('base url:', BASE_URL)
  const [categoryIDs, setCategoryIDs] = useState<number[]>([]);

  useEffect(() => {
    api.get<Category[]>('/Categories')
      .then(res => setCategoryIDs(res.data.map(c => c.id)))
      .catch(err => console.error('Categories fetch error:', err));
  }, []);

  const randomIDs = useMemo(() => {
    if (categoryIDs.length < SLIDER_COUNT) return [];
    const shuffled = [...categoryIDs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, SLIDER_COUNT);
  }, [categoryIDs]);

  if (randomIDs.length < SLIDER_COUNT) return null;
  return (
    <div>
      <Header />
      <Categories />
      <Advertisements />
      <ProductsSlider categoryId={randomIDs[0]} />
      <ProductsSlider categoryId={randomIDs[1]} />
      <div style={{ marginTop: '24px' }}><Advertisements /></div>
      <ProductsSlider categoryId={randomIDs[2]} />
      <div style={{ marginTop: '90px' }}><FooterComponent /></div>
    </div>
  );
}
