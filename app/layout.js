import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";



export const metadata = {
  title: "Price Tracker",
  description: "price tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors/>
      </body>
    </html>
  );
}
