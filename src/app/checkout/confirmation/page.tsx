"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Printer, ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock order data
const orderData = {
  orderNumber: "ORD-12345-ABCDE",
  date: new Date().toLocaleDateString(),
  status: "Processing",
  paymentMethod: "Visa ending in 4242",
  shippingAddress: {
    name: "John Doe",
    line1: "123 Main St",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
  },
  items: [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 149.99,
      quantity: 1,
    },
    {
      id: "5",
      name: "Coffee Maker",
      price: 89.99,
      quantity: 1,
    },
  ],
  subtotal: 239.98,
  shipping: 0,
  tax: 19.2,
  total: 259.18,
};

export default function OrderConfirmationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Simulate loading order confirmation
    const timer = setTimeout(() => {
      setIsLoading(false);
      setOrderNumber(orderData.orderNumber);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-lg">Loading your order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground max-w-md">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped soon.
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium">Order Number:</span>
            <span>{orderNumber}</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Placed on {orderData.date}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {orderData.shipping === 0
                        ? "Free"
                        : `$${orderData.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${orderData.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.print();
                    }}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Receipt
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="font-medium">
                    {orderData.shippingAddress.name}
                  </div>
                  <div>{orderData.shippingAddress.line1}</div>
                  {orderData.shippingAddress.line2 && (
                    <div>{orderData.shippingAddress.line2}</div>
                  )}
                  <div>
                    {orderData.shippingAddress.city},{" "}
                    {orderData.shippingAddress.state}{" "}
                    {orderData.shippingAddress.postalCode}
                  </div>
                  <div>{orderData.shippingAddress.country}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-medium">{orderData.paymentMethod}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="rounded-full bg-blue-100 p-1">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="font-medium">{orderData.status}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  You will receive an email when your order ships with tracking
                  information.
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <Button className="flex-1" asChild>
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
