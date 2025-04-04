"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { useApi } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { data, loading, error, sendRequest } = useApi();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await sendRequest("/api/auth/login", "POST", {
      email: formData.email,
      password: formData.password,
    });
  };

  // display error and success messages
  if (error) {
    toast({
      title: "Error",
      description: error,
    });
  }

  if (data) {
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Login successfully!",
      });

      router.push("/");
    }, 2000);
  }

  const isFormIncomplete =
    Object.values(formData).some((value) => !value?.trim()) || loading;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Log in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleSubmit}
            type="submit"
            className="w-full"
            disabled={isFormIncomplete}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
