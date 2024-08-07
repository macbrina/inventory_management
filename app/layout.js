import { AuthProvider } from "@/app/_context/AuthContext";
import "@/app/_styles/globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InventoryProvider } from "./_context/InventoryContext";

import { Josefin_Sans } from "next/font/google";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s - StockSmart",
    default: "Welcome - Streamline Your Pantry",
  },
  description:
    "Keep your pantry organized and your meals planned with ease.Streamline your kitchen inventory and never run out of essentials again.",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={josefin.className}>
          <ToastContainer />
          <InventoryProvider>{children}</InventoryProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
