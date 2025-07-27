'use client';

import Image from 'next/image';
import styles from './NotificationItem.module.scss';

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
  const imageSrc = isMarked ? "/marked.svg" : "/notMarked.svg";

  const handleClick = () => {
    onToggleMarked(notification.id);
  };

  return (
    <div
      className={`${styles.notificationItem} ${notification.markedAsOpen ? styles.alreadyRead : ''}`}
    >
      <Image
        src={imageSrc}
        alt="Notification"
        width={20}
        height={20}
        className={styles.image}
        onClick={handleClick}
      />
      <div className={styles.textContent}>
        <p className={styles.title}>{notification.title}</p>
        <span className={styles.time}>{notification.creationDate}</span>
      </div>
    </div>
  );
};

export default NotificationItem;
