"use client";

import { Loader2 } from "lucide-react";

type LoadingVideoCardProps = {
  mode: "minutes" | "wollu";
};

const loadingCopy = {
  minutes: {
    src: "/media/meeting-loading.mp4",
    title: "회의록을 정리하는 중...",
    description: "음성을 전사하고 핵심 안건, 결정사항, 액션 아이템을 추출하고 있습니다.",
    frameClass: "border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-200/70",
    videoClass: "bg-white",
    spinnerClass: "text-blue-600",
  },
  wollu: {
    src: "/media/wollu-loading.mp4",
    title: "이 회의의 월급 루팡 색출중...",
    description: "회의록 속 하이라이트와 후보 데이터를 바탕으로 월루송 재료를 조합하고 있습니다.",
    frameClass: "border-white bg-black text-white shadow-white",
    videoClass: "bg-white",
    spinnerClass: "text-caution",
  },
};

export function LoadingVideoCard({ mode }: LoadingVideoCardProps) {
  const copy = loadingCopy[mode];

  return (
    <section className={`rounded-lg border-2 p-6 ${copy.frameClass}`}>
      <div className="grid grid-cols-[0.72fr_0.28fr] items-center gap-6">
        <div className={`overflow-hidden rounded-lg border ${copy.videoClass}`}>
          <video
            autoPlay
            className="aspect-square h-full max-h-[560px] w-full object-contain"
            loop
            muted
            playsInline
            src={copy.src}
          />
        </div>
        <div>
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-current/10">
            <Loader2 className={`h-10 w-10 animate-spin ${copy.spinnerClass}`} />
          </div>
          <h2 className="text-4xl font-black leading-tight">{copy.title}</h2>
          <p className="mt-4 text-lg font-bold leading-relaxed opacity-70">{copy.description}</p>
          <div className="mt-8 h-3 overflow-hidden rounded-full bg-current/10">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-current" />
          </div>
        </div>
      </div>
    </section>
  );
}
