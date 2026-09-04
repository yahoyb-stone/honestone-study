import type { Metadata } from "next";
import "./globals.css";
import { site, siteUrl, study } from "@/config/study";

export const metadata: Metadata = {
  // OG 이미지·canonical 을 절대 URL 로 만들기 위한 기준. 없으면 빌드가 localhost 로 대체한다.
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: `${study.title} | ${site.name}`,
  description: `${study.subtitle}. 벤처기업확인·이노비즈·기업부설연구소·ISO가 정책자금·입찰 가점·세제 혜택으로 이어지는 구조를 대표의 눈높이에서 공부하는 전 ${study.sessionCount}회 스터디 — ${study.cohort} 사전 신청 접수중.`,
  keywords: [
    "인증 전문가 스터디",
    "기업인증 스터디",
    "기업인증 공부",
    "벤처기업확인",
    "이노비즈",
    "기업부설연구소",
    "정책자금 공부",
    "부천 스터디",
    "강서 스터디",
    "사업가 스터디",
  ],
  openGraph: {
    title: `${study.title} — ${site.name} ${study.cohort} 모집`,
    description: study.subtitle,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-neutral-900 break-keep">
        {children}
      </body>
    </html>
  );
}
