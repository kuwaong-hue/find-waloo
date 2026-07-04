import Image from "next/image";
import { FileAudio, FileText, Sparkles } from "lucide-react";

export function HeroIntro() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-slate-950 shadow-xl shadow-slate-200/70">
      <div className="grid grid-cols-[1fr_0.95fr] items-center gap-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-600">
            <Sparkles className="h-4 w-4 text-blue-600" />
            AI 회의록 분석기
          </div>
          <h1 className="mt-5 text-6xl font-black leading-tight tracking-normal text-slate-950">
            회의 음성을 올리면
            <br />
            핵심만 정리합니다
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-bold leading-relaxed text-slate-600">
            이 화면에서는 회의 내용만 받습니다. 음성 파일 또는 회의 메모를 넣으면 요약,
            주요 안건, 결정사항, 다음 액션을 먼저 정리합니다.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {[
              { label: "음성 또는 텍스트 입력", icon: FileAudio },
              { label: "회의록 자동 정리", icon: FileText },
              { label: "결정사항 추출", icon: Sparkles },
              { label: "액션 아이템 정리", icon: FileText },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <Icon className="mb-3 h-7 w-7 text-blue-600" />
                  <p className="text-base font-black text-slate-900">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <Image
            alt="회의록 생성기 레이아웃 미리보기"
            className="h-auto w-full"
            height={1024}
            priority
            src="/media/main-page.png"
            width={1024}
          />
        </div>
      </div>
    </section>
  );
}
