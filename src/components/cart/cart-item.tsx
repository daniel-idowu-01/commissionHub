"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  basePrice: number;
  commission: number;
  quantity: number;
  image: string;
  seller: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  name,
  price,
  basePrice,
  commission,
  quantity,
  image,
  seller,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const [itemQuantity, setItemQuantity] = useState(quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number.parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setItemQuantity(newQuantity);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const decreaseQuantity = () => {
    if (itemQuantity > 1) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      onUpdateQuantity(id, newQuantity);
    }
  };

  const increaseQuantity = () => {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    onUpdateQuantity(id, newQuantity);
  };

  return (
    <div className="flex items-start space-x-4 py-6">
      <div className="relative h-24 w-24 overflow-hidden rounded-md border">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{name}</h3>
          <p className="font-medium">${(price * itemQuantity).toFixed(2)}</p>
        </div>
        <p className="text-sm text-muted-foreground">Sold by {seller}</p>
        <div className="text-xs text-muted-foreground">
          Base: ${basePrice.toFixed(2)} | Your Commission: $
          {commission.toFixed(2)}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decreaseQuantity}
              disabled={itemQuantity <= 1}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <Input
              type="number"
              min="1"
              value={itemQuantity}
              onChange={handleQuantityChange}
              className="h-8 w-16 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={increaseQuantity}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onRemove(id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
