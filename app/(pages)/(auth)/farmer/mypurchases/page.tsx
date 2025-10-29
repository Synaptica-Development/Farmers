'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import api from '@/lib/axios';
import Image from 'next/image';
import AddCommentOnProductPopUp from '@/app/components/AddCommentOnProductPopUp/AddCommentOnProductPopUp';
import PurchaseGrid from '@/app/components/PurchaseGrid/PurchaseGrid';

interface Order {
  orderID: string;
  productID: string;
  productName: string;
  location: string | null;
  grammage: string;
  price: number;
  orderDate: string;
  status: number;
  imageLink: string;
  quantity: number;
  farmName?: string;
  farmerID?: string;
  canComment: boolean;
}

const statusMap: Record<number, { text: string; className: string }> = {
  0: { text: 'შეკვეთლი', className: styles.notactive },
  1: { text: 'შეკვეთლი', className: styles.notactive },
  2: { text: 'უარყოფილი', className: styles.notactive },
  3: { text: 'გაგზავნილი', className: styles.waiting },
  4: { text: 'ჩაბარებული', className: styles.active },
};

const sortOptions = [
  { value: 0, label: 'დაალაგე' },
  { value: 1, label: 'სტატუსით' },
  { value: 2, label: 'ფასის ზრდადობით' },
  { value: 3, label: 'ფასის კლებადობით' },
  { value: 4, label: 'თარიღის ზრდადობით' },
  { value: 5, label: 'თარიღის კლებადობით' },
];

export default function MyPurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProductID, setSelectedProductID] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchOrders = () => {
    api
      .get(`/user/orders/myorders?page=${currentPage}&pageSize=10&orderBy=${selectedSort}`)
      .then((res) => {
        setOrders(res.data.orders || []);
        setMaxPage(res.data.maxPageCount || 1);
      })
      .catch((err) => console.error('Error fetching orders:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, selectedSort]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 0);
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < maxPage ? prev + 1 : prev));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (currentPage > 1 + delta) {
      pages.push(1);
      if (currentPage > 2 + delta) {
        pages.push('...');
      }
    }

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(maxPage, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < maxPage - delta) {
      if (currentPage < maxPage - delta - 1) {
        pages.push('...');
      }
      pages.push(maxPage);
    }

    return pages;
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
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.content} ref={contentRef}>
        <div className={`${styles.contentHeader} ${isScrolled ? styles.scrolledHeader : ''}`}>
          <p>შეკვეთის ID</p>
          <p>დასახელება</p>
          <p>ლოკაცია</p>
          <p>თარიღი</p>
          <p>ოდენ.</p>
          <p>ჯამი</p>
          <p>საწარმო</p>
          <p>სტატუსი</p>
          <p> </p>
        </div>

        <div className={styles.contentItem}>
          {orders && orders.length > 0 ? (
            orders.map((order) => {
              const status = statusMap[order.status] || { text: 'უცნობი', className: '' };

              return (
                <div
                  key={order.orderID}
                  className={styles.licenseEntry}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedProductID(order.productID);
                      setIsPopupOpen(true);
                    }
                  }}
                >
                  <p>{order.orderID}</p>

                  <Link
                    href={`/product/${order.productID}`}
                    className={styles.productLink}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {order.productName}
                  </Link>


                  <p>{order.location || 'უცნობია'}</p>
                  <p>{order.orderDate}</p>
                  <p>{order.quantity}</p>
                  <p>{order.price} ₾</p>
                  {order.farmName && order.farmerID && (
                    <Link
                      href={`/farmerProfile/${order.farmerID}`}
                      className={styles.productLink}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {order.farmName}
                    </Link>
                  )}
                  <p className={status.className}>{status.text}</p>

                  <div>
                    {order.canComment && (
                      <p
                        className={styles.viewDetales}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductID(order.productID);
                          setIsPopupOpen(true);
                        }}
                      >
                        შეაფასე
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noData}>
              თქვენ არ გაქვთ შესყიდული პროდუქცია
            </div>
          )}
        </div>
      </div>

      <div className={styles.gridCards}>
        <PurchaseGrid
          orders={orders}
          statusMap={statusMap}
          onRate={() => {
            setIsPopupOpen(true);
          }}
        />
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
          {getPageNumbers().map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                className={`${styles.pageNumber} ${page === currentPage ? styles.activePage : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className={styles.ellipsis}>
                {page}
              </span>
            )
          )}
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

      {isPopupOpen && (
        <AddCommentOnProductPopUp
          productID={selectedProductID}
          onClose={() => setIsPopupOpen(false)}
          onCommentSuccess={fetchOrders}
        />
      )}
    </div>
  );
}
