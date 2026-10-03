import type { Metadata } from "next";
import "./globals.css";
import {NAME, DESCRIPTION} from '@/lib/constants';
import {inter} from '@/lib/fonts';
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: NAME,
  description: DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}
      >
        {children}
        
        <Toaster />
      </body>
    </html>
  );
}
