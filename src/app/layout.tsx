import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BDSXXX - Nền tảng kết nối môi giới và khách hàng Bất động sản",
  description: "BDSXXX giúp bạn tìm kiếm căn hộ, nhà phố, dự án bất động sản nhanh chóng và chính xác. Giải pháp công nghệ hàng đầu cho môi giới chuyên nghiệp.",
  keywords: "bất động sản, chung cư, nhà phố, bds hà nội, bds hồ chí minh, bdsxxx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
       <head>
          <title>BDSXXX - Nền tảng Bất động sản hàng đầu</title>
       </head>
      <body>{children}</body>
    </html>
  );
}
