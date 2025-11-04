import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreInitializer } from "@/components/store-initializer";
import { PWAInstaller } from "@/components/pwa-installer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UNI-Agent - AI Academic Assistant",
  description: "Your intelligent academic companion for organizing studies, planning assignments, and learning effectively.",
  manifest: "/manifest.json",
  themeColor: "#0066cc",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UNI-Agent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <StoreInitializer />
          <PWAInstaller />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
