"use client";

import Header from "@/app/components/Header/Header";
import styles from "./page.module.scss";
import SubProductsContent from "@/app/components/SubProductsContent/SubProductsContent";
import ProductSidebar from "@/app/components/ProductSidebar/ProductSidebar";

export default function Subproducts() {
  return (
    <div>
      <Header />
      <div className={styles.contantWrapper}>
        <ProductSidebar />
        <SubProductsContent />
      </div>
    </div>
  );
}
