import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Noto_Serif_Telugu } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const telugu = Noto_Serif_Telugu({
  variable: "--font-telugu",
  subsets: ["telugu"],
  weight: ["400", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = protocol + "://" + host;
  const image = origin + "/og.png";

  return {
    title: "Pragya & Nithin | Engagement Invitation",
    description:
      "With love, the Midde family invites you to celebrate Pragya and Nithin on 16 August 2026 at Manjeera Sarovar Premiere, Rajahmundry.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      title: "Pragya & Nithin are getting engaged",
      description: "Join us on Sunday, 16 August 2026 at 9:30 AM in Rajahmundry.",
      type: "website",
      url: origin,
      images: [{ url: image, width: 1200, height: 630, alt: "Pragya and Nithin engagement invitation" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pragya & Nithin are getting engaged",
      description: "Sunday, 16 August 2026 · 9:30 AM · Rajahmundry",
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={display.variable + " " + sans.variable + " " + telugu.variable}>
        {children}
      </body>
    </html>
  );
}
