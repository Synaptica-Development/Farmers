import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>ბარო ბარო!!!</h1>
      <Link href={"/signup"}>sign in</Link>
    </div>
  );
}
