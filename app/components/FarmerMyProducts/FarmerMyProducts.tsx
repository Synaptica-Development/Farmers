import api from "@/lib/axios";
import ProductCard from "../ProductCard/ProductCard";
import ReusableButton from "../ReusableButton/ReusableButton"
import styles from "./FarmerMyProducts.module.scss"
import { useEffect, useState } from "react";

interface Props {
    id: string;
}

interface Product {
    id: string;
    productName: string;
    productDescription: string;
    price: number;
    image1: string;
    location: string | null;
    farmName: string | null;
}

const FarmerMyProducts = (props: Props) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        api
            .get("/api/Farmer/products", {
                params: {
                    uid: props.id,
                    page: 1,
                    pageSize: 32,
                },
            })
            .then((res) => {
                console.log("res: ", res.data);
                setProducts(res.data);
            })
            .catch((err) => console.log("error: ", err));
    }, [props.id]);



    return (
        <div className={styles.productsSection}>
            <div className={styles.productsHeader}>
                <h2>პროდუქტები</h2>
                <ReusableButton title={"დამატება"} size="normal" link="/farmer/addproduct" />
            </div>

            <div className={styles.productsList}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        image={`https://185.49.165.101${product.image1}` || "/default-image.jpg"}
                        productName={product.productName}
                        location={product.location || "ადგილმდებარეობა უცნობია"}
                        farmerName={product.farmName || "ფერმერი უცნობია"}
                        isFavorite={false}
                        price={product.price}
                        profileCard
                    />
                ))}
            </div>

        </div>
    )
}

export default FarmerMyProducts;