import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Home,
  Link2,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-bold text-gray-900">
                  CommissionHub
                </span>
                <span className="text-xs text-gray-500">
                  Marketplace Platform
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <div className="mb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Main
              </h3>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="group">
                    <Link href="/dashboard">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 group-hover:bg-purple-100 group-hover:text-purple-600 group-data-[active=true]:bg-purple-100 group-data-[active=true]:text-purple-600">
                        <Home className="h-4 w-4" />
                      </div>
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Products
              </h3>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="group">
                    <Link href="/dashboard/my-products">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 group-hover:bg-purple-100 group-hover:text-purple-600 group-data-[active=true]:bg-purple-100 group-data-[active=true]:text-purple-600">
                        <Package className="h-4 w-4" />
                      </div>
                      <span>My Products</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="group">
                    <Link href="/dashboard/my-listings">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 group-hover:bg-purple-100 group-hover:text-purple-600 group-data-[active=true]:bg-purple-100 group-data-[active=true]:text-purple-600">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <span>My Listings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Marketing
              </h3>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="group">
                    <Link href="/dashboard/my-links">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 group-hover:bg-purple-100 group-hover:text-purple-600 group-data-[active=true]:bg-purple-100 group-data-[active=true]:text-purple-600">
                        <Link2 className="h-4 w-4" />
                      </div>
                      <span>My Referral Links</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="group">
                    <Link href="/dashboard/reseller-analytics">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 group-hover:bg-purple-100 group-hover:text-purple-600 group-data-[active=true]:bg-purple-100 group-data-[active=true]:text-purple-600">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <span>Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <div>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Settings
              </h3>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="group">
                    <Link href="/dashboard/commission-settings">
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-700 group-hover:bg-purple-100 group-hover:text-purple-600 group-data-[active=true]:bg-purple-100 group-data-[active=true]:text-purple-600">
                        <Settings className="h-4 w-4" />
                      </div>
                      <span>Commission Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
          <SidebarFooter className="mt-auto border-t border-gray-200 p-4">
            <div className="mb-4 flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john.doe@example.com</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-300 bg-white shadow-sm hover:bg-gray-50"
              asChild
            >
              <Link href="/settings">
                <Users className="mr-2 h-4 w-4 text-gray-500" />
                Account Settings
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
            <SidebarTrigger className="text-gray-500 hover:bg-gray-100 hover:text-gray-700" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="relative flex h-9 w-9 items-center justify-center">
                  <span className="absolute right-0 top-0 flex h-2.5 w-2.5 rounded-full bg-purple-600"></span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-gray-500"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                  </svg>
                </span>
              </Button>
            </div>
          </header>
          <main className="w-full p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
