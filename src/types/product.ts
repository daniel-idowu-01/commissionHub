import { Review } from "./reviews";

export interface Seller {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  products: number;
  createdAt: Date;
}

export interface Specification {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  productImages: string[];
  category: string;
  description: string;
  longDescription?: string;
  basePrice: number;
  recommendedPrice?: number;
  status: "in_stock" | "out_of_stock";
  specifications: Specification[];
  inventory: number;
  revenue: number;
  sales: number;
  discount: number;
  discountType: "percentage" | "flat";
  allowReselling: boolean;
  tags: string[];
  sellerId: Seller | string;
  reviews: Review[];
  averageRating: number;
  freeShipping?: boolean;
  bestSeller?: boolean;
  new?: boolean;
}
