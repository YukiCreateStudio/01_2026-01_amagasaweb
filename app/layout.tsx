import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./_component/Header";
import Footer from "./_component/Footer";
import { GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | test用サイト",
    default: "test用サイト",
  },
  description:
    "「Next.js+ヘッドレスCMSではじめる！簡単・モダンWebサイト製作入門」で作成されるサイトです。",
  openGraph: {
    title: {
      template: "%s | test用サイト",
      default: "test用サイト",
    },
    description:
      "「Next.js+ヘッドレスCMSではじめる！簡単・モダンWebサイト製作入門」で作成されるサイトです。",
    siteName: "test用サイト",
    images: ["/ogp.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  //動作確認・実装テスト専用の記述（※本番運用時は削除すること）
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <GoogleTagManager gtmId="GTM-P33D79VJ" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
