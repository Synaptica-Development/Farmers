'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import api from '@/lib/axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderID: string;
  productID: string;
  productName: string;
  location: string | null;
  price: number;
  orderCreationDate: string;
  status: number;
  count: number;
}

const statusMap: Record<number, { text: string; className: string }> = {
  0: { text: 'ახალი შეკვეთა', className: styles.waiting },
  1: { text: 'შეკვეთლი', className: styles.active },
  2: { text: 'უარყოფილი', className: styles.notactive },
  3: { text: 'მიღებული', className: styles.active },
};

const sortOptions: { value: number; label: string }[] = [
  { value: 0, label: 'დაალაგე' },
  { value: 1, label: 'სტატუსით' },
  { value: 2, label: 'ფასის ზრდადობით' },
  { value: 3, label: 'ფასის კლებადობით' },
  { value: 4, label: 'თარიღის ზრდადობით' },
  { value: 5, label: 'თარიღის კლებადობით' },
];

export default function MyPurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [selectedSort, setSelectedSort] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    api
      .get(`/api/Farmer/orders?page=${currentPage}&pageSize=10`)
      .then((res) => {
        setOrders(res.data.orders || []);
        setMaxPage(res.data.maxPageCount || 1);
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
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <div className={styles.headerWrapper}>
          <h1>შეკვეთები</h1>

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
          <div className={styles.contentInner}>
            <div className={styles.contentHeader}>
              <p>ID</p>
              <p>თარიღი</p>
              <p>ლოკაცია</p>
              <p>პროდუქტი</p>
              <p>რაოდ.</p>
              <p>ფასი</p>
              <p>სტატუსი</p>
            </div>

            <div className={styles.contentItem}>
              {orders && orders.length > 0 ? (
                orders.map((order, index) => {
                  const status = statusMap[order.status] || { text: 'უცნობი', className: '' };

                  return (
                    <div
                      key={order.id || index}
                      className={styles.licenseEntry}
                      onClick={() => router.push(`/farmer/orders/${order.id}`)}
                      tabIndex={0}
                      role="button"
                    >
                      <p># {order.orderID}</p>
                      <p>{order.orderCreationDate}</p>
                      <p>{order.location || 'ვერ მოიძებნა'}</p>
                      <p>{order.productName}</p>
                      <p>{order.count}</p>
                      <p>{order.price} ₾</p>
                      <p className={status.className}>{status.text}</p>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noData}>
                  თქვენ არ გაქვთ შეკვეთები
                </div>
              )}
            </div>

          </div>
        </div>

        <div className={styles.paginationWrapper}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            <Image
              src={currentPage === 1 ? '/arrowLeftDisabled.svg' : '/arrowLeftActive.svg'}
              alt="Previous"
              width={36}
              height={36}
            />
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: maxPage }, (_, i) => i + 1)?.map((page) => (
              <button
                key={page}
                className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button onClick={handleNext} disabled={currentPage === maxPage}>
            <Image
              src={currentPage === maxPage ? '/arrowRightDisabled.svg' : '/arrowRightActive.svg'}
              alt="Next"
              width={36}
              height={36}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
