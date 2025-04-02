"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { CartSummary } from "@/components/cart/cart-summary";
import { toast } from "@/lib/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock cart data for the summary
const cartSummary = {
  subtotal: 239.98,
  shipping: 0,
  tax: 19.2,
  total: 259.18,
  itemCount: 2,
};

// Mock saved addresses
const savedAddresses = [
  {
    id: "1",
    name: "John Doe",
    line1: "123 Main St",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    phone: "(555) 123-4567",
    isDefault: true,
  },
  {
    id: "2",
    name: "John Doe",
    line1: "456 Market St",
    line2: "",
    city: "San Francisco",
    state: "CA",
    postalCode: "94103",
    country: "United States",
    phone: "(555) 987-6543",
    isDefault: false,
  },
];

// Mock saved payment methods
const savedPaymentMethods = [
  {
    id: "1",
    type: "credit_card",
    brand: "Visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: "credit_card",
    brand: "Mastercard",
    last4: "5555",
    expMonth: 8,
    expYear: 2024,
    isDefault: false,
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0].id);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    savedPaymentMethods[0].id
  );
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [isNewPayment, setIsNewPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveInfo, setSaveInfo] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);

      toast({
        title: "Payment successful",
        description: "Your order has been placed successfully",
      });

      // Redirect to order confirmation page
      router.push("/checkout/confirmation");
    }, 2000);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your purchase by providing your shipping and payment
            details
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Shipping Address Section */}
                <div className="rounded-lg border bg-card">
                  <div className="p-6">
                    <h3 className="text-lg font-medium">Shipping Address</h3>
                  </div>
                  <Separator />
                  <div className="p-6 space-y-4">
                    {!isNewAddress && savedAddresses.length > 0 ? (
                      <>
                        <RadioGroup
                          value={selectedAddress}
                          onValueChange={setSelectedAddress}
                          className="space-y-4"
                        >
                          {savedAddresses.map((address) => (
                            <div
                              key={address.id}
                              className="flex items-start space-x-3 rounded-md border p-4"
                            >
                              <RadioGroupItem
                                value={address.id}
                                id={`address-${address.id}`}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`address-${address.id}`}
                                  className="font-medium"
                                >
                                  {address.name}
                                  {address.isDefault && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      (Default)
                                    </span>
                                  )}
                                </Label>
                                <div className="text-sm text-muted-foreground mt-1">
                                  <div>{address.line1}</div>
                                  {address.line2 && <div>{address.line2}</div>}
                                  <div>
                                    {address.city}, {address.state}{" "}
                                    {address.postalCode}
                                  </div>
                                  <div>{address.country}</div>
                                  <div className="mt-1">{address.phone}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsNewAddress(true)}
                        >
                          Add New Address
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input id="first-name" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input id="last-name" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address-line1">Address line 1</Label>
                          <Input id="address-line1" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address-line2">
                            Address line 2 (optional)
                          </Label>
                          <Input id="address-line2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State / Province</Label>
                            <Input id="state" required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="postal-code">Postal code</Label>
                            <Input id="postal-code" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select defaultValue="US">
                              <SelectTrigger id="country">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="US">
                                  United States
                                </SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="UK">
                                  United Kingdom
                                </SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone number</Label>
                          <Input id="phone" type="tel" required />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="save-address"
                            checked={saveInfo}
                            onCheckedChange={(checked) =>
                              setSaveInfo(!!checked)
                            }
                          />
                          <Label
                            htmlFor="save-address"
                            className="text-sm font-normal"
                          >
                            Save this address for future orders
                          </Label>
                        </div>
                        {savedAddresses.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsNewAddress(false)}
                          >
                            Use Saved Address
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="rounded-lg border bg-card">
                  <div className="p-6">
                    <h3 className="text-lg font-medium">Payment Method</h3>
                  </div>
                  <Separator />
                  <div className="p-6 space-y-4">
                    <Tabs
                      defaultValue="saved"
                      onValueChange={(value) =>
                        setIsNewPayment(value === "new")
                      }
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                          value="saved"
                          disabled={savedPaymentMethods.length === 0}
                        >
                          Saved Methods
                        </TabsTrigger>
                        <TabsTrigger value="new">New Method</TabsTrigger>
                      </TabsList>
                      <TabsContent value="saved" className="space-y-4 pt-4">
                        <RadioGroup
                          value={selectedPaymentMethod}
                          onValueChange={setSelectedPaymentMethod}
                          className="space-y-4"
                        >
                          {savedPaymentMethods.map((method) => (
                            <div
                              key={method.id}
                              className="flex items-start space-x-3 rounded-md border p-4"
                            >
                              <RadioGroupItem
                                value={method.id}
                                id={`payment-${method.id}`}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`payment-${method.id}`}
                                  className="font-medium"
                                >
                                  {method.brand} ending in {method.last4}
                                  {method.isDefault && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      (Default)
                                    </span>
                                  )}
                                </Label>
                                <div className="text-sm text-muted-foreground mt-1">
                                  Expires {method.expMonth}/{method.expYear}
                                </div>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </TabsContent>
                      <TabsContent value="new" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="grid grid-cols-3 gap-4"
                          >
                            <div className="flex flex-col items-center justify-between rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                              <RadioGroupItem
                                value="credit-card"
                                id="credit-card"
                                className="sr-only"
                              />
                              <CreditCard className="mb-3 h-6 w-6" />
                              <Label
                                htmlFor="credit-card"
                                className="text-center text-sm"
                              >
                                Credit Card
                              </Label>
                            </div>
                            <div className="flex flex-col items-center justify-between rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                              <RadioGroupItem
                                value="paypal"
                                id="paypal"
                                className="sr-only"
                              />
                              <svg
                                className="mb-3 h-6 w-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.4 3H16.2C16.8 3 17.3 3.4 17.5 3.9L18.6 6.9C18.8 7.5 18.5 8.1 18 8.5C17.8 8.7 17.7 8.9 17.7 9.1V16.2C17.7 16.7 17.3 17.1 16.8 17.2L8.2 18.9C7.9 19 7.6 18.8 7.5 18.5L4.3 7.5C4.2 7.2 4.3 6.9 4.6 6.7C4.8 6.5 5 6.2 5 5.9V4C5 3.4 5.6 3 6.2 3H7.4Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M17.9 6.7C19.1 6.9 20 7.9 20 9.1V15C20 16.1 19.1 17 18 17H9.3C8.4 17 7.7 16.3 7.7 15.4V9.1C7.7 7.9 8.6 6.9 9.8 6.7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <Label
                                htmlFor="paypal"
                                className="text-center text-sm"
                              >
                                PayPal
                              </Label>
                            </div>
                            <div className="flex flex-col items-center justify-between rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                              <RadioGroupItem
                                value="apple-pay"
                                id="apple-pay"
                                className="sr-only"
                              />
                              <svg
                                className="mb-3 h-6 w-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.5 15.5C16.5 16.3 15.8 17 15 17H9C8.2 17 7.5 16.3 7.5 15.5V8.5C7.5 7.7 8.2 7 9 7H15C15.8 7 16.5 7.7 16.5 8.5V15.5Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <Label
                                htmlFor="apple-pay"
                                className="text-center text-sm"
                              >
                                Apple Pay
                              </Label>
                            </div>
                          </RadioGroup>

                          {paymentMethod === "credit-card" && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="card-number">Card number</Label>
                                <Input
                                  id="card-number"
                                  placeholder="1234 5678 9012 3456"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label htmlFor="expiration">
                                    Expiration date
                                  </Label>
                                  <div className="flex space-x-2">
                                    <Select defaultValue="01">
                                      <SelectTrigger id="expiration-month">
                                        <SelectValue placeholder="MM" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => {
                                          const month = i + 1;
                                          return (
                                            <SelectItem
                                              key={month}
                                              value={month
                                                .toString()
                                                .padStart(2, "0")}
                                            >
                                              {month
                                                .toString()
                                                .padStart(2, "0")}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                    <Select defaultValue="2025">
                                      <SelectTrigger id="expiration-year">
                                        <SelectValue placeholder="YYYY" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Array.from({ length: 10 }, (_, i) => {
                                          const year =
                                            new Date().getFullYear() + i;
                                          return (
                                            <SelectItem
                                              key={year}
                                              value={year.toString()}
                                            >
                                              {year}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="cvc">CVC</Label>
                                  <Input id="cvc" placeholder="123" required />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="name-on-card">
                                  Name on card
                                </Label>
                                <Input
                                  id="name-on-card"
                                  placeholder="John Doe"
                                  required
                                />
                              </div>
                              <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                  id="save-payment"
                                  checked={saveInfo}
                                  onCheckedChange={(checked) =>
                                    setSaveInfo(!!checked)
                                  }
                                />
                                <Label
                                  htmlFor="save-payment"
                                  className="text-sm font-normal"
                                >
                                  Save this payment method for future orders
                                </Label>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>

                {/* Billing Address Section */}
                <div className="rounded-lg border bg-card">
                  <div className="p-6">
                    <h3 className="text-lg font-medium">Billing Address</h3>
                  </div>
                  <Separator />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="same-address" defaultChecked />
                      <Label htmlFor="same-address">
                        Same as shipping address
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Order Notes Section */}
                <div className="rounded-lg border bg-card">
                  <div className="p-6">
                    <h3 className="text-lg font-medium">
                      Order Notes (Optional)
                    </h3>
                  </div>
                  <Separator />
                  <div className="p-6">
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add any special instructions or delivery notes..."
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/cart">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Link>
                  </Button>
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Order
                        <ShieldCheck className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div>
            <CartSummary
              subtotal={cartSummary.subtotal}
              shipping={cartSummary.shipping}
              tax={cartSummary.tax}
              total={cartSummary.total}
              itemCount={cartSummary.itemCount}
            />
            <div className="mt-6 rounded-lg border bg-card p-6">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="font-medium">Secure Checkout</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your payment information is encrypted and secure. We never store
                your full credit card details.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Accepted Payment Methods
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 w-10 rounded bg-muted"></div>
                  <div className="h-6 w-10 rounded bg-muted"></div>
                  <div className="h-6 w-10 rounded bg-muted"></div>
                  <div className="h-6 w-10 rounded bg-muted"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
