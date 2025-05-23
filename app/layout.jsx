
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNavigation from "@/components/MobileNavigation";
import StoreProvider from "@/store/Provider";
import MobileSearchInput from "@/components/MobileSearchInput";




const nunito = Nunito({
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Movie App with next.js and redux",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body
        className={nunito.className}
      >
        <StoreProvider>
          <Header />
          <MobileSearchInput />
          <div>
            {children}

          </div>
          <MobileNavigation />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
