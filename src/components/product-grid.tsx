import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock product data - in a real app, this would come from your database
const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones",
    basePrice: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: "AudioTech",
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Fitness and health tracking smartwatch",
    basePrice: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: "TechWear",
  },
  {
    id: "3",
    name: "Portable Speaker",
    description: "Waterproof bluetooth speaker with 20-hour battery life",
    basePrice: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: "SoundGear",
  },
  {
    id: "4",
    name: "Digital Camera",
    description: "4K digital camera with 30x optical zoom",
    basePrice: 349.99,
    image: "/placeholder.svg?height=300&width=300",
    seller: "PhotoPro",
  },
];

export default function ProductGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl mx-auto">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-2">
              {product.description}
            </CardDescription>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-medium">
                Base: ${product.basePrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                by {product.seller}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/products/${product.id}`}>View Details</Link>
            </Button>
            <Button size="sm">Sell This</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
