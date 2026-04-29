import type { Metadata } from "next";
import "./globals.css";
import { VariantProvider } from "@/components/VariantProvider";
import { DM_Sans, Crimson_Text, Space_Mono, Playfair_Display, Manrope } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['400', '500', '700'] });
const crimson = Crimson_Text({ subsets: ['latin'], variable: '--font-crimson', weight: ['400', '600', '700'] });
const spaceMono = Space_Mono({ subsets: ['latin'], variable: '--font-space-mono', weight: ['400', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['400', '500', '700'] });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: "Class Portfolio Platform",
  description: "A lightweight, premium gallery for class projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${crimson.variable} ${spaceMono.variable} ${playfair.variable} ${manrope.variable} antialiased`}>
        <VariantProvider>
          <div className="min-h-screen variant-transition">
            {children}
          </div>
        </VariantProvider>
      </body>
    </html>
  );
}
