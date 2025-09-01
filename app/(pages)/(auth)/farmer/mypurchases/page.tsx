'use client';

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import api from "@/lib/axios";
import Image from "next/image";
import AddCommentOnProductPopUp from "@/app/components/AddCommentOnProductPopUp/AddCommentOnProductPopUp";

interface Order {
    orderID: string;
    productID: string;
    productName: string;
    location: string | null;
    price: number;
    orderDate: string;
    status: number;
}

const statusMap: Record<number, { text: string; className: string }> = {
    0: { text: 'მოლოდინში', className: styles.waiting },
    1: { text: 'შეკვეთილი', className: styles.active },
    2: { text: 'უარყოფილი', className: styles.notactive },
};

const sortOptions: { value: number; label: string }[] = [
    { value: 0, label: "დაალაგე" },
    { value: 1, label: "სტატუსით" },
    { value: 2, label: "ფასის ზრდადობით" },
    { value: 3, label: "ფასის კლებადობით" },
    { value: 4, label: "თარიღის ზრდადობით" },
    { value: 5, label: "თარიღის კლებადობით" },
];

export default function MyPurchasesPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [selectedSort, setSelectedSort] = useState<number>(0);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [selectedProductID, setSelectedProductID] = useState<string | null>(null);


    useEffect(() => {
        api
            .get(`/user/orders/myorders?page=${currentPage}&pageSize=5&orderBy=${selectedSort}`)
            .then((res) => {
                setOrders(res.data.orders || []);
                setMaxPage(res.data.maxPageCount || 1);
                console.log('fetching orders:', res.data);
            })
            .catch((err) => {
                console.error('Error fetching orders:', err);
            });
    }, [currentPage, selectedSort]);


    const handlePrev = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev < maxPage ? prev + 1 : prev));
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.headerWrapper}>
                <h1>ნაყიდი პროდუქტები</h1>
                <select
                    className={styles.sortDropdown}
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(Number(e.target.value))}
                >
                    {sortOptions?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.content}>
                <div className={styles.contentHeader}>
                    <p>დასახელება</p>
                    <p>ლოკაცია</p>
                    <p>თარიღი</p>
                    <p>ჯამი</p>
                    <p>სტატუსი</p>
                    <p>შეკვეთის ID</p>
                </div>

                <div className={styles.contentItem}>
                    {orders?.map((order, index) => {
                        const status = statusMap[order.status] || {
                            text: "უცნობი",
                            className: "",
                        };

                        return (
                            <div key={index} className={styles.licenseEntry}>
                                <p>{order.productName}</p>
                                <p>{order.location || 'უცნობია'} </p>
                                <p>{order.orderDate}</p>
                                <p>{order.price} ₾</p>
                                <p className={status.className}>{status.text}</p>
                                <p># {order.orderID}</p>
                                <div className={styles.actionsWrapper}>
                                    <p className={styles.viewDetales}>დეტალები</p>
                                    <p
                                        className={styles.viewDetales}
                                        onClick={() => {
                                            setSelectedProductID(order.productID);
                                            setIsPopupOpen(true);
                                        }}
                                    >
                                        კომენტარი
                                    </p>
                                </div>
                            </div>
                        );
                    })}
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
                    {Array.from({ length: maxPage }, (_, i) => i + 1)?.map((page) => (
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
            {isPopupOpen && (
                <AddCommentOnProductPopUp  productID={selectedProductID} onClose={() => setIsPopupOpen(false)} />
            )}

        </div>
    );
}
