import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Toast from "@/components/ui/Toast";
import FloatingChatbot from "@/components/FloatingChatbot";
import { DashboardSidebarProvider } from "@/contexts/DashboardSidebarContext";
import ButtonHints from "@/components/layout/ButtonHints";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI-Powered SEO & GEO Intelligence Platform | Market Now",
  description: "Market Now helps businesses improve search rankings and AI answer engine visibility through advanced technical SEO audits, GEO analysis, performance diagnostics, citation tracking, and marketing automation workflows. Discover issues, analyze competitors, and grow your digital presence faster with data-driven insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-cosmic-dark text-foreground`}
      >
        <DashboardSidebarProvider>
          <Header showAuth={true} />
          <main className="flex-1">{children}</main>
          <FloatingChatbot />
          <ButtonHints />
          <Toast />
        </DashboardSidebarProvider>
      </body>
    </html>
  );
}

