import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";
import ProductCard from "../ProductCard/ProductCard";
import ReusableButton from "../ReusableButton/ReusableButton";
import styles from "./FarmerMyProducts.module.scss";
import BASE_URL from "@/app/config/api";
import { toast } from "react-hot-toast";

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
  maxCount: string;
  grammage: string;
  isSaved: boolean;
}

const FarmerMyProducts = ({ id }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [haveLicense, setHaveLicense] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/Farmer/products", {
          params: {
            uid: id,
            page: 1,
            pageSize: 32,
            t: Date.now(),
          },
        });
        setProducts(res.data);
      } catch (err) {
        console.log("error: ", err);
      }

      try {
        const licenseRes = await api.get("/api/Farmer/licensed-categories", {
          params: { t: Date.now() },
        });
        setHaveLicense(Array.isArray(licenseRes.data) && licenseRes.data.length > 0);
      } catch (err) {
        console.log("licensed-categories: ", err);
      }
    };

    fetchData();
  }, [id, pathname]);

  const handleAddClick = () => {
    if (haveLicense) {
      router.push("/farmer/addproduct");
    } else {
      toast.error("პროდუქტის დასამატებლად საჭიროა შეავსოთ ლიცენზიის განაცხადი");
      router.push("/farmer/licenses/addlicense");
    }
  };

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
        <ReusableButton title="დამატება" size="normal" onClick={handleAddClick} />
      </div>

      {products.length > 0 ? (
        <div className={styles.productsList}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={`${BASE_URL}${product.image1}?t=${Date.now()}`}
              productName={product.productName}
              location={product.location || "ადგილმდებარეობა უცნობია"}
              farmerName={product.farmName || "მეწარმე უცნობია"}
              isFavorite={product.isSaved}
              price={product.price}
              profileCard
              onDelete={() => handleDelete(product.id)}
              maxCount={product.maxCount}
              grammage={product.grammage}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noProducts}>
          <p>თქვენ არ გაქვთ დამატებული პროდუქტი</p>
        </div>
      )}
    </div>
  );
};

export default FarmerMyProducts;
