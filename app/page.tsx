import Advertisements from "./components/Advertisements/Advertisements";
import Categories from "./components/Categories/Categories";
import Header from "./components/Header/Header";
import ProductCard from "./components/ProductCard/ProductCard";

export default function Home() {
  return (
    <div>
      <Header/>
      <Categories/>
      <Advertisements/>
      <ProductCard image={"testproduct"} productName={"გორის ვაშლი"} location={"თბილისი"} farmerName={"გურამის ფერმა"} isFavorite={false} price={120.50}/>
    </div>
  );
}
