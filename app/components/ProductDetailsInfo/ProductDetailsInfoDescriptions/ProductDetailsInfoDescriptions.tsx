import api from '@/lib/axios';
import ReusableButton from '../../ReusableButton/ReusableButton';
import styles from './ProductDetailsInfoDescriptions.module.scss'
import { toast } from 'react-hot-toast';

interface ProductDetailsInfoDescriptionsProps {
    grammage: string;
    id: string;
    maxCount: number;
    price: number;
    productDescription: string;
    productName: string;
}

const ProductDetailsInfoDescriptions = ({
    grammage,
    id,
    maxCount,
    price,
    productDescription,
    productName,
}: ProductDetailsInfoDescriptionsProps) => {
    console.log('id',id)
    const handleAddToCart = () => {
        api.put('/api/Cart/add-product', {
            productID: id,
            quantity: 1,
        })
            .then((response) => {
                console.log('პროდუქტი დაემატა კალათაში:', response.data);
                toast.success('პროდუქტი წარმატებით დაემატა კალათაში!');
            })
            .catch((error) => {
                console.error('დამატების შეცდომა:', error, id);
                alert('დაფიქსირდა შეცდომა კალათაში დამატებისას!');
            });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <h2>{productName}</h2>
                <div className={styles.textsWrapper}>
                    <div className={styles.textsWrapperItem}>
                        <div className={styles.priceWrapper}>
                            <p>{price}₾ / {grammage}</p>
                        </div>
                        <p>მარაგშია: {maxCount} {grammage}</p>
                    </div>
                    <p>{productDescription}</p>
                </div>
            </div>
            <ReusableButton title={'კალათაში დამატება'} size="large" onClick={handleAddToCart} />
        </div>
    );
};

export default ProductDetailsInfoDescriptions;
