'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import api from '@/lib/axios';
import NotificationItem from '@/app/components/NotificationItem/NotificationItem';
import Image from 'next/image';

interface Notification {
  id: string;
  title: string;
  creationDate: string;
  markedAsOpen: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [markedNotifications, setMarkedNotifications] = useState<string[]>([]);
  const pageSize = 10;

  useEffect(() => {
    api
      .get(`/user/notifications?page=${currentPage}&pageSize=${pageSize}`)
      .then((res) => {
        setNotifications(res.data.notifications);
        setMaxPage(res.data.maxPageCount);
      })
      .catch((err) => {
        console.error('Failed to fetch notifications:', err);
      });
  }, [currentPage]);

  const toggleMarked = (id: string) => {
    setMarkedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((markedId) => markedId !== id)
        : [...prev, id]
    );
  };

  const handleMarkAllNotification = () => {
    const allIds = notifications?.map((n) => n.id);
    const areAllMarked = allIds.length > 0 && allIds.every((id) => markedNotifications.includes(id));
    if (areAllMarked) {
      setMarkedNotifications([]);
    } else {
      setMarkedNotifications(allIds);
    }
  };

  const handleDeleteClick = () => {
    const confirmed = window.confirm('დარწმუნებული ხარ რომ გინდა ყველა შეტყობინების წაშლა?');
    if (!confirmed) return;

    const queryString = markedNotifications?.map(id => `IDs=${encodeURIComponent(id)}`).join('&');

    api.delete(`/user/delete-notification?${queryString}`)
      .then(() => {
        setNotifications((prev) =>
          prev.filter((n) => !markedNotifications.includes(n.id))
        );
        setMarkedNotifications([]);
      })
      .catch((err) => {
        console.error('Error deleting notifications:', err);
      });
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < maxPage) setCurrentPage(currentPage + 1);
  };

  const allIds = notifications?.map((n) => n.id);
  const areAllMarked = allIds.length > 0 && allIds.every((id) => markedNotifications.includes(id));

  const markAsReadLocally = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, markedAsOpen: true } : n)
    );
  };

  return (
    <div className={styles.wrapper}>
      <h1>შეტყობინებები</h1>

      {notifications.length > 0 ? (
        <div className={styles.notificationsList}>
          <div className={styles.areAllMarkedWrapper}>
            <Image
              src={areAllMarked ? '/marked.svg' : '/notMarked.svg'}
              alt="Notification"
              width={20}
              height={20}
              className={styles.image}
              onClick={handleMarkAllNotification}
            />

            <button
              className={`${styles.deleteAllBtn} ${markedNotifications.length === 0 ? styles.disabled : ''}`}
              onClick={handleDeleteClick}
              disabled={markedNotifications.length === 0}
            >
              <Image
                src="/notificationDelete.svg"
                alt="delete icon"
                width={20}
                height={20}
                className={styles.deleteIcon}
              />
            </button>
          </div>
          {notifications?.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isMarked={markedNotifications.includes(notification.id)}
              onToggleMarked={toggleMarked}
              onMarkAsRead={markAsReadLocally}
            />
          ))}
        </div>
      )
        :
        <div className={styles.noNotificationWrapper}>
          შეტყობინება არ გაქვთ
        </div>
      }

      {notifications.length > 0 && (
        <div className={styles.paginationWrapper}>
          <button onClick={handlePrev} disabled={currentPage === 1}>
            <img
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
            <img
              src={currentPage === maxPage ? '/arrowRightDisabled.svg' : '/arrowRightActive.svg'}
              alt="Next"
              width={36}
              height={36}
            />
          </button>
        </div>
      )}
    </div>
  );
}
