import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RecoilWrapper from "@/components/RecoilWrapper";
import Head from "next/head";

const pretendard = localFont({
  src: [
    {
      path: "./fonts/Pretendard-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Pretendard-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Dongsun An",
  description: "Dongsun An's website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="node_modules/@glidejs/glide/dist/css/glide.core.min.css"
        />
        <link
          rel="stylesheet"
          href="node_modules/@glidejs/glide/dist/css/glide.theme.min.css"
        />
      </Head>

      <body className={pretendard.className}>
        <RecoilWrapper>{children}</RecoilWrapper>
      </body>
    </html>
  );
}
