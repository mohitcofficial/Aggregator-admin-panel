import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://virtualxcel.in"),
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
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <Toaster position="bottom-center" reverseOrder={false} />

        {children}
      </body>
    </html>
  );
}
