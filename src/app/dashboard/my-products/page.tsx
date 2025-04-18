"use client";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/lib/toast";
import { useApi } from "@/hooks/use-api";
import Spinner from "@/components/spinner";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DUMMY_IMAGE } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Edit, Eye, Plus, Trash2, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const { data, loading, error, sendRequest } = useApi();
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    longDescription: "",
    basePrice: "",
    recommendedPrice: "",
    inventory: 1,
    category: "",
    allowReselling: true,
    images: [] as string[],
  });
  const [editProduct, setEditProduct] = useState({
    id: "",
    name: "",
    description: "",
    longDescription: "",
    basePrice: "",
    recommendedPrice: "",
    inventory: 1,
    category: "",
    allowReselling: true,
    images: [] as string[],
  });

  useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await sendRequest("/api/users/products", "GET");
        setMyProducts(products || []);
        console.log("Products: ", products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setMyProducts([]);
      }
    };
    getProducts();
  }, []);

  //////////////////////////////
  // Filter products based on active tab
  //////////////////////////////
  const filteredProducts = myProducts
    .filter((product) => {
      if (activeTab === "active") return product.status === "in_stock";
      if (activeTab === "out_of_stock")
        return product.status === "out_of_stock";
      return true; // "all" tab
    })
    .filter((product) => {
      if (!searchQuery) return true;
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  //////////////////////////////
  // edit product state
  //////////////////////////////
  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setEditProduct({
      id: product.id,
      name: product.name,
      longDescription: product.longDescription,
      description: product.description,
      basePrice: product.basePrice.toString(),
      recommendedPrice: product.recommendedPrice.toString(),
      inventory: product.inventory.toString(),
      category: product.category,
      allowReselling: product.allowReselling,
      images: product.image,
    });
    setIsEditDialogOpen(true);
  };

  //////////////////////////////
  // delete product in db
  //////////////////////////////
  const handleDeleteProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  //////////////////////////////
  // update the product in db
  //////////////////////////////
  const handleSaveEdit = async () => {
    if (
      !editProduct.name ||
      !editProduct.description ||
      !editProduct.basePrice ||
      !editProduct.recommendedPrice
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setMyProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === editProduct.id ? { ...p, ...editProduct } : p
      )
    );
    const basePrice = Number.parseFloat(editProduct.basePrice);
    const recommendedPrice = Number.parseFloat(editProduct.recommendedPrice);

    if (isNaN(basePrice) || basePrice <= 0) {
      toast({
        title: "Invalid base price",
        description: "Base price must be a positive number",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(recommendedPrice) || recommendedPrice <= basePrice) {
      toast({
        title: "Invalid recommended price",
        description: "Recommended price must be greater than base price",
        variant: "destructive",
      });
      return;
    }

    if (editProduct.inventory <= 0) {
      toast({
        title: "Invalid inventory",
        description: "Inventory must be a positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      const { id, ...updateData } = editProduct;

      await sendRequest(`/api/users/products/${id}`, "PUT", updateData);
      await refreshProducts();
      toast({
        title: "Product updated",
        description: `${editProduct.name} has been updated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
      return;
    }

    setIsEditDialogOpen(false);
  };

  //////////////////////////////
  // delete or archive the product in your database
  //////////////////////////////
  const handleConfirmDelete = async () => {
    try {
      await sendRequest(`/api/users/products/${selectedProduct.id}`, "DELETE");

      await refreshProducts();
      toast({
        title: "Product removed",
        description: `${selectedProduct.name} has been removed from your products`,
      });
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
      return;
    }
  };

  const handleCreateProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.longDescription ||
      !newProduct.description ||
      !newProduct.basePrice ||
      !newProduct.recommendedPrice ||
      !newProduct.category ||
      newProduct.images.length === 0
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const basePrice = Number.parseFloat(newProduct.basePrice);
    const recommendedPrice = Number.parseFloat(newProduct.recommendedPrice);

    if (isNaN(basePrice) || basePrice <= 0) {
      toast({
        title: "Invalid base price",
        description: "Base price must be a positive number",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(recommendedPrice) || recommendedPrice <= basePrice) {
      toast({
        title: "Invalid recommended price",
        description: "Recommended price must be greater than base price",
        variant: "destructive",
      });
      return;
    }

    if (newProduct.inventory <= 0) {
      toast({
        title: "Invalid inventory",
        description: "Inventory must be a positive number",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendRequest("/api/users/products", "POST", newProduct);
      await refreshProducts();
      toast({
        title: "Product created",
        description: `${newProduct.name} has been created successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
      return;
    }
    setIsAddDialogOpen(false);
    setNewProduct({
      name: "",
      longDescription: "",
      description: "",
      basePrice: "",
      recommendedPrice: "",
      inventory: 1,
      category: "",
      allowReselling: true,
      images: [],
    });
  };

  //////////////////////////////
  // toggle reselling status
  //////////////////////////////
  const toggleResellingStatus = async (product: any) => {
    try {
      const response = await sendRequest(
        `/api/users/products/${product.id}`,
        "PUT",
        {
          allowReselling: !product.allowReselling,
        }
      );
      await refreshProducts();
      toast({
        title: product.allowReselling
          ? "Reselling disabled"
          : "Reselling enabled",
        description: `Reselling has been ${
          product.allowReselling ? "disabled" : "enabled"
        } for ${product.name}`,
      });
    } catch (error: any) {
      console.error(455, error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
      return;
    }
  };

  //////////////////////////////
  // refresh products
  // This function is called after creating, updating, or deleting a product
  //////////////////////////////
  const refreshProducts = async () => {
    try {
      const products = await sendRequest("/api/users/products", "GET");
      setMyProducts(products || []);
    } catch (error) {
      console.error("Failed to refresh products:", error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container py-10 px-5 sm:px-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
            <p className="text-muted-foreground">
              Manage your products and track sales and commissions
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </div>

        <Tabs defaultValue="active" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="out_of_stock">Out of Stock</TabsTrigger>
              <TabsTrigger value="all">All Products</TabsTrigger>
            </TabsList>
            <div className="hidden md:flex items-center gap-2">
              <Input
                placeholder="Search products..."
                className="w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Products</CardTitle>
                <CardDescription>
                  Products you have created that are currently available for
                  sale.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Base Price</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Revenue
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Resellers
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <p className="text-muted-foreground">
                                No products found
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddDialogOpen(true)}
                              >
                                Add New Product
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={product.productImages[0] || DUMMY_IMAGE}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <div className="font-medium">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {product.category}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              ${product.basePrice.toFixed(2)}
                            </TableCell>
                            <TableCell>{product.inventory}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {product.sales}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${product.revenue.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {product.resellerCount || 0}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.status === "in_stock"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  product.status === "in_stock"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {product.status === "in_stock"
                                  ? "Active"
                                  : "Out of Stock"}
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
                                    Manage Product
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/products/${product.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Product
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toggleResellingStatus(product)
                                    }
                                  >
                                    {product.allowReselling
                                      ? "Disable Reselling"
                                      : "Enable Reselling"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteProduct(product)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Product
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

          <TabsContent value="out_of_stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Out of Stock Products</CardTitle>
                <CardDescription>
                  Products that are currently out of stock.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Base Price</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Revenue
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Resellers
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-muted-foreground">
                              No out of stock products found
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={product.productImages[0] || DUMMY_IMAGE}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <div className="font-medium">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {product.category}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              ${product.basePrice.toFixed(2)}
                            </TableCell>
                            <TableCell>{product.inventory}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {product.sales}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${product.revenue.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {product.resellerCount || 0}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.status === "in_stock"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  product.status === "in_stock"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {product.status === "in_stock"
                                  ? "Active"
                                  : "Out of Stock"}
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
                                    Manage Product
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/products/${product.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Product
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toggleResellingStatus(product)
                                    }
                                  >
                                    {product.allowReselling
                                      ? "Disable Reselling"
                                      : "Enable Reselling"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteProduct(product)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Product
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
                <CardTitle>All Products</CardTitle>
                <CardDescription>
                  All products you have created, both active and out of stock.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Base Price</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Sales
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Revenue
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Resellers
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <p className="text-muted-foreground">
                                No products found
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddDialogOpen(true)}
                              >
                                Add New Product
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={product.productImages[0] || DUMMY_IMAGE}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="rounded-md"
                                />
                                <div>
                                  <div className="font-medium">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {product.category}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              ${product.basePrice.toFixed(2)}
                            </TableCell>
                            <TableCell>{product.inventory}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {product.sales}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              ${product.revenue.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {product.resellerCount || 0}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.status === "in_stock"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  product.status === "in_stock"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {product.status === "in_stock"
                                  ? "Active"
                                  : "Out of Stock"}
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
                                    Manage Product
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Product
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/products/${product.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Product
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toggleResellingStatus(product)
                                    }
                                  >
                                    {product.allowReselling
                                      ? "Disable Reselling"
                                      : "Enable Reselling"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteProduct(product)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Product
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

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update your product details and inventory.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={editProduct.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      const capitalizedValue = value
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ");
                      setEditProduct({
                        ...editProduct,
                        name: capitalizedValue,
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editProduct.category}
                    onValueChange={(value) =>
                      setEditProduct({ ...editProduct, category: value })
                    }
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Short Description</Label>
                <Textarea
                  id="edit-description"
                  rows={3}
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="A brief description of your product (visible in listings)"
                />
              </div>

              <div className="space-y-2">
                <Label>Detailed Description</Label>
                <RichTextEditor
                  content={editProduct.longDescription}
                  onChange={(value) =>
                    setEditProduct({ ...editProduct, longDescription: value })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  This will be shown on the product detail page
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-base-price">Base Price ($)</Label>
                  <Input
                    id="edit-base-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={editProduct.basePrice}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        basePrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-recommended-price">
                    Recommended Selling Price ($)
                  </Label>
                  <Input
                    id="edit-recommended-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={editProduct.recommendedPrice}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        recommendedPrice: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-inventory">Inventory</Label>
                  <Input
                    id="edit-inventory"
                    type="number"
                    min="0"
                    step="1"
                    value={editProduct.inventory}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        inventory: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-images">Product Images</Label>
                  <ImageUpload
                    multiple
                    onUpload={(url) => {
                      setEditProduct((prev) => {
                        const currentImages = Array.isArray(prev.images)
                          ? prev.images
                          : [];
                        return {
                          ...prev,
                          images: [...currentImages, url],
                        };
                      });
                    }}
                    className="mb-2"
                  />
                  {editProduct.images?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {editProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setEditProduct((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index
                                ),
                              }));
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="edit-allow-reselling"
                  checked={editProduct.allowReselling}
                  onCheckedChange={(checked) =>
                    setEditProduct({ ...editProduct, allowReselling: checked })
                  }
                />
                <Label htmlFor="edit-allow-reselling">
                  Allow other users to resell this product
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

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="flex items-center gap-4">
              <Image
                src={selectedProduct.image || DUMMY_IMAGE}
                alt={selectedProduct.name}
                width={60}
                height={60}
                className="rounded-md"
              />
              <div>
                <h3 className="font-medium">{selectedProduct.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Base Price: ${selectedProduct.basePrice.toFixed(2)} | Sales:{" "}
                  {selectedProduct.sales}
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
              Remove Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product to sell on the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <article className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </article>

              <article className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) =>
                    setNewProduct({ ...newProduct, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </article>
            </div>

            {/* Short Description */}
            <article className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Brief product summary (visible in listings)"
              />
            </article>

            {/* Detailed Description */}
            <article className="space-y-4">
              <div className="space-y-2">
                <Label>Detailed Description</Label>
                <div className="border rounded-lg max-h-[50vh]  overflow-y-auto ">
                  <RichTextEditor
                    content={newProduct.longDescription}
                    onChange={(content) =>
                      setNewProduct({ ...newProduct, longDescription: content })
                    }
                  />
                </div>
              </div>
            </article>

            {/* Pricing and Inventory */}
            <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="space-y-2">
                <Label htmlFor="basePrice">Base Price ($)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={newProduct.basePrice}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, basePrice: e.target.value })
                  }
                />
              </section>
              <section className="space-y-2">
                <Label htmlFor="recommendedPrice">Recommended Price ($)</Label>
                <Input
                  id="recommendedPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={newProduct.recommendedPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      recommendedPrice: e.target.value,
                    })
                  }
                />
              </section>
            </article>

            {/* Inventory and Images */}
            <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="space-y-2">
                <Label htmlFor="inventory">Inventory</Label>
                <Input
                  id="inventory"
                  type="number"
                  min="0"
                  value={newProduct.inventory}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      inventory: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </section>
              <section className="space-y-2">
                <Label>Product Images (Required)</Label>
                <ImageUpload
                  multiple
                  onUpload={(url) => {
                    setNewProduct((prev) => ({
                      ...prev,
                      images: [...prev.images, url],
                    }));
                  }}
                  className="mb-2"
                />
                {newProduct.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                    {newProduct.images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          onClick={() => {
                            setNewProduct((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </article>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProduct}>Create Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
