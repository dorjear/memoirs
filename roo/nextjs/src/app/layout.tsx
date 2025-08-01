import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changed from Geist to Inter
import "./globals.css";
import Script from "next/script"; // Added Script import

const inter = Inter({ subsets: ["latin"] }); // Changed from Geist to Inter

export const metadata: Metadata = {
  title: "Memoir App", // Updated title
  description: "A simple memoir application built with Next.js", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body> {/* Updated body className */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      />
    </html>
  );
}
