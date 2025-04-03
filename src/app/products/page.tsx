"use client";
import type React from "react";
import { toast } from "@/lib/toast";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState("24");
  const isInitialMount = useRef(true);
  const [availabilityFilter, setAvailabilityFilter] = useState({
    inStock: true,
    onSale: false,
  });
  const [shippingFilter, setShippingFilter] = useState("all");
  const [featuresFilter, setFeaturesFilter] = useState({
    bestseller: false,
    newArrival: false,
    ecoFriendly: false,
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(tempSearchQuery);

    // Only show toast if not initial render
    if (!isInitialMount.current) {
      toast({
        title: "Search applied",
        description: tempSearchQuery
          ? `Showing results for "${tempSearchQuery}"`
          : "Showing all products",
      });
    }
  };

  // Handle filter changes from the ProductFilters component
  const handleFilterChange = (
    categories: string[],
    price: [number, number],
    rating: number,
    availability = availabilityFilter,
    shipping = shippingFilter,
    features = featuresFilter
  ) => {
    setCategoryFilters(categories);
    setPriceRange(price);
    setRatingFilter(rating);
    setAvailabilityFilter(availability);
    setShippingFilter(shipping);
    setFeaturesFilter(features);

    // Close the mobile filter sheet after applying filters
    if (isFilterOpen) {
      setIsFilterOpen(false);
    }

    // Only show toast if not initial render
    if (!isInitialMount.current) {
      toast({
        title: "Filters applied",
        description: "Product list has been updated based on your filters",
      });
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setTempSearchQuery("");
    setCategoryFilters([]);
    setPriceRange([0, 1000]);
    setRatingFilter(0);
    setSortBy("featured");
    setAvailabilityFilter({ inStock: true, onSale: false });
    setShippingFilter("all");
    setFeaturesFilter({
      bestseller: false,
      newArrival: false,
      ecoFriendly: false,
    });

    toast({
      title: "Filters reset",
      description: "All filters have been cleared",
    });
  };

  // Set initial mount flag to false after first render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  return (
    <div className="container py-10 px-5 sm:px-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Products</h1>
          <p className="text-muted-foreground">
            Discover products you can sell to earn commissions
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form
            onSubmit={handleSearch}
            className="flex w-full items-center space-x-2 md:w-auto"
          >
            <Input
              placeholder="Search products..."
              className="h-9 w-full md:w-[300px] lg:w-[400px]"
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
            />
            <Button type="submit" size="sm" className="h-9">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 lg:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down products by applying filters
                  </SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <ProductFilters
                  className="flex flex-col space-y-6"
                  onFilterChange={(
                    categories,
                    price,
                    rating,
                    availability,
                    shipping,
                    features
                  ) =>
                    handleFilterChange(
                      categories,
                      price,
                      rating,
                      availability,
                      shipping,
                      features
                    )
                  }
                  onResetFilters={handleResetFilters}
                  initialCategories={categoryFilters}
                  initialPriceRange={priceRange}
                  initialRating={ratingFilter}
                />
              </SheetContent>
            </Sheet>

            <div className="hidden items-center gap-2 lg:flex">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to high</SelectItem>
                  <SelectItem value="price-desc">Price: High to low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="bestselling">Best selling</SelectItem>
                  <SelectItem value="rating">Highest rated</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={productsPerPage}
                onValueChange={setProductsPerPage}
              >
                <SelectTrigger className="h-9 w-[70px]">
                  <SelectValue placeholder="Show" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="36">36</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="hidden w-[240px] flex-col lg:flex">
            <ProductFilters
              className="sticky top-20 flex flex-col space-y-6"
              onFilterChange={(
                categories,
                price,
                rating,
                availability,
                shipping,
                features
              ) =>
                handleFilterChange(
                  categories,
                  price,
                  rating,
                  availability,
                  shipping,
                  features
                )
              }
              onResetFilters={handleResetFilters}
              initialCategories={categoryFilters}
              initialPriceRange={priceRange}
              initialRating={ratingFilter}
            />
          </div>

          <div className="flex-1">
            {searchQuery && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing results for{" "}
                  <span className="font-medium text-foreground">
                    "{searchQuery}"
                  </span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setTempSearchQuery("");
                  }}
                >
                  Clear search
                </Button>
              </div>
            )}

            <ProductGrid
              searchQuery={searchQuery}
              categoryFilter={categoryFilters}
              priceRange={priceRange}
              ratingFilter={ratingFilter}
              sortBy={sortBy}
              availabilityFilter={availabilityFilter}
              shippingFilter={shippingFilter}
              featuresFilter={featuresFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
