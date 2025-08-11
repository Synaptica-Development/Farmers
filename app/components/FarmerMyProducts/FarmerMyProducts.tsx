import api from "@/lib/axios";
import ProductCard from "../ProductCard/ProductCard";
import ReusableButton from "../ReusableButton/ReusableButton"
import styles from "./FarmerMyProducts.module.scss"
import { useEffect, useState } from "react";
import BASE_URL from "@/app/config/api";

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



    const handleDelete = async (productId: string) => {
        try {
            await api.delete(`/api/Farmer/delete-product`, {
                params: { productID: productId },
            });
            setProducts((prev) => prev.filter((p) => p.id !== productId));
        } catch (err) {
            console.error("Failed to delete product", err);
        }
    };

    return (
        <div className={styles.productsSection}>
            <div className={styles.productsHeader}>
                <h2>პროდუქტები</h2>
                <ReusableButton title={"დამატება"} size="normal" link="/farmer/addproduct" />
            </div>

            <div className={styles.productsList}>
                {products?.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        image={`${BASE_URL}${product.image1}`}
                        productName={product.productName}
                        location={product.location || "ადგილმდებარეობა უცნობია"}
                        farmerName={product.farmName || "ფერმერი უცნობია"}
                        isFavorite={false}
                        price={product.price}
                        profileCard
                        onDelete={() => handleDelete(product.id)}
                        showFavorite={false}
                    />
                ))}
            </div>

        </div>
    )
}

export default FarmerMyProducts;