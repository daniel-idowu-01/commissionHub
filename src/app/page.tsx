"use client"
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import ProductGrid from "@/components/product-grid";

export default function Home() {
  const { user } = useUserStore();
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Sell Products, Earn Commissions
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  List other users' products at your own price and earn the
                  difference as commission.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/products">
                  <Button className="px-8">
                    Browse Products <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {!user && (
                  <Link href="/auth/signup">
                    <Button variant="outline" className="px-8">
                      Sign Up
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Featured Products
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Discover popular products you can sell to earn commissions.
                </p>
              </div>
              <ProductGrid />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                  <svg
                    className="h-8 w-8 text-gray-800"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Set Your Own Prices</h3>
                <p className="text-gray-500">
                  Choose the markup and earn the difference as your commission.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                  <svg
                    className="h-8 w-8 text-gray-800"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">No Inventory Needed</h3>
                <p className="text-gray-500">
                  Sell products without having to store or ship them yourself.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                  <svg
                    className="h-8 w-8 text-gray-800"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Track Performance</h3>
                <p className="text-gray-500">
                  Monitor your sales and commissions in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
