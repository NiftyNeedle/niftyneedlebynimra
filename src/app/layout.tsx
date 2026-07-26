import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { ThemeProvider, themeScript } from "@/lib/theme";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/toast";
import { SiteChrome } from "@/components/layout/site-chrome";
import { CurrencyProvider } from "@/components/currency/currency-provider";
import { getRates, currencyForCountry, isCurrency } from "@/lib/currency";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = "https://niftyneedle.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nifty Needle — Handcrafted Crochet Made with Love",
    template: "%s · Nifty Needle",
  },
  description:
    "Discover handmade crochet flowers, bouquets, plushies, gifts, home décor, and fully customized creations. Every stitch tells a story.",
  keywords: [
    "handmade crochet",
    "crochet flowers",
    "crochet bouquet",
    "amigurumi plushies",
    "custom crochet",
    "handcrafted gifts",
  ],
  openGraph: {
    title: "Nifty Needle — Handcrafted Crochet Made with Love",
    description:
      "Handmade crochet flowers, bouquets, plushies, and fully custom creations crafted especially for you.",
    url: siteUrl,
    siteName: "Nifty Needle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nifty Needle — Handcrafted Crochet Made with Love",
    description:
      "Handmade crochet flowers, bouquets, plushies, and fully custom creations.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [rates, cookieStore, headerList] = await Promise.all([
    getRates(),
    cookies(),
    headers(),
  ]);
  const savedCurrency = cookieStore.get("nn_currency")?.value;
  const initialCurrency = isCurrency(savedCurrency)
    ? savedCurrency
    : currencyForCountry(headerList.get("x-vercel-ip-country"));

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground"
      >
        <ThemeProvider>
          <CurrencyProvider initialCurrency={initialCurrency} rates={rates}>
            <StoreProvider>
              <ToastProvider>
                <SiteChrome>{children}</SiteChrome>
              </ToastProvider>
            </StoreProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
