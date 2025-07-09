import Advertisements from "./components/Advertisements/Advertisements";
import Categories from "./components/Categories/Categories";
import Header from "./components/Header/Header";

export default function Home() {
  return (
    <div>
      <Header/>
      <Categories/>
      <Advertisements/>
    </div>
  );
}
