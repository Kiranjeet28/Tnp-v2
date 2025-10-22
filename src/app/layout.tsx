// Updated layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarDemo } from "@/components/reusable/navbar";
import { Toaster } from "sonner";
import { Footer } from "@/components/reusable/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infocascade V2",
  description: "Infocascade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {/* Fixed navbar at top */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavbarDemo />
        </div>

        {/* Main content with top padding to account for fixed navbar */}
        <main className="pt-16"> {/* Adjust pt-16 based on your navbar height */}
          {children}
        </main>

        {/* Your actual footer component */}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}