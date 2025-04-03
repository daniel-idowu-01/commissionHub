"use client";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShareLinkGeneratorProps {
  productId: string;
  productName: string;
  resellerId: string;
  className?: string;
}

export function ShareLinkGenerator({
  productId,
  productName,
  resellerId,
  className,
}: ShareLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);
  // Generate the unique reseller link
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const uniqueLink = `${baseUrl}/products/${productId}?ref=${resellerId}`;

  // Handle copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uniqueLink);
      setCopied(true);

      toast({
        title: "Link copied!",
        description: "Your unique product link has been copied to clipboard",
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually",
        variant: "destructive",
      });
    }
  };

  // Handle share functionality
  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out this product: ${productName}`,
          url: uniqueLink,
        });

        toast({
          title: "Link shared!",
          description: "Your unique product link has been shared",
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast({
            title: "Failed to share",
            description: "Please try again or copy the link manually",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback to copy if Web Share API is not available
      copyToClipboard();
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <Input value={uniqueLink} readOnly className="flex-1" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="outline" size="icon" onClick={shareLink}>
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share link</span>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Share this unique link to earn commission when customers make a purchase
      </p>
    </div>
  );
}
