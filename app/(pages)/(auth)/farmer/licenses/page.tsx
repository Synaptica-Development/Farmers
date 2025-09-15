'use client';

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import api from "@/lib/axios";
import ReusableButton from "@/app/components/ReusableButton/ReusableButton";
import Image from "next/image";

interface License {
  subCategory: string;
  category: string;
  subSubCategory: string;
  status: number;
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    api.get(`/api/Farmer/licenses?page=${currentPage}&pageSize=5`)
      .then((res) => {
        setLicenses(res.data.licenses || []);
        setMaxPage(res.data.maxPageCount || 1);
      })
      .catch((err) => {
        console.error("Error fetching licenses:", err);
      });
  }, [currentPage]);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < maxPage ? prev + 1 : prev));
  };

  const statusMap: Record<number, { text: string; className: string }> = {
    0: { text: "უარყოფითი", className: styles.negative },
    1: { text: "მოლოდინში", className: styles.waiting },
    2: { text: "დადებითი", className: styles.positive },
  };

  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <div className={styles.headerWrapper}>
          <h1>ლიცენზიები</h1>
          <ReusableButton title={"ლიცენზიის მოთხოვნა"} size="normal" link="/farmer/licenses/addlicense" />
        </div>

        <div className={styles.content}>
          <div className={styles.tableScroll}>
            <div className={styles.tableInner}>
              <div className={styles.contentHeader}>
                <p>კატეგორია</p>
                <p>ქვეკატეგორია</p>
                <p>ჯიში/სახეობა</p>
                <p>სტატუსი</p>
              </div>

              <div className={styles.contentItem}>
                {licenses.map((license, index) => {
                  const status = statusMap[license.status] || {
                    text: "უცნობი",
                    className: "",
                  };

                  return (
                    <div key={index} className={styles.licenseEntry}>
                      <p>{license.category}</p>
                      <p>{license.subCategory}</p>
                      <p>{license.subSubCategory}</p>
                      <p className={status.className}>{status.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.paginationWrapper}>
            <button onClick={handlePrev} disabled={currentPage === 1} aria-label="Previous page">
              <Image
                src={currentPage === 1 ? "/arrowLeftDisabled.svg" : "/arrowLeftActive.svg"}
                alt="Previous"
                width={36}
                height={36}
              />
            </button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: maxPage }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ""}`}
                  onClick={() => setCurrentPage(page)}
                  aria-current={page === currentPage ? "true" : undefined}
                >
                  {page}
                </button>
              ))}
            </div>

            <button onClick={handleNext} disabled={currentPage === maxPage} aria-label="Next page">
              <Image
                src={currentPage === maxPage ? "/arrowRightDisabled.svg" : "/arrowRightActive.svg"}
                alt="Next"
                width={36}
                height={36}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
