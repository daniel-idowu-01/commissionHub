"use client";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CreditCard } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
  onCheckout?: () => void;
}

export function CartSummary({
  subtotal,
  shipping,
  tax,
  total,
  itemCount,
  onCheckout,
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const router = useRouter();

  const handleApplyPromo = () => {
    if (!promoCode) return;

    setIsApplyingPromo(true);

    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false);

      if (promoCode.toUpperCase() === "DISCOUNT20") {
        toast({
          title: "Promo code applied",
          description: "20% discount has been applied to your order",
        });
      } else {
        toast({
          title: "Invalid promo code",
          description: "The promo code you entered is invalid or expired",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-medium">Order Summary</h3>

      <div className="mt-4 space-y-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({itemCount} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="pt-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={handleApplyPromo}
              disabled={isApplyingPromo || !promoCode}
            >
              Apply
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Try "DISCOUNT20" for 20% off your order
          </p>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={itemCount === 0}
        >
          {onCheckout ? (
            <>
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Complete Payment
              <CreditCard className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
