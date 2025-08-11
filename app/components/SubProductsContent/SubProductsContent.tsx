"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import styles from "./SubProductsContent.module.scss";
import Image from 'next/image';

interface Product {
    farmName: string;
    image1: string;
    image2: string;
    location: string | null;
    price: number;
    productDescription: string;
    productName: string;
}

export default function SubProductsContent() {
    const { categoryId, subCategoryID } = useParams();
    const [subProducts, setSubProducts] = useState<Product[]>([]);
    const [subProductTitle, setSubProductTitle] = useState('');
    const [productTitle, setProductTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryId || !subCategoryID) return;
        setLoading(true);
        api
            .get("/sub-products", {
                params: {
                    categoryID: categoryId,
                    subCategoryID: subCategoryID,
                    page: 1,
                    pageSize: 32,
                },
            })
            .then((res) => {
                console.log("sub-products", res.data);
                setSubProducts(res.data.products || []);
                setSubProductTitle(res.data.categoryName)
            })
            .catch((err) => console.error("Categories fetch error:", err))
            .finally(() => {
                setLoading(false);
            });

        api
            .get("/products", {
                params: {
                    categoryID: categoryId,
                    page: 1,
                    pageSize: 1,
                },
            })
            .then((res) => {
                console.log("products", res.data);
                setProductTitle(res.data.categoryName)
            })
            .catch((err) => console.error("Products fetch error:", err));
    }, [categoryId, subCategoryID]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.content}>
            <div className={styles.headerNav}>
                <Image
                    src="/productHomeIcon.svg"
                    alt="success icon"
                    width={24}
                    height={24}
                />
                <Image
                    src="/grayLeftArrow.svg"
                    alt="success icon"
                    width={8}
                    height={20}
                />
                <span>
                    {productTitle}
                </span>
                <Image
                    src="/grayLeftArrow.svg"
                    alt="success icon"
                    width={8}
                    height={20}
                />
                <p>
                    {subProductTitle}
                </p>
            </div>
            <div className={styles.cardsWrapper}>
                {subProducts.length > 0 ? (
                    subProducts.map((product, index) => (
                        <ProductCard
                            key={index}
                            image={`/testproduct.jpg`}
                            productName={product.productName}
                            location={product.location || "უცნობი"}
                            farmerName={product.farmName}
                            isFavorite={false}
                            price={product.price}
                        />
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
}
