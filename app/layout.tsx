import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "월루를 찾아라 | AI 회의록 생성기",
  description: "회의록 생성기처럼 보이지만, 버튼 하나로 월루 색출 보드가 열리는 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
