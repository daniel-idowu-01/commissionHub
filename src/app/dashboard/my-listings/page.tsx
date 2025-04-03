"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for listings
const myListings = [
  {
    id: "1",
    productId: "101",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    basePrice: 129.99,
    yourPrice: 149.99,
    commission: 20.0,
    sales: 12,
    revenue: 1799.88,
    commissionEarned: 240.0,
    image: "/placeholder.svg?height=80&width=80",
    originalSeller: "AudioTech",
    status: "active",
    created: "2023-10-15",
  },
  {
    id: "2",
    productId: "102",
    name: "Smart Watch",
    description: "Fitness and health tracking smartwatch",
    basePrice: 199.99,
    yourPrice: 219.99,
    commission: 20.0,
    sales: 8,
    revenue: 1759.92,
    commissionEarned: 160.0,
    image: "/placeholder.svg?height=80&width=80",
    originalSeller: "TechWear",
    status: "active",
    created: "2023-11-02",
  },
  {
    id: "3",
    productId: "103",
    name: "Portable Speaker",
    description: "Waterproof bluetooth speaker with 20-hour battery life",
    basePrice: 79.99,
    yourPrice: 89.99,
    commission: 10.0,
    sales: 15,
    revenue: 1349.85,
    commissionEarned: 150.0,
    image: "/placeholder.svg?height=80&width=80",
    originalSeller: "SoundGear",
    status: "active",
    created: "2023-09-28",
  },
  {
    id: "4",
    productId: "104",
    name: "Digital Camera",
    description: "4K digital camera with 30x optical zoom",
    basePrice: 349.99,
    yourPrice: 379.99,
    commission: 30.0,
    sales: 5,
    revenue: 1899.95,
    commissionEarned: 150.0,
    image: "/placeholder.svg?height=80&width=80",
    originalSeller: "PhotoPro",
    status: "paused",
    created: "2023-10-10",
  },
];

// Mock data for products available to list
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

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editPrice, setEditPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // Filter listings based on active tab
  const filteredListings = myListings.filter((listing) => {
    if (activeTab === "active") return listing.status === "active";
    if (activeTab === "paused") return listing.status === "paused";
    return true; // "all" tab
  });

  // Filter available products based on search query
  const filteredProducts = availableProducts.filter((product) => {
    if (!searchQuery) return true;
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleEditListing = (listing: any) => {
    setSelectedListing(listing);
    setEditPrice(listing.yourPrice.toString());
    setIsEditDialogOpen(true);
  };

  const handleDeleteListing = (listing: any) => {
    setSelectedListing(listing);
    setIsDeleteDialogOpen(true);
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setNewPrice(product.recommendedPrice.toString());
  };

  const handleSaveEdit = () => {
    const price = Number.parseFloat(editPrice);
    if (isNaN(price) || price <= selectedListing.basePrice) {
      toast({
        title: "Invalid price",
        description: "Price must be greater than the base price",
        variant: "destructive",
      });
      return;
    }

    // update the listing in your database
    toast({
      title: "Listing updated",
      description: `${selectedListing.name} price updated to $${price.toFixed(
        2
      )}`,
    });
    setIsEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    // delete or archive the listing in your database
    toast({
      title: "Listing removed",
      description: `${selectedListing.name} has been removed from your listings`,
    });
    setIsDeleteDialogOpen(false);
  };

  const handleCreateListing = () => {
    const price = Number.parseFloat(newPrice);
    if (isNaN(price) || price <= selectedProduct.basePrice) {
      toast({
        title: "Invalid price",
        description: "Price must be greater than the base price",
        variant: "destructive",
      });
      return;
    }

    // create the listing in your database
    toast({
      title: "Listing created",
      description: `${selectedProduct.name} is now listed for $${price.toFixed(
        2
      )}`,
    });
    setIsAddDialogOpen(false);
    setSelectedProduct(null);
    setNewPrice("");
  };

  const toggleListingStatus = (listing: any) => {
    const newStatus = listing.status === "active" ? "paused" : "active";
    // update the listing status in your database
    toast({
      title: `Listing ${newStatus}`,
      description: `${listing.name} is now ${newStatus}`,
    });
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-muted-foreground">
              Manage your product listings and track your commissions
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Button>
        </div>

        <Tabs defaultValue="active" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="all">All Listings</TabsTrigger>
            </TabsList>
            <div className="hidden md:flex items-center gap-2">
              <Input
                placeholder="Search listings..."
                className="w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
                <CardDescription>
                  Products you are currently selling. You earn commission on
                  each sale.
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
                          Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Revenue
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Earned
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredListings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <p className="text-muted-foreground">
                                No listings found
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddDialogOpen(true)}
                              >
                                Add New Listing
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredListings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={listing.image || "/placeholder.svg"}
                                  alt={listing.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <div className="font-medium">
                                    {listing.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Base: ${listing.basePrice.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              ${listing.yourPrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              ${listing.commission.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {listing.sales}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${listing.revenue.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${listing.commissionEarned.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  listing.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  listing.status === "active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {listing.status === "active"
                                  ? "Active"
                                  : "Paused"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Manage Listing
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEditListing(listing)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Price
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => toggleListingStatus(listing)}
                                  >
                                    {listing.status === "active"
                                      ? "Pause Listing"
                                      : "Activate Listing"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/products/${listing.productId}`}
                                    >
                                      View Product
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteListing(listing)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Listing
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

          <TabsContent value="paused" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paused Listings</CardTitle>
                <CardDescription>
                  Products you have temporarily paused from selling.
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
                          Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Revenue
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Earned
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredListings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-muted-foreground">
                              No paused listings found
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredListings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={listing.image || "/placeholder.svg"}
                                  alt={listing.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <div className="font-medium">
                                    {listing.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Base: ${listing.basePrice.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              ${listing.yourPrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              ${listing.commission.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {listing.sales}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${listing.revenue.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${listing.commissionEarned.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  listing.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  listing.status === "active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {listing.status === "active"
                                  ? "Active"
                                  : "Paused"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Manage Listing
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEditListing(listing)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Price
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => toggleListingStatus(listing)}
                                  >
                                    {listing.status === "active"
                                      ? "Pause Listing"
                                      : "Activate Listing"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/products/${listing.productId}`}
                                    >
                                      View Product
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteListing(listing)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Listing
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Listings</CardTitle>
                <CardDescription>
                  All products you have listed for sale, both active and paused.
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
                          Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Revenue
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Earned
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredListings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <p className="text-muted-foreground">
                                No listings found
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddDialogOpen(true)}
                              >
                                Add New Listing
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredListings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={listing.image || "/placeholder.svg"}
                                  alt={listing.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <div className="font-medium">
                                    {listing.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Base: ${listing.basePrice.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              ${listing.yourPrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              ${listing.commission.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {listing.sales}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${listing.revenue.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${listing.commissionEarned.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  listing.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  listing.status === "active"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {listing.status === "active"
                                  ? "Active"
                                  : "Paused"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Manage Listing
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEditListing(listing)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Price
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => toggleListingStatus(listing)}
                                  >
                                    {listing.status === "active"
                                      ? "Pause Listing"
                                      : "Activate Listing"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/products/${listing.productId}`}
                                    >
                                      View Product
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteListing(listing)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Listing
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
        </Tabs>
      </div>

      {/* Edit Listing Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>
              Update your selling price for this product. Your commission is the
              difference between your price and the base price.
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedListing.image || "/placeholder.svg"}
                  alt={selectedListing.name}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
                <div>
                  <h3 className="font-medium">{selectedListing.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Base Price: ${selectedListing.basePrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="edit-price">Your Selling Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min={selectedListing.basePrice + 0.01}
                  step="0.01"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your commission: $
                  {(
                    Number.parseFloat(editPrice || "0") -
                    selectedListing.basePrice
                  ).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auto-adjust" defaultChecked />
                <Label htmlFor="auto-adjust">
                  Automatically adjust price based on market trends
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Listing Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this listing? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="flex items-center gap-4">
              <Image
                src={selectedListing.image || "/placeholder.svg"}
                alt={selectedListing.name}
                width={60}
                height={60}
                className="rounded-md"
              />
              <div>
                <h3 className="font-medium">{selectedListing.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Your Price: ${selectedListing.yourPrice.toFixed(2)} |
                  Commission: ${selectedListing.commission.toFixed(2)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Remove Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Listing Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Listing</DialogTitle>
            <DialogDescription>
              Select a product to list for sale. You'll earn commission on each
              sale.
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
              {filteredProducts.map((product) => (
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

              {filteredProducts.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground">
                    No products found matching your search
                  </p>
                </div>
              )}
            </div>

            {selectedProduct && (
              <>
                <Separator />
                <div className="space-y-4">
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
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedProduct(null);
                setNewPrice("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateListing}
              disabled={!selectedProduct || !newPrice}
            >
              Create Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
