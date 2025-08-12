'use client';
import PriceRange from '../PriceRange/PriceRange';
import RegionsFilter from '../RegionsFilter/RegionsFilter';
import SubSubCategoriesFilter from '../SubSubCategoriesFilter/SubSubCategoriesFilter';
import styles from './ProductSidebar.module.scss';

const ProductSidebar = () => {

    return (
        <div className={styles.wrapper}>
            <h2>ფილტრები</h2>
            <div className={styles.content}>
                <PriceRange />
                <SubSubCategoriesFilter/>
                <RegionsFilter/>
            </div>
        </div>
    );
}

export default ProductSidebar;
