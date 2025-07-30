'use client';

import Image from 'next/image';
import styles from './NotificationItem.module.scss';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import api from '@/lib/axios';

interface Props {
  notification: {
    id: string;
    title: string;
    creationDate: string;
    markedAsOpen: boolean;
  };
  isMarked: boolean;
  onToggleMarked: (id: string) => void;
}

const NotificationItem = ({ notification, isMarked, onToggleMarked }: Props) => {
  const router = useRouter();
  const imageSrc = isMarked ? "/marked.svg" : "/notMarked.svg";

  useEffect(() => {
    if (!notification.markedAsOpen) {
      api
        .put(`/user/notifications/mark-as-read?ID=${notification.id}`)
        .catch((err) => {
          console.error('Failed to mark notification as read:', err);
        });
    }
  }, [notification.id, notification.markedAsOpen]);

  const handleMarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleMarked(notification.id);
  };

  const handleNavigate = () => {
    router.push(`/farmer/notifications/${notification.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleNavigate}
      className={`${styles.notificationItem} ${notification.markedAsOpen ? styles.alreadyRead : ''}`}
    >
      <div className={styles.imageWrapper} onClick={handleMarkClick}>
        <Image
          src={imageSrc}
          alt="Notification"
          width={20}
          height={20}
          className={styles.image}
        />
      </div>
      <div className={styles.textContent}>
        <p className={styles.title}>{notification.title}</p>
        <span className={styles.time}>{notification.creationDate}</span>
      </div>
    </div>
  );
};

export default NotificationItem;
