"use client";
import type React from "react";
import { toast } from "@/lib/toast";
import { useApi } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/stores/user-store";
import { Separator } from "@/components/ui/separator";
import { Bell, CreditCard, Key, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  const router = useRouter();
  const { sendRequest } = useApi();
  const { user, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });

  ////////////////////////////////
  // get user profile info from db
  ////////////////////////////////
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await sendRequest("/api/profile", "GET");
        if (response) {
          setProfileData({
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            bio: response.bio || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [sendRequest]);

  ////////////////////////////////
  // update user profile info to db
  ////////////////////////////////
  const submitProfileChange = async () => {
    setIsProfileSaving(true);
    try {
      const response = await sendRequest("/api/profile", "PUT", {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
      });

      if (response) {
        if (user?.id) {
          useUserStore.getState().setUser({
            ...user,
            id: user.id,
            name: `${profileData.firstName} ${profileData.lastName}`,
          });
        }
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  ////////////////////////////////
  // update user profile info to db
  ////////////////////////////////
  const submitPasswordInfoChange = async () => {
    setIsPasswordSaving(true);
    try {
      if (
        !passwordInfo.currentPassword ||
        !passwordInfo.newPassword ||
        !passwordInfo.confirmPassword
      ) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
        });
        return;
      }

      if (passwordInfo.currentPassword === passwordInfo.newPassword) {
        toast({
          title: "Error",
          description: "New password cannot be the same as current password",
        });
        return;
      }

      if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
        toast({
          title: "Error",
          description: "New password and confirm password do not match",
        });
        return;
      }

      const response = await sendRequest(
        "/api/profile/change-password",
        "PUT",
        {
          currentPassword: passwordInfo.currentPassword,
          newPassword: passwordInfo.newPassword,
          confirmPassword: passwordInfo.confirmPassword,
        }
      );

      if (response) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update password";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  ////////////////////////////////
  // Handle profile form input changes
  ////////////////////////////////
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileData({ ...profileData, [e.target.id]: e.target.value });
  };

  ////////////////////////////////
  // Handle password form input changes
  ////////////////////////////////
  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPasswordInfo({ ...passwordInfo, [e.target.id]: e.target.value });
  };

  ////////////////////////////////
  // handle delete account
  ////////////////////////////////
  const handleDeleteAccount = async () => {
    try {
      const response = await sendRequest("/api/profile/delete-user", "DELETE");
      if (response) {
        toast({
          title: "Success",
          description: "Account deleted successfully",
        });

        clearUser();
        router.push("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
      });
    }
  };

  if (isLoading)
    return (
      <div className="container py-10 px-5 sm:px-10 h-screen">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold tracking-tight"></h1>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container py-10 px-5 sm:px-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Separator />
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your public profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName || ""}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName || ""}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    disabled={true}
                    value={profileData.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={submitProfileChange}
                  disabled={isProfileSaving}
                >
                  {isProfileSaving ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you&apos;ll be logged
                  out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={isPasswordSaving}
                  onClick={submitPasswordInfoChange}
                >
                  {" "}
                  {isPasswordSaving
                    ? "Chainging Password..."
                    : "Change Password"}
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Account Deletion</CardTitle>
                <CardDescription>
                  Permanently delete your account and all of your content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. This
                  action cannot be undone.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label
                    htmlFor="marketing-emails"
                    className="flex flex-col space-y-1"
                  >
                    <span>Marketing emails</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails about new products, features, and more.
                    </span>
                  </Label>
                  <Switch id="marketing-emails" />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label
                    htmlFor="social-emails"
                    className="flex flex-col space-y-1"
                  >
                    <span>Social emails</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails for friend requests, follows, and more.
                    </span>
                  </Label>
                  <Switch id="social-emails" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label
                    htmlFor="security-emails"
                    className="flex flex-col space-y-1"
                  >
                    <span>Security emails</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive emails about your account activity and security.
                    </span>
                  </Label>
                  <Switch id="security-emails" defaultChecked disabled />
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  You cannot disable security emails.
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">
                        Expires 04/2024
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Add payment method</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your billing history and download invoices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No billing history available.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
