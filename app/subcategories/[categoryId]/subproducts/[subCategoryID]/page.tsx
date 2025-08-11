"use client";

import Header from "@/app/components/Header/Header";
import styles from "./page.module.scss";
import SubProductsContent from "@/app/components/SubProductsContent/SubProductsContent";

export default function Subproducts() {
  return (
    <div>
      <Header />
      <div className={styles.contantWrapper}>
        <div className={styles.sideBar}>sideBar</div>
        <SubProductsContent />
      </div>
    </div>
  );
}
