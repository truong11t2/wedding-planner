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
  title: "Perfect Day Planner - Wedding Planning Made Easy",
  description: "Plan your perfect wedding day with our comprehensive wedding planning tools",
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
