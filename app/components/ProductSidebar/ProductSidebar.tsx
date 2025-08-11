'use client';
import PriceRange from '../PriceRange/PriceRange';
import styles from './ProductSidebar.module.scss';

const ProductSidebar = () => {

    return (
        <div className={styles.wrapper}>
            <h2>ფილტრები</h2>
            <div className={styles.content}>
                <PriceRange />
            </div>
        </div>
    );
}

export default ProductSidebar;
