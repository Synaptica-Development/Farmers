'use client';

import { useState } from 'react';
import styles from './ProductCard.module.scss';
import Image from 'next/image';
import ReusableButton from '../ReusableButton/ReusableButton';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface ProductCardProps {
    image: string;
    productName: string;
    location: string;
    farmerName: string;
    isFavorite: boolean;
    price: number;
    id?: string;
    profileCard?: boolean;
    onDelete?: () => void;
    showFavorite?: boolean;
}

const ProductCard = (props: ProductCardProps) => {
    const [favorite, setFavorite] = useState<boolean>(props.isFavorite);
    const showFavorite = props.showFavorite ?? true;
    const toggleFavorite = () => {
        setFavorite((prev) => !prev);
    };

    const handleAddToCart = () => {
        api.put('/api/Cart/add-product', {
            productID: props.id,
            quantity: 1,
        })
            .then((response) => {
                console.log('პროდუქტი დაემატა კალათაში:', response.data);
                toast.success('პროდუქტი წარმატებით დაემატა კალათაში!');
            })
            .catch((error) => {
                console.error('დამატების შეცდომა:', error, props.id);
                alert('დაფიქსირდა შეცდომა კალათაში დამატებისას!');
            });
    };


    return (
        <Link href={`/product/${props.id}`} className={styles.wrapper}>
            <div className={styles.imageSection}>
                <img
                    src={`${props.image}`}
                    alt='product image'
                />
            </div>

            <div className={styles.details}>
                <div className={styles.headerSection}>
                    <h3 className={styles.name}>{props.productName}</h3>
                    {showFavorite && (
                        <div className={styles.favoriteIcon} onClick={toggleFavorite}>
                            <Image
                                src={favorite ? '/greenHeart.svg' : '/whiteHeart.svg'}
                                alt={favorite ? 'Not Favorite' : 'Favorite'}
                                width={26}
                                height={26}
                            />
                        </div>
                    )}
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

                    {props.profileCard ? (
                        <div className={styles.profileCardButtons}>
                            <ReusableButton
                                title={'რედაქტირება'}
                                size='normal'
                                link={`/farmer/addproduct?id=${props.id}`}
                                onClick={() => {
                                    console.log('Edit clicked');
                                }}
                            />
                            <ReusableButton title={'წაშლა'} size='normal' deleteButton onClick={props.onDelete} />
                        </div>
                    ) : (
                        <ReusableButton title={'კალათაში დამატება'} size='normal' onClick={handleAddToCart} />
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
