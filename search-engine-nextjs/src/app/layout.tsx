// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SearchProvider } from "./context/SearchContext";
import { FaSearch, FaVideo, FaKey, FaImage, FaNewspaper, FaShoppingCart } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEKIYABA SEARCH",
  description: "Better search engine for the web, no weird restrictions.",
};

const navLinks = [
  { name: "検索", href: "/", icon: <FaSearch /> },
  { name: "ゲキヤバ動画", href: "/videos", icon: <FaVideo /> },
  { name: "ログイン", href: "/login", icon: <FaKey />}
  /*
  { name: "画像", href: "/images", icon: <FaImage /> },
  { name: "ニュース", href: "/news", icon: <FaNewspaper /> },
  { name: "ショッピング", href: "/shopping", icon: <FaShoppingCart /> },
  */
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-custom-gradient min-h-screen pb-16`}>
        <SearchProvider>
          <div className="flex flex-col items-center justify-start min-h-screen bg-cover bg-fixed mb-0 w-full" style={{ background: 'linear-gradient(to bottom right, rgba(var(--background-start-rgb), 1), rgba(var(--background-end-rgb), 1))', marginTop: '0', marginBottom: '0' }}>
            {children}
            {/* Navigation Footer */}
            <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 shadow-neumorphism">
              <nav className="flex justify-around items-center ">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition shadow-neumorphism-button p-2 rounded-md flex-grow text-center"
                  >
                    {link.icon}
                    <span className="text-xs">{link.name}</span>
                  </a>
                ))}
              </nav>
            </footer>
          </div>
        </SearchProvider>
      </body>
    </html>
  );

}
