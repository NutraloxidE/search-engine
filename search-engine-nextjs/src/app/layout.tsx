// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "./context/SearchContext";
import { FaSearch, FaVideo, FaImage, FaNewspaper, FaShoppingCart } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEKIYABA SEARCH",
  description: "Better search engine for the web, no weird restrictions.",
};

const navLinks = [
  { name: "検索", href: "/", icon: <FaSearch /> },
  { name: "動画", href: "/videos", icon: <FaVideo /> },
  { name: "画像", href: "/images", icon: <FaImage /> },
  { name: "ニュース", href: "/news", icon: <FaNewspaper /> },
  { name: "ショッピング", href: "/shopping", icon: <FaShoppingCart /> },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} pb-16`}>
        <SearchProvider>
          {children}
          <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
            <nav className="flex justify-around p-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition"
                >
                  {link.icon}
                  <span className="text-xs">{link.name}</span>
                </a>
              ))}
            </nav>
          </footer>
        </SearchProvider>
      </body>
    </html>
  );
}
