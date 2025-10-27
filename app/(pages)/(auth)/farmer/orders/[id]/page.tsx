'use client';

import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from "./page.module.scss"
import ReusableButton from '@/app/components/ReusableButton/ReusableButton';
import toast from 'react-hot-toast';
import { useProfileSidebarStore } from '@/lib/store/useProfileSidebarStore';


interface OrderDetails {
    buyerPhoneNumber: string;
    buyerName: string;
    buyerAdress: string | null;
    category: string;
    count: number;
    farmID: string;
    id: string;
    orderCreationDate: string;
    orderID: string;
    orderResponseDate: string | null;
    price: number;
    productID: string;
    status: number;
    subCategory: string;
    subSubCategory: string;
    grammage: string;
}



export default function OrderDetailPage() {
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const { fetchSidebarCounts } = useProfileSidebarStore();

    const params = useParams();
    const id = params?.id;
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        api.get("/api/Farmer/order-details", {
            params: {
                orderID: id,
            },
        })
            .then((response) => {
                setOrder(response.data);
                fetchSidebarCounts();
                console.log("Order details:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching order details:", error);
            });
    }, [id]);

    const statusMap: Record<number, { text: string; className: string }> = {
        0: { text: 'ახალი შეკვეთა', className: styles.waiting },
        1: { text: 'ჩაბარებულია', className: styles.active },
        2: { text: 'უარყოფილი', className: styles.notactive },
        3: { text: 'გაგზავნილია', className: styles.active },
    };


    if (!order) {
        return <div className={styles.wrapper}><h1>Loading...</h1></div>;
    }


    const handleStatusChange = async (status: number) => {
        if (!order?.orderID) return;

        try {
            await api.put("/api/Farmer/order-status-change", null, {
                params: {
                    orderID: order.id,
                    status,
                },
            });
            toast.success("შეკვეთის სტატუსი წარმატებით შეიცვალა");
            setOrder((prev) => prev ? { ...prev, status } : prev);
            router.push("/farmer/orders");
        } catch (error) {
            console.error("Status update failed:", error);
            toast.error("სტატუსის შეცვლა ვერ მოხერხდა");
        }
    };


    return (
        <div className={styles.background}>
            <div className={styles.wrapper}>
                <h1>შეკვეთა № : {order.orderID}</h1>
                <div className={styles.contentWrapper}>
                    <div className={styles.orderTitles}>
                        <p>მყიდველის ტელეფონი</p>
                        <p>მყიდველის ლოკაცია</p>
                        <p>მყიდველი სახელი</p>
                        <p>შეკვეთის თარიღი</p>
                        <p>პროდუქტის კატეგორია</p>
                        <p>პროდუქტის ქვე კატეგორია</p>
                        <p>პროდუქტის ჯიში/სახეობა</p>
                        <p>გაგზავნის თარიღი</p>
                        <p>რაოდენობა</p>
                        <p>ფასი</p>
                        <p>სტატუსი</p>
                    </div>
                    <div className={styles.orderDetales}>
                        <div className={styles.orderDetales}>
                            <p>{order.buyerPhoneNumber || "ვერ მოიძებნა"}</p>
                            <p>{order.buyerAdress || "ვერ მოიძებნა"}</p>
                            <p>{order.buyerName || "ვერ მოიძებნა"}</p>
                            <p>{order.orderCreationDate?.split("T")[0] || "ვერ მოიძებნა"}</p>
                            <p>{order.category || "ვერ მოიძებნა"}</p>
                            <p>{order.subCategory || "ვერ მოიძებნა"}</p>
                            <p>{order.subSubCategory || "ვერ მოიძებნა"}</p>
                            <p>{order.orderResponseDate?.split("T")[0] || "ვერ მოიძებნა"}</p>
                            <p>{order.count || 0} {order.grammage}</p>
                            <p>{order.price || 0} ₾</p>
                            <p className={statusMap[order.status]?.className}>
                                {statusMap[order.status]?.text}
                            </p>
                        </div>
                    </div>
                    {/* <div className={styles.buttons}>
                    <ReusableButton
                        title={'დადასტურება'}
                        size='normal'
                        onClick={() => handleStatusChange(1)}
                    />
                    <ReusableButton
                        title={'უარყოფა'}
                        size='normal'
                        deleteButton
                        onClick={() => handleStatusChange(2)}
                    />

                </div> */}
                    <div className={styles.buttons}>
                        {order.status === 0 && (
                            <ReusableButton
                                title="გაგზავნილია"
                                size="normal"
                                onClick={() => {
                                    handleStatusChange(3)
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
