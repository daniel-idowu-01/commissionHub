"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface ProductFiltersProps {
  className?: string;
  onFilterChange?: (
    categories: string[],
    priceRange: [number, number],
    rating: number,
    availability: { inStock: boolean; onSale: boolean },
    shipping: string,
    features: { bestseller: boolean; newArrival: boolean; ecoFriendly: boolean }
  ) => void;
  onResetFilters?: () => void;
  initialCategories?: string[];
  initialPriceRange?: [number, number];
  initialRating?: number;
}

// Category data with counts
const categories = [
  { id: "electronics", name: "Electronics", count: 42 },
  { id: "home-kitchen", name: "Home & Kitchen", count: 24 },
  { id: "sports-outdoors", name: "Sports & Outdoors", count: 16 },
  { id: "beauty-personal-care", name: "Beauty & Personal Care", count: 12 },
  { id: "toys-games", name: "Toys & Games", count: 8 },
];

export function ProductFilters({
  className,
  onFilterChange,
  onResetFilters,
  initialCategories = [],
  initialPriceRange = [0, 1000],
  initialRating = 0,
}: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [priceRange, setPriceRange] =
    useState<[number, number]>(initialPriceRange);
  const [ratingFilter, setRatingFilter] = useState<number>(initialRating);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [availability, setAvailability] = useState({
    inStock: true,
    onSale: false,
  });
  const [shipping, setShipping] = useState("all");
  const [features, setFeatures] = useState({
    bestseller: false,
    newArrival: false,
    ecoFriendly: false,
  });

  // Update state when initial props change
  useEffect(() => {
    setSelectedCategories(initialCategories);
    setPriceRange(initialPriceRange);
    setRatingFilter(initialRating);
  }, [initialCategories, initialPriceRange, initialRating]);

  // Call the onFilterChange callback when filters change
  const handleFiltersChanged = () => {
    onFilterChange?.(
      selectedCategories,
      priceRange,
      ratingFilter,
      availability,
      shipping,
      features
    );
  };

  // Update the useEffect to call handleFiltersChanged when filters change
  useEffect(() => {
    handleFiltersChanged();
  }, [selectedCategories, priceRange, ratingFilter]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    }
    // No need to call handleFiltersChanged here as the useEffect will handle it
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      setRatingFilter(rating);
    } else {
      setRatingFilter(0);
    }
    // No need to call handleFiltersChanged here as the useEffect will handle it
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setRatingFilter(0);
    setAvailability({ inStock: true, onSale: false });
    setShipping("all");
    setFeatures({ bestseller: false, newArrival: false, ecoFriendly: false });
    setIsMoreFiltersOpen(false);
    onResetFilters?.();
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="font-medium">Categories</div>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id, checked as boolean)
                }
              />
              <Label htmlFor={category.id} className="text-sm font-normal">
                {category.name} ({category.count})
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div className="font-medium">Price Range</div>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommit={() => handleFiltersChanged()}
          className="py-4"
        />
        <div className="flex items-center justify-between">
          <div className="text-sm">${priceRange[0]}</div>
          <div className="text-sm">${priceRange[1]}</div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div className="font-medium">Seller Rating</div>
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}-up`}
                checked={ratingFilter === rating}
                onCheckedChange={(checked) =>
                  handleRatingChange(rating, checked as boolean)
                }
              />
              <Label
                htmlFor={`rating-${rating}-up`}
                className="text-sm font-normal flex items-center"
              >
                {rating}★ & up
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      <Collapsible
        open={isMoreFiltersOpen}
        onOpenChange={setIsMoreFiltersOpen}
        className="space-y-4"
      >
        <div className="space-y-4">
          <div className="font-medium">Availability</div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={availability.inStock}
                onCheckedChange={(checked) => {
                  setAvailability((prev) => ({
                    ...prev,
                    inStock: checked as boolean,
                  }));
                  // Call onFilterChange after state update
                  setTimeout(() => handleFiltersChanged(), 0);
                }}
              />
              <Label htmlFor="in-stock" className="text-sm font-normal">
                In Stock
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={availability.onSale}
                onCheckedChange={(checked) => {
                  setAvailability((prev) => ({
                    ...prev,
                    onSale: checked as boolean,
                  }));
                  // Call onFilterChange after state update
                  setTimeout(() => handleFiltersChanged(), 0);
                }}
              />
              <Label htmlFor="on-sale" className="text-sm font-normal">
                On Sale
              </Label>
            </div>
          </div>
        </div>

        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between mt-2"
          >
            {isMoreFiltersOpen ? "Less Filters" : "More Filters"}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isMoreFiltersOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="font-medium">Shipping</div>
            <RadioGroup
              value={shipping}
              onValueChange={(value) => {
                setShipping(value);
                // Call onFilterChange after state update
                setTimeout(() => handleFiltersChanged(), 0);
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-shipping" />
                <Label htmlFor="all-shipping" className="text-sm font-normal">
                  All
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free-shipping" />
                <Label htmlFor="free-shipping" className="text-sm font-normal">
                  Free Shipping
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="same-day" id="same-day" />
                <Label htmlFor="same-day" className="text-sm font-normal">
                  Same Day Delivery
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="font-medium">Product Features</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bestseller"
                  checked={features.bestseller}
                  onCheckedChange={(checked) => {
                    setFeatures((prev) => ({
                      ...prev,
                      bestseller: checked as boolean,
                    }));
                    // Call onFilterChange after state update
                    setTimeout(() => handleFiltersChanged(), 0);
                  }}
                />
                <Label htmlFor="bestseller" className="text-sm font-normal">
                  Bestseller
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-arrival"
                  checked={features.newArrival}
                  onCheckedChange={(checked) => {
                    setFeatures((prev) => ({
                      ...prev,
                      newArrival: checked as boolean,
                    }));
                    // Call onFilterChange after state update
                    setTimeout(() => handleFiltersChanged(), 0);
                  }}
                />
                <Label htmlFor="new-arrival" className="text-sm font-normal">
                  New Arrival
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eco-friendly"
                  checked={features.ecoFriendly}
                  onCheckedChange={(checked) => {
                    setFeatures((prev) => ({
                      ...prev,
                      ecoFriendly: checked as boolean,
                    }));
                    // Call onFilterChange after state update
                    setTimeout(() => handleFiltersChanged(), 0);
                  }}
                />
                <Label htmlFor="eco-friendly" className="text-sm font-normal">
                  Eco-Friendly
                </Label>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-4" />

      <Button variant="outline" className="w-full" onClick={handleResetFilters}>
        Reset Filters
      </Button>

      {/* Hidden button to apply filters */}
      <Button
        className="hidden"
        onClick={handleFiltersChanged}
        id="apply-filters-button"
      >
        Apply Filters
      </Button>
    </div>
  );
}
