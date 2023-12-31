import type { Metadata } from "next";
import { Noto_Sans_KR, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import React from "react";
import { cls } from "lib/class-name";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "경매 입장",
  description: "경매 입장",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={cls(
          roboto.className,
          notoSansKR.className,
          "aspect-video",
          "h-screen",
          "m-auto"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
