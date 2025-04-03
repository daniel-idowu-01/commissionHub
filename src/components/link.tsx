"use client";
import NextLink from "next/link";
import { type AnchorHTMLAttributes, forwardRef } from "react";

export const Link = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>(({ href, ...props }, ref) => {
  return <NextLink ref={ref} href={href} {...props} />;
});

Link.displayName = "Link";
