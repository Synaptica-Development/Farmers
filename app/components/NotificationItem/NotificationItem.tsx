'use client';

import Image from 'next/image';
import styles from './NotificationItem.module.scss';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  onMarkAsRead: (id: string) => void; 
}

const useWindowWidth = () => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const NotificationItem = ({ notification, isMarked, onToggleMarked, onMarkAsRead }: Props) => {
  const router = useRouter();
  const width = useWindowWidth();

  let maxLength = 80;
  if (width <= 768) maxLength = 60;
  if (width <= 512) maxLength = 40;

  const truncatedTitle = truncateText(notification.title, maxLength);

  const imageSrc = isMarked ? '/marked.svg' : '/notMarked.svg';

  const handleMarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleMarked(notification.id);
  };

  const handleNavigate = () => {
    if (!notification.markedAsOpen) {
      api
        .put(`/user/notifications/mark-as-read?ID=${notification.id}`)
        .then(() => {
          onMarkAsRead(notification.id);
        })
        .catch((err) => {
          console.error('Failed to mark notification as read:', err);
        });
    }

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
        <p className={styles.title}>{truncatedTitle}</p>
        <span className={styles.time}>{notification.creationDate}</span>
      </div>
    </div>
  );
};

export default NotificationItem;
