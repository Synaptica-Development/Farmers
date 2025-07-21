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
                console.log(res.data.licenses)
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

    return (
        <div className={styles.wrapper}>
            <div className={styles.headerWrapper}>
                <h1>ლიცენზიები</h1>
                <ReusableButton title={"დაამატე"} size="normal" />
            </div>

            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    <p>კატეგორია</p>
                    <p>ქვეკატეგორია</p>
                    <p>ჯიში/სახეობა</p>
                    <p>სტატუსი</p>
                </div>

                <div className={styles.contentItem}>
                    {licenses.map((license, index) => (
                        <div key={index} className={styles.licenseEntry}>
                            <p>{license.category}</p>
                            <p>{license.subCategory}</p>
                            <p>{license.subSubCategory}</p>
                            <p className={license.status === 1 ?styles.negative : styles.positive}>
                                {license.status === 1 ? "უარყოფითი" : "დადებითი"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.paginationWrapper}>
                <button onClick={handlePrev} disabled={currentPage === 1}>
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
                            className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ""
                                }`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button onClick={handleNext} disabled={currentPage === maxPage}>
                    <Image
                        src={currentPage === maxPage ? "/arrowRightDisabled.svg" : "/arrowRightActive.svg"}
                        alt="Next"
                        width={36}
                        height={36}
                    />
                </button>
            </div>
        </div>
    );
}
