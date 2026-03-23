import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'DSA Tracker | Master Consistency in Algorithm Prep',
  description: 'The ultimate tool for tracking your Data Structures and Algorithms progress. Build streaks, visualize growth, and master your technical interviews.',
  keywords: ['DSA', 'LeetCode', 'Algorithm Tracker', 'Coding Interview', 'Technical Interview Prep'],
  authors: [{ name: 'DSA Tracker Team' }],
  openGraph: {
    title: 'DSA Tracker',
    description: 'Master Consistency in Algorithm Prep',
    type: 'website',
    url: 'https://dsa-tracker.vercel.app',
    siteName: 'DSA Tracker',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col noise">{children}</body>
    </html>
  );
}
