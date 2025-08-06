import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Solid - Sistem Manajemen Informasi RS",
  description:
    "Sistem Manajemen Informasi Rumah Sakit yang dibangun dengan berorientasi terhadap kemudahan pengguna dalam mengelola seluruh informasi yang dibutuhkan oleh suatu Rumah Sakit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
