import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

/* ------------------------------------------------------------------ */
/*  Fonts                                                              */
/* ------------------------------------------------------------------ */

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
  weight: ["400"],
});

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  metadataBase: new URL("https://hopeag.com"),
  title: {
    default: "Hope Christian Church | North Haven, CT",
    template: "%s | Hope Christian Church",
  },
  description:
    "Hope Christian Church is a welcoming, Christ-centered community in North Haven, Connecticut. Join us for worship, fellowship, and spiritual growth.",
  keywords: [
    "Hope Christian Church",
    "North Haven CT",
    "church",
    "worship",
    "community",
    "faith",
    "Christian",
    "Connecticut",
  ],
  authors: [{ name: "Hope Christian Church" }],
  openGraph: {
    title: "Hope Christian Church | North Haven, CT",
    description:
      "A welcoming, Christ-centered community in North Haven, Connecticut. Join us Sundays at 10 AM and Wednesdays at 7 PM.",
    type: "website",
    locale: "en_US",
    siteName: "Hope Christian Church",
    images: [{ url: "/ChatGPT-Facebook-Photo.jpg", width: 1200, height: 630, alt: "Hope Christian Church" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope Christian Church | North Haven, CT",
    description:
      "A welcoming, Christ-centered community in North Haven, Connecticut. Join us Sundays at 10 AM and Wednesdays at 7 PM.",
    images: ["/ChatGPT-Facebook-Photo.jpg"],
  },
};

const churchJsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "Hope Christian Church",
  url: "https://hopeag.com",
  logo: "https://hopeag.com/ope.png",
  image: "https://hopeag.com/ChatGPT-Facebook-Photo.jpg",
  description:
    "Hope Christian Church is a welcoming, Christ-centered community in North Haven, Connecticut.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "North Haven",
    addressRegion: "CT",
    addressCountry: "US",
  },
  telephone: "(203) 234-7328",
  sameAs: [
    "https://youtube.com/@hopechristianct",
  ],
};

/* ------------------------------------------------------------------ */
/*  Root Layout                                                        */
/* ------------------------------------------------------------------ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9BL0XPJ0S2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9BL0XPJ0S2');
          `}
        </Script>
      </head>
      <body className="font-body bg-bg text-text antialiased">
        <Script
          id="church-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
        />
        <Header />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
