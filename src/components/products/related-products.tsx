"use client";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { toast } from "@/lib/toast";
import { Heart } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import Spinner from "@/components/spinner";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RelatedProductsProps {
  category: string;
  productId: string;
}

export function RelatedProducts({ category, productId }: RelatedProductsProps) {
  const { loading, sendRequest } = useApi();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[] | null>(null);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    const getProducts = async () => {
      try {
        const response = await sendRequest(
          `/api/products/?category=${category}`,
          "GET"
        );

        const filteredProducts = response.filter(
          (product: Product) => product.id !== productId
        );

        setProducts(filteredProducts || null);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProducts(null);
      }
    };

    getProducts();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isCurrentlyInWishlist = prev.includes(productId);
      return isCurrentlyInWishlist
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
    });

    // Get current wishlist state to determine the action
    const isCurrentlyInWishlist = wishlist.includes(productId);

    // Show toast notification outside of the state update function
    if (isCurrentlyInWishlist) {
      // Using setTimeout to ensure this runs after render is complete
      setTimeout(() => {
        toast({
          title: "Removed from wishlist",
          description: "Product has been removed from your wishlist",
        });
      }, 0);
    } else {
      setTimeout(() => {
        toast({
          title: "Added to wishlist",
          description: "Product has been added to your wishlist",
        });
      }, 0);
    }
  };

  const handleSellClick = (product: any) => {
    toast({
      title: "Product selected for selling",
      description: `You're now setting up ${product.name} for sale`,
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products && products.length > 0 ? (
        products.map((product: Product) => (
          <Card key={product.id} className="overflow-hidden group">
            <CardHeader className="p-0">
              <div className="relative">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.productImages[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      wishlist.includes(product.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <Link
                href={`/products/${product.id}`}
                className="hover:underline"
              >
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </Link>
              <CardDescription className="line-clamp-2 mt-2">
                {product.description}
              </CardDescription>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-medium">
                  ${product.basePrice.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  by{" "}
                  {typeof product?.sellerId === "object"
                    ? product.sellerId.name
                    : product?.sellerId}
                </span>
              </div>
              <div className="mt-2 flex items-center text-sm">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1">{product.averageRating}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/products/${product.id}`}>View Details</Link>
              </Button>
              <Button size="sm" onClick={() => handleSellClick(product)}>
                Sell This
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="col-span-full">
          <h3 className="text-lg font-medium">No related products found</h3>
          <p className="text-muted-foreground mt-2">
            It seems like there are no products in this category. Please check
            back later or explore other categories.
          </p>
        </div>
      )}
    </div>
  );
}
