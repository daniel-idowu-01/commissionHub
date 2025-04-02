"use client";
import { useState } from "react";
import { Info } from "lucide-react";
import { toast } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CommissionSettingsPage() {
  const [defaultMarkup, setDefaultMarkup] = useState(20);
  const [minMarkup, setMinMarkup] = useState(10);
  const [maxMarkup, setMaxMarkup] = useState(50);
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [pricingStrategy, setPricingStrategy] = useState("percentage");
  const [payoutMethod, setPayoutMethod] = useState("bank_transfer");
  const [payoutThreshold, setPayoutThreshold] = useState("50");
  const [payoutFrequency, setPayoutFrequency] = useState("monthly");
  const [notifications, setNotifications] = useState({
    sales: true,
    payouts: true,
    priceChanges: true,
    lowInventory: true,
    marketTrends: false,
  });
  const handleSaveGeneral = () => {
    toast({
      title: "Settings saved",
      description: "Your commission settings have been updated",
    });
  };

  const handleSavePayout = () => {
    toast({
      title: "Payout settings saved",
      description: "Your payout preferences have been updated",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated",
    });
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Commission Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your commission preferences and payout settings
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payout">Payout</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Default Commission Settings</CardTitle>
                <CardDescription>
                  Configure your default commission settings for new product
                  listings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Default Markup Percentage</Label>
                    <span className="font-medium">{defaultMarkup}%</span>
                  </div>
                  <Slider
                    value={[defaultMarkup]}
                    min={5}
                    max={100}
                    step={1}
                    onValueChange={(value) => setDefaultMarkup(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>5% (Low)</div>
                    <div>20% (Recommended)</div>
                    <div>100% (High)</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-markup">Minimum Markup (%)</Label>
                    <Input
                      id="min-markup"
                      type="number"
                      min={1}
                      max={maxMarkup}
                      value={minMarkup}
                      onChange={(e) =>
                        setMinMarkup(Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-markup">Maximum Markup (%)</Label>
                    <Input
                      id="max-markup"
                      type="number"
                      min={minMarkup}
                      value={maxMarkup}
                      onChange={(e) =>
                        setMaxMarkup(Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pricing Strategy</Label>
                  <RadioGroup
                    value={pricingStrategy}
                    onValueChange={setPricingStrategy}
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="percentage" className="font-medium">
                          Percentage Markup
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Set your price as a percentage above the base price
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="fixed" className="font-medium">
                          Fixed Amount Markup
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Set your price by adding a fixed dollar amount to the
                          base price
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="dynamic" id="dynamic" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="dynamic" className="font-medium">
                          Dynamic Pricing
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically adjust your price based on market demand
                          and competition
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-adjust"
                    checked={autoAdjust}
                    onCheckedChange={setAutoAdjust}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="auto-adjust" className="font-medium">
                      Auto-adjust pricing
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically adjust your prices based on market trends
                      and competition
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneral}>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Calculator</CardTitle>
                <CardDescription>
                  Calculate potential earnings based on different pricing
                  strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="base-price">Base Price ($)</Label>
                    <Input
                      id="base-price"
                      type="number"
                      min={0.01}
                      step={0.01}
                      defaultValue={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="markup">Markup (%)</Label>
                    <Input
                      id="markup"
                      type="number"
                      min={1}
                      defaultValue={20}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Your Selling Price</p>
                      <p className="text-2xl font-bold">$120.00</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Your Commission</p>
                      <p className="text-2xl font-bold text-green-600">
                        $20.00
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">
                        Monthly Sales (Est.)
                      </p>
                      <p className="text-xl font-bold">10 units</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Monthly Commission (Est.)
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        $200.00
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Calculate</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive your commission payouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Payout Method</Label>
                  <RadioGroup
                    value={payoutMethod}
                    onValueChange={setPayoutMethod}
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem
                        value="bank_transfer"
                        id="bank_transfer"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="bank_transfer" className="font-medium">
                          Bank Transfer
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Direct deposit to your bank account (2-3 business
                          days)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="paypal" className="font-medium">
                          PayPal
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Instant transfer to your PayPal account
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="store_credit" id="store_credit" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="store_credit" className="font-medium">
                          Store Credit
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive 5% bonus when you choose store credit
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="payout-threshold">
                        Payout Threshold ($)
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Minimum amount required before payout is processed
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="payout-threshold"
                      type="number"
                      min={10}
                      value={payoutThreshold}
                      onChange={(e) => setPayoutThreshold(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payout-frequency">Payout Frequency</Label>
                    <Select
                      value={payoutFrequency}
                      onValueChange={setPayoutFrequency}
                    >
                      <SelectTrigger id="payout-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {payoutMethod === "bank_transfer" && (
                  <div className="space-y-4 rounded-md border p-4">
                    <h3 className="font-medium">Bank Account Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="account-name">
                          Account Holder Name
                        </Label>
                        <Input id="account-name" defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-type">Account Type</Label>
                        <Select defaultValue="checking">
                          <SelectTrigger id="account-type">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checking">Checking</SelectItem>
                            <SelectItem value="savings">Savings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="routing-number">Routing Number</Label>
                        <Input
                          id="routing-number"
                          defaultValue="•••••••••"
                          type="password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Account Number</Label>
                        <Input
                          id="account-number"
                          defaultValue="•••••••••"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {payoutMethod === "paypal" && (
                  <div className="space-y-2 rounded-md border p-4">
                    <Label htmlFor="paypal-email">PayPal Email</Label>
                    <Input
                      id="paypal-email"
                      type="email"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePayout}>Save Payout Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>
                  View your recent commission payouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between border-b p-4">
                      <div>
                        <p className="font-medium">October 2023 Payout</p>
                        <p className="text-sm text-muted-foreground">
                          Processed on Nov 5, 2023
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$842.50</p>
                        <p className="text-sm text-green-600">Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4">
                      <div>
                        <p className="font-medium">September 2023 Payout</p>
                        <p className="text-sm text-muted-foreground">
                          Processed on Oct 5, 2023
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$756.25</p>
                        <p className="text-sm text-green-600">Completed</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4">
                      <div>
                        <p className="font-medium">August 2023 Payout</p>
                        <p className="text-sm text-muted-foreground">
                          Processed on Sep 5, 2023
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$689.75</p>
                        <p className="text-sm text-green-600">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Payouts
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure which notifications you receive about your
                  commissions and sales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sales-notifications">
                        Sales Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when your products are sold
                      </p>
                    </div>
                    <Switch
                      id="sales-notifications"
                      checked={notifications.sales}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, sales: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payout-notifications">
                        Payout Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your commission payouts
                      </p>
                    </div>
                    <Switch
                      id="payout-notifications"
                      checked={notifications.payouts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, payouts: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="price-change-notifications">
                        Price Change Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when base prices of your listed
                        products change
                      </p>
                    </div>
                    <Switch
                      id="price-change-notifications"
                      checked={notifications.priceChanges}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          priceChanges: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="inventory-notifications">
                        Low Inventory Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when products you're selling are
                        running low on inventory
                      </p>
                    </div>
                    <Switch
                      id="inventory-notifications"
                      checked={notifications.lowInventory}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          lowInventory: checked,
                        })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="market-trend-notifications">
                        Market Trend Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about market trends and pricing
                        opportunities
                      </p>
                    </div>
                    <Switch
                      id="market-trend-notifications"
                      checked={notifications.marketTrends}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          marketTrends: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotifications}>
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Notification Channels</Label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-notifications" defaultChecked />
                      <Label htmlFor="email-notifications">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sms-notifications" />
                      <Label htmlFor="sms-notifications">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="push-notifications" defaultChecked />
                      <Label htmlFor="push-notifications">
                        Push Notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-app-notifications" defaultChecked />
                      <Label htmlFor="in-app-notifications">
                        In-App Notifications
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-frequency">
                    Notification Frequency
                  </Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger id="notification-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  Save Communication Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
