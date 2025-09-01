import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import LenisScrollProvider from "@/components/lenis-provider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Food Stop - Food website homepage",
  description:
    "Food website homepage built with Next.js, Tailwind CSS, TypeScript, and GSAP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body>
        <LenisScrollProvider>{children}</LenisScrollProvider>
      </body>
    </html>
  );
}
