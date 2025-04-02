"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Download,
  Package,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { SalesChart } from "@/components/dashboard/sales-chart";
import { CommissionChart } from "@/components/dashboard/commission-chart";

// Mock data for the dashboard
const recentSales = [
  {
    id: "1",
    customer: "John Smith",
    email: "john.smith@example.com",
    amount: 149.99,
    product: "Wireless Headphones",
    basePrice: 129.99,
    commission: 20.0,
    date: "2 hours ago",
    status: "Completed",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    email: "sarah.j@example.com",
    amount: 219.99,
    product: "Smart Watch",
    basePrice: 199.99,
    commission: 20.0,
    date: "5 hours ago",
    status: "Completed",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    customer: "Michael Brown",
    email: "m.brown@example.com",
    amount: 89.99,
    product: "Portable Speaker",
    basePrice: 79.99,
    commission: 10.0,
    date: "1 day ago",
    status: "Completed",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    customer: "Emily Davis",
    email: "emily.d@example.com",
    amount: 379.99,
    product: "Digital Camera",
    basePrice: 349.99,
    commission: 30.0,
    date: "2 days ago",
    status: "Completed",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

const listedProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    basePrice: 129.99,
    yourPrice: 149.99,
    commission: 20.0,
    sales: 12,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Smart Watch",
    basePrice: 199.99,
    yourPrice: 219.99,
    commission: 20.0,
    sales: 8,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Portable Speaker",
    basePrice: 79.99,
    yourPrice: 89.99,
    commission: 10.0,
    sales: 15,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Digital Camera",
    basePrice: 349.99,
    yourPrice: 379.99,
    commission: 30.0,
    sales: 5,
    image: "/placeholder.svg?height=40&width=40",
  },
];

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("7d");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Your Products</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$839.96</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Commission Earned
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$80.00</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Products Sold
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">40</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +18.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made {recentSales.length} sales recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentSales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex items-center">
                      <Image
                        src={sale.avatar || "/placeholder.svg"}
                        alt={`${sale.customer}'s avatar`}
                        width={32}
                        height={32}
                        className="h-9 w-9 rounded-full"
                      />
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {sale.customer}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sale.email}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        +${sale.commission.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>
                  Your best performing products this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {listedProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md"
                      />
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${product.yourPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {product.sales} sold
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Link
                    href="/products"
                    className="flex items-center justify-center w-full"
                  >
                    View All Products
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Commission Breakdown</CardTitle>
                <CardDescription>
                  Your commission earnings by product category
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <CommissionChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Listed Products</CardTitle>
              <CardDescription>
                Manage the products you're currently selling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Your Price</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Total Earned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-md mr-2"
                          />
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>${product.basePrice.toFixed(2)}</TableCell>
                      <TableCell>${product.yourPrice.toFixed(2)}</TableCell>
                      <TableCell>${product.commission.toFixed(2)}</TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>
                        ${(product.commission * product.sales).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Add New Product</Button>
              <Button>View All Products</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Your recent sales and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">#{sale.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{sale.customer}</span>
                          <span className="text-xs text-muted-foreground">
                            {sale.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>${sale.amount.toFixed(2)}</TableCell>
                      <TableCell>${sale.commission.toFixed(2)}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          {sale.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="commissions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Commission</CardTitle>
                <CardDescription>
                  Your total earnings from commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$80.00</div>
                <p className="text-sm text-muted-foreground mt-2">
                  From 40 sales across 4 products
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Commission</CardTitle>
                <CardDescription>
                  Your average commission per sale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$20.00</div>
                <p className="text-sm text-muted-foreground mt-2">
                  10.5% higher than last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Payout</CardTitle>
                <CardDescription>
                  Commission ready for withdrawal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$65.00</div>
                <Button className="w-full mt-4">Withdraw Funds</Button>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Commission History</CardTitle>
              <CardDescription>
                Your commission earnings over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Sale Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale, index) => (
                    <TableRow key={`commission-${index}`}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>${sale.amount.toFixed(2)}</TableCell>
                      <TableCell>${sale.commission.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            index < 2
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {index < 2 ? "Pending" : "Paid"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
