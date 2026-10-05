import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactFab from "@/components/layout/ContactFab";
import Providers from "@/components/Providers";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

export const metadata: Metadata = {
  title: "Fakhri Clothes — Premium Unstitched Wear",
  description: "Exquisite unstitched women's clothing. 1-piece, 2-piece and 3-piece collections delivered across Pakistan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${jost.variable} font-sans bg-cream text-emerald antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ContactFab />
        </Providers>
      </body>
    </html>
  );
}