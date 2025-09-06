import type { Metadata } from "next";
import { Nunito, Poppins, Inter } from "next/font/google";

import "./globals.scss";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { CartProvider } from "@/contexts/CartContext"; 

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "My App",
  description: "Your description here",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${nunito.variable}`}>
        <CartProvider>
          {children}
        </CartProvider>

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              textAlign: 'center',
              marginTop: "32px",
              fontFamily: "var(--font-poppins)",
              maxWidth: '450px',
              width: '100%',
            },
            success: {
              icon: (
                <Image
                  src="/successIcon.svg"
                  alt="success icon"
                  width={36}
                  height={36}
                />
              ),
              style: {
                fontSize: '20px',
                fontWeight: 500,
                padding: '16px 24px',
                background: "#A9DAA9",
                color: "#2C690B",
                border: "1px solid #00B207",
              },
              duration: 3000,
            },
            error: {
              icon: (
                <Image
                  src="/errorIcon.svg"
                  alt="error icon"
                  width={36}
                  height={36}
                />
              ),
              style: {
                fontSize: '20px',
                fontWeight: 500,
                padding: '16px 24px',
                background: "#DAA9A9",
                color: "#C72D2D",
                border: "1px solid #B50707",
              },
              duration: 3000,
            },
          }}
        />
      </body>
    </html>
  );
}
