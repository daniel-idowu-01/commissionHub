"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { Bell, Menu, Package, ShoppingCart, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();
  const { user, clearUser } = useUserStore();
  const { sendRequest } = useApi();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = user ? true : false;

  // Mock cart count
  const cartCount = 2;

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/products",
      label: "Products",
      active: pathname === "/products",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
  ];

  const handleLogout = async () => {
    await sendRequest("/api/auth/logout", "GET");
    clearUser();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background px-5 sm:px-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <span className="font-bold">CommissionHub</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
                <span className="sr-only">Notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link href="/auth/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-8 p-6">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="h-6 w-6" />
                  <span className="font-bold">CommissionHub</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-primary" : "text-muted-foreground"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </Link>
                  ))}
                  <Link
                    href="/cart"
                    className="text-sm font-medium transition-colors hover:text-primary flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                    {cartCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                  {!isAuthenticated && (
                    <>
                      <Link
                        href="/auth/login"
                        className="text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="text-sm font-medium transition-colors hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
