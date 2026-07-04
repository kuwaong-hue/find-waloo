import { FileText, Sparkles } from "lucide-react";

export function HeroIntro() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-950 shadow-xl shadow-slate-200/70">
      <div className="grid grid-cols-[1fr_0.52fr] items-center gap-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-blue-600">
            <Sparkles className="h-4 w-4" />
            AI 회의 메모 요약기
          </div>
          <h1 className="mt-5 text-6xl font-black leading-tight tracking-normal text-slate-950">
            회의 메모를 넣으면
            <br />
            핵심만 정리합니다
          </h1>
          <p className="mt-5 max-w-3xl text-xl font-bold leading-relaxed text-slate-600">
            음성 파일이나 회의 메모를 넣으면 요약, 주요 안건, 결정사항, 다음 액션을 빠르게 정리합니다.
            월루송 생성은 회의 중요사항 확인 이후 별도 화면에서 진행합니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <FileText className="mb-4 h-12 w-12 text-blue-600" />
          <p className="text-2xl font-black text-slate-950">회의 내용을 먼저 정리하세요</p>
          <p className="mt-3 text-base font-bold leading-relaxed text-slate-500">
            오디오 없이 텍스트만 넣어도 분석할 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
