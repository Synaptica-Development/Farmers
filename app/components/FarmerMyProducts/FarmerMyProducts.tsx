import api from "@/lib/axios";
import ProductCard from "../ProductCard/ProductCard";
import ReusableButton from "../ReusableButton/ReusableButton"
import styles from "./FarmerMyProducts.module.scss"
import { useEffect } from "react";

interface Props {
    id: string;
}

const FarmerMyProducts = (props:Props) => {
    
      useEffect(() => {
        api.get('/api/Farmer/products', {
            params: {
              uid: props.id,
              page: 1,
              pageSize: 32,
            },
          })
          .then(res => console.log("res: ", res.data))
          .catch(err => console.log("error: ", err));
      }, [props.id]);


    return (
        <div className={styles.productsSection}>
            <div className={styles.productsHeader}>
                <h2>პროდუქტები</h2>
                <ReusableButton title={"დამატება"} size="normal" link="/farmer/licenses/addlicense"/>
            </div>

            <div className={styles.productsList}>
                <ProductCard
                    image={`/testproduct.jpg`}
                    productName={"asdasd"}
                    location={"dddd"}
                    farmerName={"zzzzzz"}
                    isFavorite={false}
                    price={0}
                    profileCard
                />
                <ProductCard
                    image={`/testproduct.jpg`}
                    productName={"asdasd"}
                    location={"dddd"}
                    farmerName={"zzzzzz"}
                    isFavorite={false}
                    price={0}
                    profileCard
                />
                <ProductCard
                    image={`/testproduct.jpg`}
                    productName={"asdasd"}
                    location={"dddd"}
                    farmerName={"zzzzzz"}
                    isFavorite={false}
                    price={0}
                    profileCard
                />
                <ProductCard
                    image={`/testproduct.jpg`}
                    productName={"asdasd"}
                    location={"dddd"}
                    farmerName={"zzzzzz"}
                    isFavorite={false}
                    price={0}
                    profileCard
                />
                <ProductCard
                    image={`/testproduct.jpg`}
                    productName={"asdasd"}
                    location={"dddd"}
                    farmerName={"zzzzzz"}
                    isFavorite={false}
                    price={0}
                    profileCard
                />
                <ProductCard
                    image={`/testproduct.jpg`}
                    productName={"asdasd"}
                    location={"dddd"}
                    farmerName={"zzzzzz"}
                    isFavorite={false}
                    price={0}
                    profileCard
                />
            </div>
        </div>
    )
}

export default FarmerMyProducts;