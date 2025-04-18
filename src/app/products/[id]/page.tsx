"use client";
import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/lib/toast";
import { useApi } from "@/hooks/use-api";
import { useState, useEffect } from "react";
import { DUMMY_IMAGE } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Product, ReviewFormData } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ShareLinkGenerator } from "@/components/share-link-generator";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { RelatedProducts } from "@/components/products/related-products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  Heart,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock product data
// const products = [
//   {
//     id: "1",
//     name: "Wireless Headphones",
//     description:
//       "Premium noise-cancelling wireless headphones with 30-hour battery life and comfortable over-ear design.",
//     longDescription: `
//     <p>Experience immersive sound with our premium wireless headphones. These over-ear headphones feature advanced noise-cancelling technology that blocks out ambient noise, allowing you to focus on your music or calls.</p>

//     <p>With a 30-hour battery life, you can enjoy your favorite music all day long without worrying about recharging. The comfortable memory foam ear cushions and adjustable headband ensure a perfect fit for extended listening sessions.</p>

//     <h3>Key Features:</h3>
//     <ul>
//       <li>Active noise cancellation technology</li>
//       <li>30-hour battery life</li>
//       <li>Bluetooth 5.0 connectivity</li>
//       <li>Built-in microphone for calls</li>
//       <li>Memory foam ear cushions</li>
//       <li>Foldable design for easy storage</li>
//       <li>Compatible with voice assistants</li>
//     </ul>

//     <h3>What's in the Box:</h3>
//     <ul>
//       <li>Wireless headphones</li>
//       <li>USB-C charging cable</li>
//       <li>3.5mm audio cable</li>
//       <li>Carrying case</li>
//       <li>User manual</li>
//     </ul>
//   `,
//     basePrice: 149.99,
//     images: [
//       "/placeholder.svg?height=500&width=500",
//       "/placeholder.svg?height=500&width=500",
//       "/placeholder.svg?height=500&width=500",
//       "/placeholder.svg?height=500&width=500",
//     ],
//     seller: {
//       name: "AudioTech",
//       rating: 4.8,
//       reviews: 124,
//       products: 15,
//       joined: "2020",
//       id: "seller-1",
//     },
//     category: "Electronics",
//     subcategory: "Audio",
//     rating: 4.8,
//     reviews: 124,
//     bestseller: true,
//     new: false,
//     inStock: true,
//     freeShipping: true,
//     specifications: [
//       { name: "Brand", value: "AudioTech" },
//       { name: "Model", value: "AT-WH100" },
//       { name: "Color", value: "Black" },
//       { name: "Connectivity", value: "Bluetooth 5.0" },
//       { name: "Battery Life", value: "30 hours" },
//       { name: "Charging Time", value: "2 hours" },
//       { name: "Weight", value: "250g" },
//       { name: "Warranty", value: "1 year" },
//     ],
//   },
// ];

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const { sendRequest } = useApi();
  const searchParams = useSearchParams();
  const referrerId = searchParams.get("ref");

  const productId = params.id;

  const [quantity, setQuantity] = useState(1);
  const [commission, setCommission] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [markupPercentage, setMarkupPercentage] = useState(20);
  const [product, setProduct] = useState<Product | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const getProducts = async () => {
      setIsProductLoading(true);
      try {
        const response = await sendRequest(`/api/products/${productId}`, "GET");
        setProduct(response.product || null);
        if (response) {
          setCommission(response.product.basePrice * 0.2);
          setSellingPrice(response.product.basePrice * 1.2);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setIsProductLoading(false);
      }
    };

    getProducts();
  }, [productId]);

  // Load wishlist state from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist && product) {
      const wishlist = JSON.parse(savedWishlist);
      setIsInWishlist(wishlist.includes(product.id));
    }
  }, [product?.id]);

  // Handle wishlist toggle
  const toggleWishlist = () => {
    const savedWishlist = localStorage.getItem("wishlist");
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    const wasInWishlist = isInWishlist;

    if (isInWishlist) {
      wishlist = wishlist.filter((id: string) => id !== product?.id);
    } else {
      wishlist.push(product?.id);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsInWishlist(!isInWishlist);

    setTimeout(() => {
      if (wasInWishlist) {
        toast({
          title: "Removed from wishlist",
          description: `${product?.name} has been removed from your wishlist`,
        });
      } else {
        toast({
          title: "Added to wishlist",
          description: `${product?.name} has been added to your wishlist`,
        });
      }
    }, 0);
  };

  // Handle review form change
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      await sendRequest(
        `/api/products/${productId}/reviews`,
        "POST",
        reviewForm
      );
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setReviewForm({ rating: 5, comment: "" });

      const response = await sendRequest(`/api/products/${productId}`, "GET");
      setProduct(response.product);
    } catch (error: any) {
      toast({
        title: "Error submitting review",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle markup slider change
  const handleMarkupChange = (value: number[]) => {
    if (!product) return;
    const percentage = value[0];
    setMarkupPercentage(percentage);
    const markup = (product.basePrice * percentage) / 100;
    setCommission(markup);
    setSellingPrice(product.basePrice + markup);
  };

  // Handle selling price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number.parseFloat(e.target.value.replace(/[^0-9.]/g, ""));

    if (
      !isNaN(newPrice) &&
      product &&
      typeof product.basePrice === "number" &&
      newPrice >= product.basePrice
    ) {
      setSellingPrice(newPrice);
      const newCommission = newPrice - product?.basePrice;
      setCommission(newCommission);
      const newPercentage = Math.round(
        (newCommission / product?.basePrice) * 100
      );
      setMarkupPercentage(newPercentage > 50 ? 50 : newPercentage);
    }
  };

  // Handle share button click
  const handleShare = async () => {
    setIsShareDialogOpen(true);
  };

  // Handle sell this product button click
  const handleSellProduct = () => {
    setIsListingDialogOpen(false);
    setTimeout(() => {
      toast({
        title: "Product listed for sale",
        description: `You're now selling ${
          product?.name
        } for $${sellingPrice.toFixed(2)}`,
      });
    }, 0);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    // add the product to the cart state or make an API call
    setTimeout(() => {
      toast({
        title: "Added to cart",
        description: `${quantity} ${
          quantity === 1 ? "item" : "items"
        } added to your cart`,
      });
    }, 0);
  };

  // Handle buy now
  const handleBuyNow = () => {
    // Add to cart first
    handleAddToCart();
    // Then navigate to checkout
    router.push("/checkout");
  };

  // If this is a referral link, show a banner
  const isReferralLink = !!referrerId;

  if (isProductLoading)
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
    <div className="container py-10 px-5 sm:px-10">
      {isReferralLink && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-center">
            You're viewing this product through a referral link. Your purchase
            will support the referrer.
          </p>
        </div>
      )}

      <div className="mb-6">
        <Link
          href="/products"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div
            className="overflow-hidden rounded-lg border bg-white cursor-pointer h-[500px] w-full"
            onClick={() => setIsImageModalOpen(true)}
          >
            <Image
              src={product?.productImages?.[selectedImage] || DUMMY_IMAGE}
              alt={product?.name || "Product Image"}
              width={500}
              height={500}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product?.productImages?.map((image, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-lg border bg-white cursor-pointer ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || DUMMY_IMAGE}
                  alt={`${product?.name} - Image ${index + 1}`}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Image Modal */}
          <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{product?.name}</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center">
                <Image
                  src={product?.productImages?.[selectedImage] || DUMMY_IMAGE}
                  alt={product?.name || "Product Image"}
                  width={800}
                  height={800}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {/* {product?.productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-lg border bg-white cursor-pointer w-16 h-16 ${
                      selectedImage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || DUMMY_IMAGE}
                      alt={`${product?.name} - Image ${index + 1}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))} */}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {product?.category} {/* / {product?.subCategory} */}
              </div>
              {product?.bestSeller && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                >
                  Bestseller
                </Badge>
              )}
              {product?.new && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-100"
                >
                  New
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold">{product?.name}</h1>

            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product?.averageRating ?? 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">
                  {product?.averageRating}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {product?.reviews?.length || 0} review(s)
              </div>
              <div className="text-sm text-muted-foreground">
                Sold by{" "}
                <span className="font-medium">
                  {typeof product?.sellerId === "object"
                    ? product.sellerId.name
                    : product?.sellerId}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xl font-bold">
                Base Price: ${product?.basePrice?.toFixed(2) ?? "0.00"}
              </div>
              {product?.status === "in_stock" ? (
                <div className="mt-1 text-sm font-medium text-green-600">
                  In Stock
                </div>
              ) : (
                <div className="mt-1 text-sm font-medium text-red-600">
                  Out of Stock
                </div>
              )}
              {product?.freeShipping && (
                <div className="mt-1 text-sm text-muted-foreground">
                  Free Shipping
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Set Your Selling Price</h2>
              <p className="text-sm text-muted-foreground">
                Set your own price and earn the difference as commission. We
                recommend a 20% markup.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="base-price">Base Price</Label>
                    <Input
                      id="base-price"
                      value={`$${product?.basePrice?.toFixed(2) ?? "0.00"}`}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="your-price">Your Selling Price</Label>
                    <Input
                      id="your-price"
                      value={`$${sellingPrice.toFixed(2)}`}
                      onChange={handlePriceChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Your Commission</Label>
                    <div className="font-medium text-green-600">
                      ${commission.toFixed(2)}
                    </div>
                  </div>
                  <Slider
                    min={10}
                    max={50}
                    step={1}
                    value={[markupPercentage]}
                    onValueChange={handleMarkupChange}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>10% Markup</div>
                    <div>20% (Recommended)</div>
                    <div>50% Markup</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="quantity">Quantity:</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value) || 1)
                    }
                    className="w-20"
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>

                  <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={handleBuyNow}
                    disabled={product?.status !== "in_stock"}
                  >
                    Buy Now
                  </Button>

                  <Dialog
                    open={isListingDialogOpen}
                    onOpenChange={setIsListingDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={product?.status !== "in_stock"}
                      >
                        Sell This Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Listing</DialogTitle>
                        <DialogDescription>
                          You're about to list this product for sale. Please
                          confirm the details below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                          <Image
                            src={product?.productImages?.[0] || DUMMY_IMAGE}
                            alt={product?.name || "Product Image"}
                            width={80}
                            height={80}
                            className="rounded-md"
                          />
                          <div>
                            <h4 className="font-medium">{product?.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Sold by{" "}
                              {typeof product?.sellerId === "object"
                                ? product.sellerId.name
                                : product?.sellerId}
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Base Price
                            </p>
                            <p className="font-medium">
                              ${product?.basePrice?.toFixed(2) ?? "0.00"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Your Selling Price
                            </p>
                            <p className="font-medium">
                              ${sellingPrice.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Your Commission
                            </p>
                            <p className="font-medium text-green-600">
                              ${commission.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Markup Percentage
                            </p>
                            <p className="font-medium">{markupPercentage}%</p>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsListingDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSellProduct}>
                          Confirm Listing
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleWishlist}
                    className={isInWishlist ? "bg-red-50" : ""}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isInWishlist ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-10">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product?.reviews?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="seller">Seller Information</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: product?.longDescription ?? "",
              }}
            />
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="rounded-lg border">
              <table className="w-full">
                <tbody>
                  {(product?.specifications || []).map((spec, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-muted/50" : ""}
                    >
                      <td className="px-4 py-2 font-medium">{spec.name}</td>
                      <td className="px-4 py-2">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold">
                  {product?.averageRating}
                </div>
                <div className="space-y-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product?.averageRating ?? 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Based on {product?.reviews?.length || 0} reviews
                  </div>
                </div>
              </div>

              <Separator />

              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                  <CardDescription>
                    Share your experience with this product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex items-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setReviewForm({ ...reviewForm, rating: star })
                            }
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= reviewForm.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="review-comment">Your Review</Label>
                      <Textarea
                        id="review-comment"
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            comment: e.target.value,
                          })
                        }
                        placeholder="What did you like or dislike about this product?"
                        rows={4}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSubmittingReview}>
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Separator />

              {/* Reviews List */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>

                {product?.reviews?.length ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{review.userId.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      <Separator />
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seller" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {typeof product?.sellerId === "object"
                    ? product.sellerId.name
                    : product?.sellerId}
                </CardTitle>
                <CardDescription>
                  Seller since{" "}
                  {typeof product?.sellerId === "object"
                    ? new Date(product.sellerId.createdAt).getFullYear()
                    : "N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div className="flex items-center gap-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i <
                          Math.floor(
                            typeof product?.sellerId === "object"
                              ? product.averageRating
                              : 0
                          )
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    {typeof product?.sellerId === "object"
                      ? product.sellerId.rating
                      : 0}{" "}
                    rating from{" "}
                    {typeof product?.sellerId === "object"
                      ? product.sellerId.reviews
                      : 0}{" "}
                    reviews
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">
                      {typeof product?.sellerId === "object"
                        ? product.sellerId.products
                        : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Products
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">
                      {typeof product?.sellerId === "object"
                        ? product.sellerId.reviews
                        : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                </div> */}

                <div className="space-y-2">
                  <div className="font-medium">Seller Guarantees:</div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Authentic Products</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">30-Day Returns</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Products by This Seller
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <RelatedProducts
            category={product?.category || ""}
            productId={product?.id || ""}
          />
        </div>
      </section>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share This Product</DialogTitle>
            <DialogDescription>
              Generate a unique link to share this product and earn commission
              on sales
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src={product?.productImages?.[0] || DUMMY_IMAGE}
                alt={product?.name || "Product Image"}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div>
                <h4 className="font-medium">{product?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Base Price: ${product?.basePrice?.toFixed(2) ?? "0.00"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Your Price: ${sellingPrice.toFixed(2)}
                </p>
                <p className="text-sm font-medium text-green-600">
                  Your Commission: ${commission.toFixed(2)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Your Unique Referral Link</h4>
              <ShareLinkGenerator
                productId={product?.id || ""}
                productName={product?.name || ""}
                resellerId="your-reseller-id"
              />
              <p className="text-sm text-muted-foreground mt-2">
                When someone purchases through your link, you'll earn $
                {commission.toFixed(2)} per sale
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsShareDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
