'use client';

import { useState } from 'react';
import styles from './ProductCard.module.scss';
import Image from 'next/image';
import ReusableButton from '../ReusableButton/ReusableButton';

interface ProductCardProps {
    image: string;
    productName: string;
    location: string;
    farmerName: string;
    isFavorite: boolean;
    price: number;
}

const ProductCard = (props: ProductCardProps) => {
    const [favorite, setFavorite] = useState<boolean>(props.isFavorite);

    const toggleFavorite = () => {
        setFavorite((prev) => !prev);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.imageSection}>
                <img
                    src={`/${props.image}.jpg`}
                    alt='product image'
                />
            </div>

            <div className={styles.details}>
                <div className={styles.headerSection}>
                    <h3 className={styles.name}>{props.productName}</h3>
                    <div className={styles.favoriteIcon} onClick={toggleFavorite}>
                        <Image
                            src={favorite ? '/greenHeart.svg' : '/whiteHeart.svg'}
                            alt={favorite ? 'Not Favorite' : 'Favorite'}
                            width={26}
                            height={26}
                        />
                    </div>
                </div>

                <p className={styles.farmerName}>{props.farmerName}</p>

                <div className={styles.location}>
                    <Image
                        src={'/testLocation.png'}
                        alt={'location'}
                        width={20}
                        height={20}
                    />
                    <p>{props.location}</p>
                </div>
                <div className={styles.bottomSection}>
                    <p className={styles.price}>{props.price}₾</p>
                    <ReusableButton title={'კალათაში დამატება'} size='normal'/>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
