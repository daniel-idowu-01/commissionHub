"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for analytics
const salesData = [
  { name: "Jan", sales: 12, revenue: 1200, commission: 240 },
  { name: "Feb", sales: 19, revenue: 1900, commission: 380 },
  { name: "Mar", sales: 15, revenue: 1500, commission: 300 },
  { name: "Apr", sales: 22, revenue: 2200, commission: 440 },
  { name: "May", sales: 28, revenue: 2800, commission: 560 },
  { name: "Jun", sales: 25, revenue: 2500, commission: 500 },
  { name: "Jul", sales: 30, revenue: 3000, commission: 600 },
  { name: "Aug", sales: 35, revenue: 3500, commission: 700 },
  { name: "Sep", sales: 32, revenue: 3200, commission: 640 },
  { name: "Oct", sales: 40, revenue: 4000, commission: 800 },
  { name: "Nov", sales: 38, revenue: 3800, commission: 760 },
  { name: "Dec", sales: 45, revenue: 4500, commission: 900 },
];

const categoryData = [
  { name: "Electronics", value: 45, color: "#8884d8" },
  { name: "Home & Kitchen", value: 25, color: "#82ca9d" },
  { name: "Sports & Outdoors", value: 15, color: "#ffc658" },
  { name: "Beauty", value: 10, color: "#ff8042" },
  { name: "Other", value: 5, color: "#0088fe" },
];

const topProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    sales: 45,
    revenue: 6749.55,
    commission: 900.0,
    image: "/placeholder.svg?height=40&width=40",
    originalSeller: "AudioTech",
  },
  {
    id: "2",
    name: "Smart Watch",
    sales: 38,
    revenue: 8359.62,
    commission: 760.0,
    image: "/placeholder.svg?height=40&width=40",
    originalSeller: "TechWear",
  },
  {
    id: "3",
    name: "Portable Speaker",
    sales: 32,
    revenue: 2879.68,
    commission: 320.0,
    image: "/placeholder.svg?height=40&width=40",
    originalSeller: "SoundGear",
  },
  {
    id: "4",
    name: "Digital Camera",
    sales: 28,
    revenue: 10639.72,
    commission: 840.0,
    image: "/placeholder.svg?height=40&width=40",
    originalSeller: "PhotoPro",
  },
  {
    id: "5",
    name: "Coffee Maker",
    sales: 25,
    revenue: 2249.75,
    commission: 250.0,
    image: "/placeholder.svg?height=40&width=40",
    originalSeller: "HomeEssentials",
  },
];

const topSellers = [
  {
    id: "1",
    name: "AudioTech",
    products: 8,
    sales: 120,
    commission: 2400.0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "TechWear",
    products: 5,
    sales: 95,
    commission: 1900.0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "SoundGear",
    products: 6,
    sales: 85,
    commission: 1700.0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "HomeEssentials",
    products: 12,
    sales: 78,
    commission: 1560.0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "FitLife",
    products: 7,
    sales: 65,
    commission: 1300.0,
    image: "/placeholder.svg?height=40&width=40",
  },
];

export default function ResellerAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("year");
  const [isMounted, setIsMounted] = useState(false);

  // Simulate loading charts after component mount
  useState(() => {
    setIsMounted(true);
  });

  // Calculate summary metrics
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCommission = salesData.reduce(
    (sum, item) => sum + item.commission,
    0
  );
  const avgCommissionRate = (totalCommission / totalRevenue) * 100;

  return (
    <div className="container py-10 px-5 sm:px-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Reseller Analytics
            </h1>
            <p className="text-muted-foreground">
              Track your performance as a reseller and analyze your commission
              earnings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last quarter</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download report</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
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
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +15% from last year
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
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalCommission.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Commission Rate
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgCommissionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                +2.5% from last year
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="sellers">Original Sellers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Sales & Commission</CardTitle>
                  <CardDescription>
                    Your sales and commission over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          stroke="#8884d8"
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#82ca9d"
                        />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="sales"
                          stroke="#8884d8"
                          name="Sales"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="commission"
                          stroke="#82ca9d"
                          name="Commission ($)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>
                    Distribution of your revenue across product categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Percentage"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Your best-selling products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {topProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded-md mr-4"
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {product.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product.sales} sales | $
                            {product.commission.toFixed(2)} commission
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          ${product.revenue.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>Your revenue by month</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="revenue"
                          fill="#8884d8"
                          name="Revenue ($)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>
                  Products generating the most sales and commission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Original Seller</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded-md"
                            />
                            <div className="font-medium">{product.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.originalSeller}</TableCell>
                        <TableCell className="text-right">
                          {product.sales}
                        </TableCell>
                        <TableCell className="text-right">
                          ${product.revenue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${product.commission.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Products
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="sellers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Original Sellers</CardTitle>
                <CardDescription>
                  Sellers whose products you're successfully reselling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seller</TableHead>
                      <TableHead className="text-right">Products</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellers.map((seller) => (
                      <TableRow key={seller.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={seller.image || "/placeholder.svg"}
                              alt={seller.name}
                              width={40}
                              height={40}
                              className="rounded-md"
                            />
                            <div className="font-medium">{seller.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {seller.products}
                        </TableCell>
                        <TableCell className="text-right">
                          {seller.sales}
                        </TableCell>
                        <TableCell className="text-right">
                          ${seller.commission.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Sellers
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seller Relationship Strength</CardTitle>
                <CardDescription>
                  How much of each seller's catalog you're reselling
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={topSellers.map((seller) => ({
                        name: seller.name,
                        products: seller.products,
                        penetration: Math.round(Math.random() * 50 + 30), // Mock data for catalog penetration
                      }))}
                      margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar
                        dataKey="penetration"
                        fill="#8884d8"
                        name="Catalog Penetration (%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>
                    Distribution of your revenue across product categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Percentage"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commission by Category</CardTitle>
                  <CardDescription>
                    Which categories earn you the most commission
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryData.map((cat) => ({
                          name: cat.name,
                          commission: Math.round(
                            cat.value * 100 + Math.random() * 500
                          ),
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="commission"
                          fill="#82ca9d"
                          name="Commission ($)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>
                  Detailed breakdown of category metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Products</TableHead>
                      <TableHead className="text-right">Sales</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead className="text-right">Avg. Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData.map((category) => (
                      <TableRow key={category.name}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {Math.round(category.value / 5)}
                        </TableCell>
                        <TableCell className="text-right">
                          {Math.round(category.value * 3)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(category.value * 100).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(category.value * 20).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {(20).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Export Category Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
