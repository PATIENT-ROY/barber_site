import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barber Baxha — Профессиональные стрижки и обучение барберов",
  description:
    "Баха Бабаджанов - профессиональный барбер. Мужские стрижки, обучение барберов с нуля, мастер-классы. Москва. Запись в Telegram @barber_baxha",
  metadataBase: new URL("https://barber-baxha.netlify.app"),
  openGraph: {
    title: "Barber Baxha — Профессиональные стрижки и обучение барберов",
    description:
      "Баха Бабаджанов - профессиональный барбер. Мужские стрижки, обучение барберов с нуля, мастер-классы. Москва. Запись в Telegram @barber_baxha",
    type: "website",
    url: "https://barber-baxha.netlify.app",
    siteName: "Barber Baxha",
    locale: "ru_RU",
    images: [
      {
        url: "/gallery/hero_optimized.jpg",
        width: 1200,
        height: 630,
        alt: "Barber Baxha - Профессиональный барбер",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barber Baxha — Профессиональные стрижки и обучение барберов",
    description:
      "Баха Бабаджанов - профессиональный барбер. Мужские стрижки, обучение барберов с нуля, мастер-классы.",
    images: ["/gallery/hero.png"],
  },
  icons: {
    icon: "/scissors-icon.svg",
    shortcut: "/scissors-icon.svg",
    apple: "/scissors-icon.svg",
  },
  keywords: [
    "барбер",
    "barber",
    "мужская стрижка",
    "борода",
    "барбершоп",
    "мастер-классы барбер",
    "обучение барберов",
    "Баха Бабаджанов",
    "Barber Baxha",
    "стрижки Москва",
    "фейдинг",
    "классическое бритье",
    "уход за бородой",
  ],
  authors: [{ name: "Баха Бабаджанов" }],
  creator: "Баха Бабаджанов",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
