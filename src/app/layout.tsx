import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CommissionHub - Sell Products & Earn Commissions",
  description: "Marketplace for selling other users' products for a commission",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      
          <Navbar />
          {children}
          <footer className="w-full border-t py-6">
            <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
              <p className="text-center text-sm text-muted-foreground">
                © 2025 CommissionHub. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </footer>
          <Toaster />
      </body>
    </html>
  );
}
