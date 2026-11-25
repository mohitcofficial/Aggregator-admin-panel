import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { getMyProfile } from "./lib/auth";
import { AuthProvider } from "../context/AuthContext";

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

export default async function RootLayout({ children }) {
  await getMyProfile();

  return (
    <html lang="en">
      <body
        className={poppins.className}
        style={{
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "#EEEDF1",
        }}
      >
        <Toaster position="bottom-center" reverseOrder={false} />
        <NextTopLoader showSpinner={false} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
