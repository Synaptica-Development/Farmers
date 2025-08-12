'use client';
import PriceRange from '../PriceRange/PriceRange';
import SubSubCategoriesFilter from '../SubSubCategoriesFilter/SubSubCategoriesFilter';
import styles from './ProductSidebar.module.scss';

const ProductSidebar = () => {

    return (
        <div className={styles.wrapper}>
            <h2>ფილტრები</h2>
            <div className={styles.content}>
                <PriceRange />
                <SubSubCategoriesFilter/>
            </div>
        </div>
    );
}

export default ProductSidebar;
