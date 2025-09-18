'use client';

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
    image1: string;
}

interface PurchaseGridProps {
    orders: Order[];
    onRate: (productID: string, type: 'details' | 'rate') => void;
    statusMap: Record<number, { text: string; className: string }>;
}

const PurchaseGrid = ({ orders, onRate, statusMap }: PurchaseGridProps) => {
    return (
        <div className={styles.gridWrapper}>
            {orders?.map((order) => {
                const status = statusMap[order.status] || { text: 'უცნობი', className: '' };

                return (
                    <div key={order.orderID} className={styles.card}>
                        <div className={styles.topRow}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={`${BASE_URL}${order.image1}`}
                                    alt={order.productName}
                                    className={styles.productImage}
                                />
                            </div>

                            <div className={styles.infoWrapper}>
                                <p className={`${styles.status} ${status.className}`}>
                                    {status.text}
                                </p>
                                <h3>{order.productName}</h3>
                                <div className={styles.priceAndDate}>
                                    <p className={styles.price}>{order.price}₾</p>
                                    <p className={styles.date}>{order.orderDate}</p>
                                </div>
                                <p className={styles.orderId}>ID: #{order.orderID}</p>
                            </div>
                        </div>

                        <div className={styles.buttonsWrapper}>
                            <button
                                className={styles.actionBtn}
                                onClick={() => onRate(order.productID, 'details')}
                            >
                                დეტალები
                            </button>
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
