import Link from "next/link";
import ReusableButton from "./components/ReusableButton/ReusableButton";

export default function Home() {
  return (
    <div>
      <h1>ბარო ბარო!!!</h1>
      <Link href={"/signup"}>sign in</Link>
      <ReusableButton title={"ძებნა"}/>
    </div>
  );
}
