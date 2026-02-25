import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Toast from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Market Now | One Solution to Win Every Search",
  description: "Market Now helps you win digital brand visibility across traditional SEO and AI search engines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');var r=t==='dark'||(t!='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',r);})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Header showAuth={true} />
        <main className="flex-1">{children}</main>
        <Toast />
      </body>
    </html>
  );
}
