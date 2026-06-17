import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Rape Gang Inquiry",
  description: "An independent, survivor-led inquiry into organised child sexual exploitation in the United Kingdom. Chaired by Rupert Lowe MP. Led by Sammy Woodhouse. The minimum estimated scale: 250,000 victims across 149 local authority districts.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f5f5f4]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0a0a0a] focus:text-[#f5f5f4] focus:outline focus:outline-2 focus:outline-[#7f1d1d]"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
