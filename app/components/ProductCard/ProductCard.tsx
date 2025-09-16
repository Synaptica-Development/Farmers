'use client';

import { useState } from 'react';
import styles from './ProductCard.module.scss';
import Image from 'next/image';
import ReusableButton from '../ReusableButton/ReusableButton';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';
import { useCart } from '@/contexts/CartContext';

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
  maxCount?: string;
  grammage?: string;
}

const ProductCard = (props: ProductCardProps) => {
  const [favorite, setFavorite] = useState<boolean>(props.isFavorite);
  const [showPopup, setShowPopup] = useState(false);
  const showFavorite = props.showFavorite ?? true;

  const router = useRouter();
  const { setCountFromApi } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    const role = Cookies.get("role");

    if (!role) {
      if (props.id) {
        Cookies.set("pendingProductID", props.id, { expires: 1 / 24 });
      }
      router.push("/signin");
      return;
    }

    api
      .post("/api/Cart/add-product", {
        productID: props.id,
        quantity: 1,
      })
      .then((res) => {
        toast.success("პროდუქტი წარმატებით დაემატა კალათაში!");
        setCountFromApi(res.data.cartItemsCount);
      })
      .catch((error) => {
        console.error("დამატების შეცდომა:", error, props.id);
        toast.error("დაფიქსირდა შეცდომა კალათაში დამატებისას!");
      });
  };

  const handleConfirmDelete = () => {
    if (props.onDelete) props.onDelete();
    setShowPopup(false);
  };

  const toggleFavorite = () => {
    if (!props.id) return;

    const token = Cookies.get("token");
if (!token) {
    toast.success("პროდუქტის რჩეულებში დამატებისთვის გაიარეთ რეგისტრაცია");
    router.push("/signin");
    return;
  }
    if (!favorite) {
      api.put(`/save-product?productID=${props.id}`)
        .then(() => {
          toast.success("პროდუქტი დამატებულია რჩეულებში!");
          setFavorite(true);
        })
        .catch((err) => {
          console.error("დამატების შეცდომა:", err);
          toast.error("დაფიქსირდა შეცდომა რჩეულებში დამატებისას!");
        });
    } else {
      api.delete(`/unsave-product?productID=${props.id}`)
        .then(() => {
          toast.success("პროდუქტი ამოღებულია რჩეულებიდან!");
          setFavorite(false);
          if (props.onDelete) props.onDelete();
        })
        .catch((err) => {
          console.error("ამოღების შეცდომა:", err);
          toast.error("დაფიქსირდა შეცდომა რჩეულებიდან ამოღებისას!");
        });
    }
  };

  return (
    <>
      <div
        className={styles.wrapper}
        onClick={() => router.push(`/product/${props.id}`)}
      >
        <div className={styles.imageSection}>
          <img
            src={`${props.image}`}
            alt='product image'
            draggable={false}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.headerSection}>
            <h3 className={styles.name}>
              {props.productName.length > 18
                ? props.productName.slice(0, 18) + '...'
                : props.productName}
            </h3>
            {showFavorite && (
              <div
                className={styles.favoriteIcon}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleFavorite();
                }}
              >
                <Image
                  src={favorite ? '/greenHeart.svg' : '/whiteHeart.svg'}
                  alt={favorite ? 'Not Favorite' : 'Favorite'}
                  width={22}
                  height={22}
                />
              </div>
            )}
          </div>

          <p className={styles.farmerName}>{props.farmerName}</p>

          {props.maxCount && <p className={styles.farmerName}>მარაგშია: {props.maxCount} {props.grammage}</p>}
          <div className={styles.location}>
            <Image
              src={'/testLocation.png'}
              alt={'location'}
              width={20}
              height={20}
            />
            <p>{props.location}</p>
          </div>


          <div
            className={`${styles.bottomSection} ${!props.profileCard ? styles.withCart : ""
              }`}
          >
            <p className={styles.price}>{props.price}₾</p>

            {props.profileCard ? (
              <div className={styles.profileCardButtons}>
                <ReusableButton
                  title={'შეცვლა'}
                  size='normal'
                  link={`/farmer/addproduct?id=${props.id}`}
                  onClick={() => {
                    console.log('Edit clicked');
                  }}
                />
                <ReusableButton
                  title={'წაშლა'}
                  size='normal'
                  deleteButton
                  onClick={() => setShowPopup(true)}
                />
              </div>
            ) : (
              <div
                className={styles.cartIconWrapper}
                onClick={handleAddToCart}
                role="button"
                tabIndex={0}
              >
                <Image src={'/greenCartIcon.svg'} alt="კალათაში დამატება" width={40} height={30} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <ConfirmPopup
          title="ნამდვილად გსურთ პროდუქტის წაშლა?"
          confirmText="დიახ"
          cancelText="გაუქმება"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
