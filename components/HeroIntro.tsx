import { FileAudio, FileText, Sparkles } from "lucide-react";

export function HeroIntro() {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white p-8 text-slate-950 shadow-xl shadow-slate-200/70">
      <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-600">
            <Sparkles className="h-4 w-4 text-amber-500" />
            AI 회의록 분석기
          </div>
          <h1 className="mt-5 text-6xl font-black leading-tight tracking-normal text-slate-950">
            회의 음성을 올리면
            <br />
            핵심만 정리합니다
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-bold leading-relaxed text-slate-600">
            이 화면에서는 회의 내용만 받습니다. 요약, 주요 안건, 결정사항, 액션 아이템을
            먼저 확인한 뒤 별도 버튼으로 월루 음악 생성기 화면을 열 수 있습니다.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "음성 전사", icon: FileAudio },
              { label: "요약 생성", icon: FileText },
              { label: "결정사항 추출", icon: Sparkles },
              { label: "액션 아이템", icon: FileText },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-md border border-slate-200 bg-white p-5">
                  <Icon className="mb-4 h-8 w-8 text-amber-500" />
                  <p className="text-lg font-black text-slate-900">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
