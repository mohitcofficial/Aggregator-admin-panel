import Sidebar from "@/components/Sidebar";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import NextTopLoader from "nextjs-toploader";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Virtualxcel",
    template: "%s | Virtualxcel",
  },
  description: "Discover the ultimate coworking experience at Virtualxcel.",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={poppins.className}
        style={{ width: "100%", maxWidth: "100%", backgroundColor: "#EEEDF1" }}
      >
        <Toaster position="bottom-center" reverseOrder={false} />
        <NextTopLoader showSpinner={false} />
        <Sidebar />
        <Header />
        <main
          style={{
            padding: "60px 0 0 70px",
            zIndex: "0",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
