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
    title: "Pragya & Nithin | Wedding Invitation",
    description:
      "With love, the Midde and Rajulapati families invite you to the wedding of Pragya Tejasri and Nithin on 30 August 2026 at Suresh Convention Centre, Koyyalagudem, followed by a reception on 1 September 2026 in Dhavaleswaram.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      title: "Pragya & Nithin are getting married",
      description: "Join us on Sunday, 30 August 2026 at 11:25 PM in Koyyalagudem, and for the reception on 1 September in Dhavaleswaram.",
      type: "website",
      url: origin,
      images: [{ url: image, width: 1200, height: 630, alt: "Pragya and Nithin wedding invitation" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Pragya & Nithin are getting married",
      description: "Sunday, 30 August 2026 · 11:25 PM Muhurtham · Koyyalagudem",
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
