import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";

import { siteConfig } from "@/config/site";
import { I18nProvider } from "@/i18n/client";
import { directions, locales } from "@/i18n/config";
import { getDict, getLocale } from "@/i18n/server";

import "../globals.css";
import { Providers } from "../providers";

const geistSans = Geist({
  // Consumed by `--font-geist-sans` in globals.css.
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Geist carries no Arabic glyphs, so Arabic would fall back to whatever the
// device happens to have. This ships a face that was drawn for the script.
const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

/** Pre-renders the three language shells instead of building them per request. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: d.common.description,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const dict = await getDict();

  return (
    // `dir` is what flips the whole layout for Arabic: every logical Tailwind
    // utility (ms-, pe-, start-, text-start) reads it, so there is no mirrored
    // stylesheet to maintain.
    <html
      lang={locale}
      dir={directions[locale]}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider locale={locale} dict={dict}>
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
