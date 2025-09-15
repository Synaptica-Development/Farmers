'use client';

import styles from './page.module.scss'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Image from 'next/image';
interface Notification {
    id: string;
    title: string;
    content: string;
}

export default function NotificationDetails() {
    const { id } = useParams();
    const [notification, setNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const router = useRouter();


    useEffect(() => {
        if (!id) return;

        api.get(`/user/notifications/details?ID=${id}`)
            .then((res) => {
                setNotification(res.data);
            })
            .catch((err) => {
                console.error('Failed to fetch notification details:', err);
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>იტვირთება...</div>;
    if (error) return <div>შეტყობინება ვერ მოიძებნა</div>;

    return (
        <div className={styles.background}>
            <div className={styles.wrapper}>
                <div className={styles.header} onClick={() => router.back()}>
                    <Image
                        src={'/goBackArrow.svg'}
                        alt={'go back arrow'}
                        width={32}
                        height={24}
                    />
                    <p>გასვლა</p>
                </div>
                <div className={styles.texts}>
                    <h1>{notification?.title}</h1>
                    <p>{notification?.content}</p>
                </div>
            </div>
        </div>
    );
}
