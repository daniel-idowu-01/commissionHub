"use client";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/lib/toast";
import { Heart } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DUMMY_IMAGE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Update the ProductGrid component props interface
interface ProductGridProps {
  searchQuery?: string;
  categoryFilter?: string[];
  priceRange?: [number, number];
  ratingFilter?: number;
  sortBy?: string;
  availabilityFilter?: {
    inStock: boolean;
    onSale: boolean;
  };
  shippingFilter?: string;
  featuresFilter?: {
    bestseller: boolean;
    newArrival: boolean;
    ecoFriendly: boolean;
  };
}

// Update the ProductGrid component to use all filter props
export function ProductGrid({
  searchQuery = "",
  categoryFilter = [],
  priceRange = [0, 1000],
  ratingFilter = 0,
  sortBy = "featured",
  availabilityFilter = { inStock: true, onSale: false },
  shippingFilter = "all",
  featuresFilter = { bestseller: false, newArrival: false, ecoFriendly: false },
}: ProductGridProps) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { data, loading, error, sendRequest } = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    const getProducts = async () => {
      try {
        const products = await sendRequest("/api/products", "GET");
        setAllProducts(products || []);
        setFilteredProducts(products || []);
        setIsLoading(false);
        console.log("Products: ", products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setAllProducts([]);
        setFilteredProducts([]);
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter and sort products based on props
  useEffect(() => {
    let result = [...allProducts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          /* product.subcategory.toLowerCase().includes(query) || */
          product.sellerId.name.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter.length > 0) {
      result = result.filter(
        (product) =>
          categoryFilter.includes(product.category.toLowerCase()) /* ||
          categoryFilter.includes(product.subcategory.toLowerCase()) */
      );
    }

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.basePrice >= priceRange[0] && product.basePrice <= priceRange[1]
    );

    // Apply rating filter
    if (ratingFilter > 0) {
      result = result.filter((product) => product.averageRating >= ratingFilter);
    }

    // Apply availability filter
    if (availabilityFilter.inStock && !availabilityFilter.onSale) {
      // Only show in stock items
      result = result.filter((product) => product.inStock !== false);
    } else if (!availabilityFilter.inStock && availabilityFilter.onSale) {
      // Only show on sale items (for demo, let's consider items with id 2, 5, and 9 as on sale)
      result = result.filter((product) => ["2", "5", "9"].includes(product.id));
    } else if (availabilityFilter.inStock && availabilityFilter.onSale) {
      // Show both in stock and on sale items
      result = result.filter(
        (product) =>
          product.inStock !== false && ["2", "5", "9"].includes(product.id)
      );
    }

    // Apply shipping filter
    if (shippingFilter === "free") {
      // Only show items with free shipping
      result = result.filter((product) => product.freeShipping === true);
    } else if (shippingFilter === "same-day") {
      // For demo, let's consider items with id 1, 3, and 7 as same-day delivery
      result = result.filter((product) => ["1", "3", "7"].includes(product.id));
    }

    // Apply features filter
    if (featuresFilter.bestseller) {
      result = result.filter((product) => product.bestseller === true);
    }
    if (featuresFilter.newArrival) {
      result = result.filter((product) => product.new === true);
    }
    if (featuresFilter.ecoFriendly) {
      // For demo, let's consider items with id 6, 10 as eco-friendly
      result = result.filter((product) => ["6", "10"].includes(product.id));
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "newest":
        result.sort((a, b) => (a.new === b.new ? 0 : a.new ? -1 : 1));
        break;
      case "bestselling":
        result.sort((a, b) =>
          a.bestseller === b.bestseller ? 0 : a.bestseller ? -1 : 1
        );
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // featured - bestsellers first, then new items, then by rating
        result.sort((a, b) => {
          if (a.bestseller !== b.bestseller) return a.bestseller ? -1 : 1;
          if (a.new !== b.new) return a.new ? -1 : 1;
          return b.rating - a.rating;
        });
    }

    setFilteredProducts(result);
  }, [
    allProducts,
    searchQuery,
    categoryFilter,
    priceRange,
    ratingFilter,
    sortBy,
    availabilityFilter,
    shippingFilter,
    featuresFilter,
  ]);

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
    // Using setTimeout to ensure this runs after render is complete
    setTimeout(() => {
      toast({
        title: "Product selected for selling",
        description: `You're now setting up ${product.name} for sale`,
      });
    }, 0);
  };

  if (isLoading)
    return (
      <div className="container py-10 px-5 sm:px-10 h-screen">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold tracking-tight"></h1>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <CardHeader className="p-0">
              <div className="relative">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.productImages[0] || DUMMY_IMAGE}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                </Link>
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.bestseller && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    >
                      Bestseller
                    </Badge>
                  )}
                  {product.new && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      New
                    </Badge>
                  )}
                </div>
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
              <div className="text-sm text-muted-foreground mb-1">
                {product.category} / {/* {product.subcategory} */}
              </div>
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
                  by {product.sellerId.name}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
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
                {/* <span className="mx-2">•</span> */}
                <span>{product.reviews.length || 0} review(s)</span>
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
      )}
    </div>
  );
}
