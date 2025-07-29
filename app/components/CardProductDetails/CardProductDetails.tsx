'use client'

import { useState } from 'react';
import styles from './CardProductDetails.module.scss'
import Image from 'next/image';
import api from '@/lib/axios';

interface Props {
    cartItedId: string;
    image: string;
    name: string;
    price: number;
    count: number;
    onDelete: (id: string) => void;
}

const CardProductDetails = ({ image, name, price, count, cartItedId, onDelete }: Props) => {
    const [counter, setCounter] = useState(count);
    const [totalOfOneItem, setTotalOfOneItem] = useState(count * price);

    const increment = () => {
        const newCount = counter + 1;
        setCounter(newCount);
        setTotalOfOneItem(newCount * price);
    };

    const decrement = () => {
        if (counter > 1) {
            const newCount = counter - 1;
            setCounter(newCount);
            setTotalOfOneItem(newCount * price);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.productInfo}>
                <img className={styles.productImage} src={`https://185.49.165.101${image}`} alt={'product image'} />
                <h2>{name}</h2>
            </div>
            <p>კგ</p>
            <p>{price}₾</p>
            <div className={styles.counterWrapper}>
                <div className={styles.counter}>
                    <Image
                        src="/cartMinus.svg"
                        alt="minus icon"
                        width={34}
                        height={34}
                        onClick={decrement}
                    />
                    <p>{counter}</p>
                    <Image
                        src="/cartPluse.svg"
                        alt="plus icon"
                        width={34}
                        height={34}
                        onClick={increment}
                    />
                </div>
            </div>
            <p>{totalOfOneItem}₾</p>
            <div className={styles.deleteIconWrapper}>
                <Image
                    src="/cardDeleteIcon.svg"
                    alt="delete icon"
                    width={24}
                    height={24}
                    onClick={() => onDelete(cartItedId)}
                />
            </div>
        </div>
    );
};

export default CardProductDetails;
