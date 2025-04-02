"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { toast } from "@/lib/toast";

// Mock cart data - in a real app, this would come from your state management or API
const initialCartItems = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 149.99,
    basePrice: 129.99,
    commission: 20.0,
    quantity: 1,
    image: "/placeholder.svg?height=300&width=300",
    seller: "AudioTech",
  },
  {
    id: "5",
    name: "Coffee Maker",
    price: 89.99,
    basePrice: 79.99,
    commission: 10.0,
    quantity: 1,
    image: "/placeholder.svg?height=300&width=300",
    seller: "HomeEssentials",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Simulate loading cart data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
          <p className="text-muted-foreground">
            Review your items before proceeding to checkout
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="rounded-full bg-muted p-6">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-medium">Your cart is empty</h2>
              <p className="text-muted-foreground">
                Looks like you haven't added any products to your cart yet.
              </p>
            </div>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg border bg-card">
                <div className="p-6">
                  <h3 className="font-medium">
                    Cart Items ({cartItems.length})
                  </h3>
                </div>
                <Separator />
                <div className="p-6 pt-0">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
                <Separator />
                <div className="p-6 flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/products">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                  <Button onClick={handleCheckout}>Proceed to Checkout</Button>
                </div>
              </div>
            </div>
            <div>
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                itemCount={itemCount}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
