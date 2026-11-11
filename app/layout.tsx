import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Tesla — Албан ёсны дистрибютер",
    template: "%s",
  },
  description: "Хүчирхэг, хэмнэлттэй, байгальд ээлтэй ирээдүйн жолоодлогыг өнөөдөр эхлүүл.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={inter.variable}>
      <body>
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
