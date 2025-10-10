'use client';

import { useState } from 'react';
import BASE_URL from '@/app/config/api';
import styles from './ProductDetailsInfoImages.module.scss';

interface ProductDetailsInfoImagesProps {
    image1: string;
    image2: string;
}

const ProductDetailsInfoImages = ({ image1, image2 }: ProductDetailsInfoImagesProps) => {
    const images = [`${BASE_URL}/${image1}`, `${BASE_URL}/${image2}`];
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className={styles.container}>
            <div className={styles.mainImage}>
                <img src={selectedImage} alt="Selected Product" />
            </div>

            <div className={styles.thumbnails}>
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`${styles.thumbnailWrapper} ${
                            selectedImage === img ? styles.active : ''
                        }`}
                        onClick={() => setSelectedImage(img)}
                    >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductDetailsInfoImages;
