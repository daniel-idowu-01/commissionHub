"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, ExternalLink, Eye, LineChart, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShareLinkGenerator } from "@/components/share-link-generator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for reseller links
const resellerLinks = [
  {
    id: "1",
    productId: "101",
    productName: "Wireless Headphones",
    image: "/placeholder.svg?height=80&width=80",
    originalSeller: "AudioTech",
    basePrice: 129.99,
    yourPrice: 149.99,
    commission: 20.0,
    clicks: 245,
    conversions: 18,
    conversionRate: 7.35,
    revenue: 2699.82,
    commissionEarned: 360.0,
    lastClicked: "2 hours ago",
    created: "2023-10-15",
  },
  {
    id: "2",
    productId: "102",
    productName: "Smart Watch",
    image: "/placeholder.svg?height=80&width=80",
    originalSeller: "TechWear",
    basePrice: 199.99,
    yourPrice: 219.99,
    commission: 20.0,
    clicks: 187,
    conversions: 12,
    conversionRate: 6.42,
    revenue: 2639.88,
    commissionEarned: 240.0,
    lastClicked: "5 hours ago",
    created: "2023-11-02",
  },
  {
    id: "3",
    productId: "103",
    productName: "Portable Speaker",
    image: "/placeholder.svg?height=80&width=80",
    originalSeller: "SoundGear",
    basePrice: 79.99,
    yourPrice: 89.99,
    commission: 10.0,
    clicks: 312,
    conversions: 25,
    conversionRate: 8.01,
    revenue: 2249.75,
    commissionEarned: 250.0,
    lastClicked: "1 day ago",
    created: "2023-09-28",
  },
  {
    id: "4",
    productId: "104",
    productName: "Digital Camera",
    image: "/placeholder.svg?height=80&width=80",
    originalSeller: "PhotoPro",
    basePrice: 349.99,
    yourPrice: 379.99,
    commission: 30.0,
    clicks: 156,
    conversions: 8,
    conversionRate: 5.13,
    revenue: 3039.92,
    commissionEarned: 240.0,
    lastClicked: "3 days ago",
    created: "2023-10-10",
  },
];

// Mock data for available products to create links for
const availableProducts = [
  {
    id: "201",
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    basePrice: 89.99,
    recommendedPrice: 99.99,
    image: "/placeholder.svg?height=80&width=80",
    seller: "HomeEssentials",
    category: "Home & Kitchen",
    rating: 4.4,
  },
  {
    id: "202",
    name: "Yoga Mat",
    description: "Non-slip, eco-friendly yoga mat with alignment lines",
    basePrice: 39.99,
    recommendedPrice: 49.99,
    image: "/placeholder.svg?height=80&width=80",
    seller: "FitLife",
    category: "Sports & Outdoors",
    rating: 4.9,
  },
  {
    id: "203",
    name: "Mechanical Keyboard",
    description: "RGB mechanical gaming keyboard with customizable keys",
    basePrice: 129.99,
    recommendedPrice: 149.99,
    image: "/placeholder.svg?height=80&width=80",
    seller: "GamerGear",
    category: "Electronics",
    rating: 4.7,
  },
];

// Mock data for link performance over time
const linkPerformanceData = [
  { date: "2023-11-01", clicks: 25, conversions: 2 },
  { date: "2023-11-02", clicks: 32, conversions: 3 },
  { date: "2023-11-03", clicks: 28, conversions: 2 },
  { date: "2023-11-04", clicks: 41, conversions: 4 },
  { date: "2023-11-05", clicks: 35, conversions: 3 },
  { date: "2023-11-06", clicks: 29, conversions: 2 },
  { date: "2023-11-07", clicks: 38, conversions: 3 },
  { date: "2023-11-08", clicks: 42, conversions: 4 },
  { date: "2023-11-09", clicks: 30, conversions: 2 },
  { date: "2023-11-10", clicks: 36, conversions: 3 },
  { date: "2023-11-11", clicks: 45, conversions: 5 },
  { date: "2023-11-12", clicks: 50, conversions: 4 },
  { date: "2023-11-13", clicks: 48, conversions: 4 },
  { date: "2023-11-14", clicks: 52, conversions: 5 },
];

export default function MyLinksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("30days");
  const [isCreateLinkDialogOpen, setIsCreateLinkDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newPrice, setNewPrice] = useState("");
  const [isLinkDetailsDialogOpen, setIsLinkDetailsDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);

  // Filter links based on search query
  const filteredLinks = resellerLinks.filter((link) => {
    if (!searchQuery) return true;
    return (
      link.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.originalSeller.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate total metrics
  const totalClicks = filteredLinks.reduce((sum, link) => sum + link.clicks, 0);
  const totalConversions = filteredLinks.reduce(
    (sum, link) => sum + link.conversions,
    0
  );
  const totalRevenue = filteredLinks.reduce(
    (sum, link) => sum + link.revenue,
    0
  );
  const totalCommission = filteredLinks.reduce(
    (sum, link) => sum + link.commissionEarned,
    0
  );
  const avgConversionRate =
    totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setNewPrice(product.recommendedPrice.toString());
  };

  const handleCreateLink = () => {
    // In a real app, you would create the link in your database
    setIsCreateLinkDialogOpen(false);
    setSelectedProduct(null);
    setNewPrice("");
  };

  const handleViewLinkDetails = (link: any) => {
    setSelectedLink(link);
    setIsLinkDetailsDialogOpen(true);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              My Referral Links
            </h1>
            <p className="text-muted-foreground">
              Create and manage your unique product links to earn commissions
            </p>
          </div>
          <Button onClick={() => setIsCreateLinkDialogOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Create New Link
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clicks
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalClicks.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConversions}</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgConversionRate.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                +1.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Commission Earned
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalCommission.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +15.3% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Links</TabsTrigger>
              <TabsTrigger value="top">Top Performers</TabsTrigger>
              <TabsTrigger value="recent">Recently Clicked</TabsTrigger>
            </TabsList>
            <div className="hidden md:flex items-center gap-2">
              <Input
                placeholder="Search links..."
                className="w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Referral Links</CardTitle>
                <CardDescription>
                  Track performance of all your unique product links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Your Price</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Clicks
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Conversions
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Conv. Rate
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Earned
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLinks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <p className="text-muted-foreground">
                                No links found
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsCreateLinkDialogOpen(true)}
                              >
                                Create New Link
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLinks.map((link) => (
                          <TableRow key={link.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={link.image || "/placeholder.svg"}
                                  alt={link.productName}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <div className="font-medium">
                                    {link.productName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    by {link.originalSeller}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>${link.yourPrice.toFixed(2)}</TableCell>
                            <TableCell>${link.commission.toFixed(2)}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {link.clicks}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {link.conversions}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {link.conversionRate.toFixed(2)}%
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${link.commissionEarned.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewLinkDetails(link)}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Links</CardTitle>
                <CardDescription>
                  Your links with the highest conversion rates and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Your Price</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Clicks
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Conversions
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Conv. Rate
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Earned
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sort by conversion rate for top performers */}
                      {[...filteredLinks]
                        .sort((a, b) => b.conversionRate - a.conversionRate)
                        .slice(0, 5)
                        .map((link) => (
                          <TableRow key={link.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={link.image || "/placeholder.svg"}
                                  alt={link.productName}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <div className="font-medium">
                                    {link.productName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    by {link.originalSeller}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>${link.yourPrice.toFixed(2)}</TableCell>
                            <TableCell>${link.commission.toFixed(2)}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {link.clicks}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {link.conversions}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {link.conversionRate.toFixed(2)}%
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${link.commissionEarned.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewLinkDetails(link)}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recently Clicked Links</CardTitle>
                <CardDescription>
                  Links that have been clicked most recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Your Price</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Clicks
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Last Clicked
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Conv. Rate
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Earned
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Sort by last clicked time */}
                      {filteredLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Image
                                src={link.image || "/placeholder.svg"}
                                alt={link.productName}
                                width={40}
                                height={40}
                                className="rounded-md"
                              />
                              <div>
                                <div className="font-medium">
                                  {link.productName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  by {link.originalSeller}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>${link.yourPrice.toFixed(2)}</TableCell>
                          <TableCell>${link.commission.toFixed(2)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {link.clicks}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {link.lastClicked}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {link.conversionRate.toFixed(2)}%
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            ${link.commissionEarned.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewLinkDetails(link)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create New Link Dialog */}
      <Dialog
        open={isCreateLinkDialogOpen}
        onOpenChange={setIsCreateLinkDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Referral Link</DialogTitle>
            <DialogDescription>
              Select a product to create a unique referral link. You'll earn
              commission on each sale.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-1">
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm">
                        Base: ${product.basePrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        by {product.seller}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {availableProducts.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">
                    No products found matching your search
                  </p>
                </div>
              )}
            </div>

            {selectedProduct && (
              <>
                <div className="space-y-4 rounded-md border p-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">{selectedProduct.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Base Price: ${selectedProduct.basePrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Seller: {selectedProduct.seller}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-price">Your Selling Price</Label>
                    <Input
                      id="new-price"
                      type="number"
                      min={selectedProduct.basePrice + 0.01}
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Your commission: $
                      {(
                        Number.parseFloat(newPrice || "0") -
                        selectedProduct.basePrice
                      ).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Recommended price: $
                      {selectedProduct.recommendedPrice.toFixed(2)} ($
                      {(
                        selectedProduct.recommendedPrice -
                        selectedProduct.basePrice
                      ).toFixed(2)}{" "}
                      commission)
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-medium mb-2">
                      Preview Your Unique Link
                    </h4>
                    <ShareLinkGenerator
                      productId={selectedProduct.id}
                      productName={selectedProduct.name}
                      resellerId="your-reseller-id"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateLinkDialogOpen(false);
                setSelectedProduct(null);
                setNewPrice("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateLink}
              disabled={!selectedProduct || !newPrice}
            >
              Create Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Details Dialog */}
      <Dialog
        open={isLinkDetailsDialogOpen}
        onOpenChange={setIsLinkDetailsDialogOpen}
      >
        <DialogContent className="w-full max-w-2xl rounded-lg h-[95%] overflow-y-auto">
          {selectedLink && (
            <>
              <DialogHeader className="px-6 pt-6 pb-2">
                <DialogTitle className="text-2xl font-bold">
                  Link Details
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Performance metrics and sharing options for your unique link
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 px-6 pb-6">
                {/* Product Info Section */}
                <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={selectedLink.image || "/placeholder.svg"}
                        alt={selectedLink.productName}
                        width={96}
                        height={96}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedLink.productName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        by {selectedLink.originalSeller}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Your Price:</span>
                          <span className="font-medium">
                            ${selectedLink.yourPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Price:</span>
                          <span className="text-gray-700">
                            ${selectedLink.basePrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Commission:</span>
                          <span className="font-medium text-green-600">
                            ${selectedLink.commission.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300"
                    asChild
                  >
                    <Link
                      href={`/products/${selectedLink.productId}`}
                      target="_blank"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Product Page
                    </Link>
                  </Button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 bg-white">
                    <p className="text-sm text-gray-500">Clicks</p>
                    <p className="text-2xl font-bold mt-1">
                      {selectedLink.clicks.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-white">
                    <p className="text-sm text-gray-500">Conversions</p>
                    <p className="text-2xl font-bold mt-1">
                      {selectedLink.conversions}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-white">
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-bold mt-1">
                      {selectedLink.conversionRate.toFixed(2)}%
                    </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-white">
                    <p className="text-sm text-gray-500">Commission Earned</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      ${selectedLink.commissionEarned.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Unique Link Section */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Your Unique Link</h4>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <ShareLinkGenerator
                      productId={selectedLink.productId}
                      productName={selectedLink.productName}
                      resellerId="your-reseller-id"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Share this unique link to earn commission when customers
                    make a purchase.
                  </p>
                </div>

                {/* Performance Chart Section */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Link Performance</h4>
                  <div className="h-64 w-full rounded-lg border bg-white p-4 flex items-center justify-center">
                    <p className="text-gray-400">
                      Performance chart would be displayed here
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Chart shows clicks and conversions over the selected time
                    period
                  </p>
                </div>

                {/* Link Information */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold">Link Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{selectedLink.created}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-500">Last Clicked</p>
                      <p className="font-medium">{selectedLink.lastClicked}</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="px-6 pb-6 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsLinkDetailsDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Link
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
