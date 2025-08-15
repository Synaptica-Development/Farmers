import api from '@/lib/axios';
import SubProductsSlider from '../SubProductsSlider/SubProductsSlider';
// import styles from './SimilarProducts.module.scss';
import { useEffect, useState } from 'react';

interface Props {
    id: string;
    subCategoryID: number;
    categoryID: number;
}

interface Product {
  id: string;
  farmName: string;
  image1: string;
  image2: string;
  location: string | null;
  price: number;
  productDescription: string;
  productName: string;
}

const SimilarProducts = ({ id, categoryID, subCategoryID }: Props) => {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/sub-products", {
      params: {
        categoryID,
        subCategoryID,
        page: 1,
        pageSize: 15
      }
    })
      .then((res) => {
        const filtered = res.data.products?.filter((p: Product) => p.id !== id) || [];
        setProducts(filtered);
      })
      .catch((err) => {
        console.error("Error fetching similar products:", err);
      });
  }, [id, categoryID, subCategoryID]);

  return (
      <SubProductsSlider products={products} />
  );
};

export default SimilarProducts;