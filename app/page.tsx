import Advertisements from "./components/Advertisements/Advertisements";
import Categories from "./components/Categories/Categories";
import Header from "./components/Header/Header";
import ProductCard from "./components/ProductCard/ProductCard";
import ProductsSlider from "./components/ProductsSlider/ProductsSlider";

export default function Home() {
  return (
    <div>
      <Header />
      <Categories />
      <Advertisements />
      <ProductsSlider />
      <ProductsSlider />
      <Advertisements />
      <ProductsSlider />
    </div>
  );
}
