import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TimelineProvider } from "@/context/TimelineContext";
import ClientLayout from "@/components/layout/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Về Một Nhà - Giúp bạn một đám cưới hoàn hảo",
  description: "Lên kế hoạch cho ngày cưới hoàn hảo của bạn với các công cụ lập kế hoạch đám cưới toàn diện của chúng tôi",
  other: {
    'locale': 'vi-VN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi-VN">
      <head>
        <meta name="locale" content="vi-VN" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <TimelineProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </TimelineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
