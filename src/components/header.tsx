"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label?: string;
  link?: string;
}

const navigation: NavigationItem[] = [
  { label: "Dine out", link: "/" },
  { label: "Delivery", link: "/" },
  { label: "Take-away", link: "/" },
];

export function Header() {
  const [isMenuToggled, setIsmMenuToggled] = useState(false);

  const handleMobileNav = () => {
    setIsmMenuToggled((prev) => !prev);
  };

  return (
    <header className="absolute inset-x-0 top-0 isolate z-50 py-4 lg:py-9.5">
      <nav className="container flex items-center justify-between gap-1">
        {/* brand logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-5">
          <Image
            src="/brand/logo.svg"
            alt="Food Stop logo"
            width={26}
            height={26}
          />
          <span className="text-xl font-semibold">Food Stop</span>
        </Link>

        {/* default navigation */}
        <ul className="hidden items-center gap-5 lg:flex xl:gap-13.5">
          {navigation?.map((item) => (
            <li key={item?.label}>
              <Link href={item?.link || "/"}>{item?.label}</Link>
            </li>
          ))}
        </ul>

        {/* search box */}
        <div className="hidden grid-cols-[auto_1fr] gap-2 lg:grid">
          <Button
            variant="outline"
            size="icon"
            className="rounded-2xl bg-[#F3F0ED] p-2"
          >
            <Icons.location className="size-5" />
          </Button>

          <input
            type="search"
            placeholder="Search your favorite food"
            className="border-muted min-w-25 rounded-2xl border-2 bg-[#F3F0ED] px-4 py-2 lg:min-w-72 xl:min-w-94"
          />
        </div>

        {/* buttons group */}
        <div className="flex items-center lg:gap-8">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="lg:p-0"
          >
            <Icons.cart className="size-4 lg:size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Lock"
            className="lg:p-0"
          >
            <Icons.lock className="size-4 lg:size-5" />
          </Button>
          {/* menu opener */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu Opener"
            onClick={handleMobileNav}
            className="pr-0 lg:hidden"
          >
            <Icons.menu className="size-4" />
          </Button>
        </div>

        {/* mobile navigation */}
        <div
          className={cn("bg-background fixed inset-0 z-50 hidden flex-col", {
            "flex lg:hidden": isMenuToggled,
          })}
        >
          {/* menu closer */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu Closer"
            onClick={handleMobileNav}
            className="m-5 self-end pt-0 pr-0 md:m-10"
          >
            <Icons.cross className="size-6" />
          </Button>

          {/* mobile menu */}
          <ul className="grid h-full content-center justify-items-center gap-8">
            {navigation?.map((item) => (
              <li key={item?.label} onClick={handleMobileNav}>
                <Link href={item?.link || "/"} className="text-3xl">
                  {item?.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
