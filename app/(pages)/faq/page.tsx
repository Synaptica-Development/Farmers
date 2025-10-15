import { Suspense } from "react";
import Header from "@/app/components/Header/Header";
import FaqClient from "./FaqClient";
import FooterComponent from "@/app/components/FooterComponent/FooterComponent";

export default function FaqPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<p>იტვირთება...</p>}>
        <FaqClient />
      </Suspense>
      <FooterComponent />
    </>
  );
}
