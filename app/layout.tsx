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
  title: "Barber Ivanov — Я стригу и обучаю мастеров",
  description:
    "Профессиональные мужские стрижки, обучение барберов с нуля. Москва. Запись в WhatsApp/Telegram.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Barber Ivanov — Я стригу и обучаю мастеров",
    description:
      "Профессиональные мужские стрижки, обучение барберов с нуля. Москва. Запись в WhatsApp/Telegram.",
    type: "website",
    url: "/",
    images: [
      { url: "/barber-og.svg", width: 1200, height: 630, alt: "Barber Ivanov" },
    ],
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
  ],
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
