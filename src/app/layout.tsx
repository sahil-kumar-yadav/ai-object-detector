import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI Object Detector — Real-Time Detection with TensorFlow.js",
  description:
    "A production-grade real-time object detection web application powered by TensorFlow.js COCO-SSD. Built with Next.js 14, TypeScript, and Tailwind CSS.",
  keywords: [
    "AI",
    "object detection",
    "TensorFlow.js",
    "Next.js",
    "computer vision",
    "machine learning",
  ],
  authors: [{ name: "Developer" }],
  openGraph: {
    title: "AI Object Detector",
    description: "Real-time object detection in your browser",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

