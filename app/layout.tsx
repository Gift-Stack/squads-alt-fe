import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Squads Alternate",
  description: "Squads Alternate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
