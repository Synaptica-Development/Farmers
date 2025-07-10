import Advertisements from "./components/Advertisements/Advertisements";
import Categories from "./components/Categories/Categories";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import Header from "./components/Header/Header";
import ProductsSlider from "./components/ProductsSlider/ProductsSlider";

export default function Home() {
  return (
    <div>
      <Header />
      <Categories />
      <Advertisements />
      <ProductsSlider />
      <ProductsSlider />
      <div style={{marginTop: '24px'}}><Advertisements /></div>
      <ProductsSlider />
      <div style={{marginTop: '90px'}}><FooterComponent/></div>
    </div>
  );
}
