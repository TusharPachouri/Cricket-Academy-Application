import type { Metadata } from "next";
import { Bebas_Neue, Playfair_Display, Barlow_Condensed, DM_Sans, Instrument_Serif, Cormorant_Garamond, IM_Fell_English } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  style: ["normal", "italic"],
});

const imFellEnglish = IM_Fell_English({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fell",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Braj Cricket Academy — Forged in the Spirit of India",
  description: "Premier cricket coaching academy. 500+ trained athletes, 12 national players, 15 years of excellence. Train like India's finest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${playfairDisplay.variable} ${barlowCondensed.variable} ${dmSans.variable} ${instrumentSerif.variable} ${cormorantGaramond.variable} ${imFellEnglish.variable}`}
      >
        <div id="cursor" />
        {children}
      </body>
    </html>
  );
}
