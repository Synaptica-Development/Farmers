'use client';

import Link from 'next/link';
import styles from './PurchaseGrid.module.scss';
import BASE_URL from '@/app/config/api';

interface Order {
    orderID: string;
    productID: string;
    productName: string;
    location: string | null;
    price: number;
    orderDate: string;
    status: number;
    grammage: string;
    imageLink: string;
    quantity: number;
    farmName: string;
    farmerID: string;
}

interface PurchaseGridProps {
    orders: Order[];
    onRate: (productID: string, type: 'rate') => void;
    statusMap: Record<number, { text: string; className: string }>;
}

const PurchaseGrid = ({ orders, onRate, statusMap }: PurchaseGridProps) => {
    return (
        <div className={styles.gridWrapper}>
            {orders?.map((order) => {
                const status = statusMap[order.status] || { text: 'უცნობი', className: '' };

                return (
                    <div key={order.orderID} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <img
                                src={`${BASE_URL}${order.imageLink}`}
                                alt={order.productName}
                                className={styles.productImage}
                            />
                        </div>

                        <div className={styles.infoWrapper}>
                            <div className={styles.titles}>
                                <p className={`${styles.status} ${status.className}`}>{status.text}</p>
                                <p className={styles.date}>{order.orderDate}</p>
                            </div>
                            <Link href={`/product/${order.productID}`}>{order.productName}</Link>
                            <div className={styles.priceAndGrammage}>
                                <div>
                                    <p className={styles.price}>{order.price}₾ </p>
                                    <span>/</span>
                                    <p className={styles.grammage}> {order.quantity} {order.grammage}</p>
                                </div>
                                <p className={styles.orderId}>ID:{order.orderID}</p>
                            </div>
                            <Link href={`/farmerProfile/${order.farmerID}`} className={styles.farmerName}>{order.farmName}</Link>
                            <button
                                className={styles.actionBtn}
                                onClick={() => onRate(order.productID, 'rate')}
                            >
                                შეაფასე
                            </button>
                        </div>

                    </div>
                );
            })}
        </div>
    );
};

export default PurchaseGrid;
