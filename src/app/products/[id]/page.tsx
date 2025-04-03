"use client";
import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/lib/toast";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
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
const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life and comfortable over-ear design.",
    longDescription: `
    <p>Experience immersive sound with our premium wireless headphones. These over-ear headphones feature advanced noise-cancelling technology that blocks out ambient noise, allowing you to focus on your music or calls.</p>
    
    <p>With a 30-hour battery life, you can enjoy your favorite music all day long without worrying about recharging. The comfortable memory foam ear cushions and adjustable headband ensure a perfect fit for extended listening sessions.</p>
    
    <h3>Key Features:</h3>
    <ul>
      <li>Active noise cancellation technology</li>
      <li>30-hour battery life</li>
      <li>Bluetooth 5.0 connectivity</li>
      <li>Built-in microphone for calls</li>
      <li>Memory foam ear cushions</li>
      <li>Foldable design for easy storage</li>
      <li>Compatible with voice assistants</li>
    </ul>
    
    <h3>What's in the Box:</h3>
    <ul>
      <li>Wireless headphones</li>
      <li>USB-C charging cable</li>
      <li>3.5mm audio cable</li>
      <li>Carrying case</li>
      <li>User manual</li>
    </ul>
  `,
    basePrice: 149.99,
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
    seller: {
      name: "AudioTech",
      rating: 4.8,
      reviews: 124,
      products: 15,
      joined: "2020",
      id: "seller-1",
    },
    category: "Electronics",
    subcategory: "Audio",
    rating: 4.8,
    reviews: 124,
    bestseller: true,
    new: false,
    inStock: true,
    freeShipping: true,
    specifications: [
      { name: "Brand", value: "AudioTech" },
      { name: "Model", value: "AT-WH100" },
      { name: "Color", value: "Black" },
      { name: "Connectivity", value: "Bluetooth 5.0" },
      { name: "Battery Life", value: "30 hours" },
      { name: "Charging Time", value: "2 hours" },
      { name: "Weight", value: "250g" },
      { name: "Warranty", value: "1 year" },
    ],
  },
  {
    id: "2",
    name: "Smart Watch",
    description:
      "Fitness and health tracking smartwatch with heart rate monitor, sleep tracking, and 7-day battery life.",
    longDescription: `
    <p>Track your fitness goals and monitor your health with our advanced smartwatch. This sleek wearable device features a high-resolution display and a comprehensive suite of health and fitness tracking capabilities.</p>
    
    <p>With a 7-day battery life, you can wear it all week without worrying about recharging. The water-resistant design makes it perfect for swimming and other water activities.</p>
    
    <h3>Key Features:</h3>
    <ul>
      <li>Heart rate monitoring</li>
      <li>Sleep tracking</li>
      <li>Step counter and activity tracking</li>
      <li>Water-resistant (50m)</li>
      <li>7-day battery life</li>
      <li>Customizable watch faces</li>
      <li>Smartphone notifications</li>
    </ul>
    
    <h3>What's in the Box:</h3>
    <ul>
      <li>Smartwatch</li>
      <li>Charging dock</li>
      <li>User manual</li>
    </ul>
  `,
    basePrice: 199.99,
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
    seller: {
      name: "TechWear",
      rating: 4.6,
      reviews: 89,
      products: 8,
      joined: "2021",
      id: "seller-2",
    },
    category: "Electronics",
    subcategory: "Wearables",
    rating: 4.6,
    reviews: 89,
    bestseller: false,
    new: true,
    inStock: true,
    freeShipping: true,
    specifications: [
      { name: "Brand", value: "TechWear" },
      { name: "Model", value: "TW-SW200" },
      { name: "Color", value: "Silver" },
      { name: "Display", value: "1.3 inch AMOLED" },
      { name: "Battery Life", value: "7 days" },
      { name: "Water Resistance", value: "50m" },
      { name: "Weight", value: "45g" },
      { name: "Warranty", value: "1 year" },
    ],
  },
];

export default function ProductPage() {
  const router = useRouter();
  const params = useParams()
  const searchParams = useSearchParams();
  const referrerId = searchParams.get("ref");

  // Find the product by ID
  const productId = params.id;
  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(product.basePrice * 1.2);
  const [commission, setCommission] = useState(product.basePrice * 0.2);
  const [markupPercentage, setMarkupPercentage] = useState(20);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Load wishlist state from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      const wishlist = JSON.parse(savedWishlist);
      setIsInWishlist(wishlist.includes(product.id));
    }
  }, [product.id]);

  // Handle wishlist toggle
  const toggleWishlist = () => {
    const savedWishlist = localStorage.getItem("wishlist");
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    const wasInWishlist = isInWishlist;

    if (isInWishlist) {
      wishlist = wishlist.filter((id: string) => id !== product.id);
    } else {
      wishlist.push(product.id);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsInWishlist(!isInWishlist);

    // Show toast notification outside of the state update function
    setTimeout(() => {
      if (wasInWishlist) {
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist`,
        });
      } else {
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist`,
        });
      }
    }, 0);
  };

  // Handle markup slider change
  const handleMarkupChange = (value: number[]) => {
    const percentage = value[0];
    setMarkupPercentage(percentage);
    const markup = (product.basePrice * percentage) / 100;
    setCommission(markup);
    setSellingPrice(product.basePrice + markup);
  };

  // Handle selling price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number.parseFloat(e.target.value.replace(/[^0-9.]/g, ""));

    if (!isNaN(newPrice) && newPrice >= product.basePrice) {
      setSellingPrice(newPrice);
      const newCommission = newPrice - product.basePrice;
      setCommission(newCommission);
      const newPercentage = Math.round(
        (newCommission / product.basePrice) * 100
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
          product.name
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

  return (
    <div className="container py-10">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div
            className="overflow-hidden rounded-lg border bg-white cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          >
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-lg border bg-white cursor-pointer ${
                  selectedImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
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
                <DialogTitle>{product.name}</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-lg border bg-white cursor-pointer w-16 h-16 ${
                      selectedImage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {product.category} / {product.subcategory}
              </div>
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

            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">
                  {product.rating}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {product.reviews} reviews
              </div>
              <div className="text-sm text-muted-foreground">
                Sold by{" "}
                <span className="font-medium">{product.seller.name}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xl font-bold">
                Base Price: ${product.basePrice.toFixed(2)}
              </div>
              {product.inStock ? (
                <div className="mt-1 text-sm font-medium text-green-600">
                  In Stock
                </div>
              ) : (
                <div className="mt-1 text-sm font-medium text-red-600">
                  Out of Stock
                </div>
              )}
              {product.freeShipping && (
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
                      value={`$${product.basePrice.toFixed(2)}`}
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
                  >
                    Buy Now
                  </Button>

                  <Dialog
                    open={isListingDialogOpen}
                    onOpenChange={setIsListingDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">Sell This Product</Button>
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
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="rounded-md"
                          />
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Sold by {product.seller.name}
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
                              ${product.basePrice.toFixed(2)}
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
      </div>

      <div className="mt-10 space-y-10">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviews})
            </TabsTrigger>
            <TabsTrigger value="seller">Seller Information</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            />
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="rounded-lg border">
              <table className="w-full">
                <tbody>
                  {product.specifications.map((spec, index) => (
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
                <div className="text-5xl font-bold">{product.rating}</div>
                <div className="space-y-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Based on {product.reviews} reviews
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                {/* Mock reviews */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">Sarah J.</div>
                    <div className="text-sm text-muted-foreground">
                      2 weeks ago
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 5
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p>
                    Absolutely love this product! The quality is exceptional and
                    it works exactly as described.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">Michael T.</div>
                    <div className="text-sm text-muted-foreground">
                      1 month ago
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p>
                    Great product for the price. Shipping was fast and the item
                    arrived in perfect condition.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">Emily R.</div>
                    <div className="text-sm text-muted-foreground">
                      2 months ago
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 5
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p>
                    I've tried many similar products and this one is by far the
                    best. Highly recommend!
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seller" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{product.seller.name}</CardTitle>
                <CardDescription>
                  Seller since {product.seller.joined}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.seller.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm">
                    {product.seller.rating} rating from {product.seller.reviews}{" "}
                    reviews
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">
                      {product.seller.products}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Products
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold">
                      {product.seller.reviews}
                    </div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                </div>

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
          <RelatedProducts />
        </div>
      </div>

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
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Base Price: ${product.basePrice.toFixed(2)}
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
                productId={product.id}
                productName={product.name}
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
