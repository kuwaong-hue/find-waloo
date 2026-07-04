import Image from "next/image";

export function HeroIntro() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <Image
        alt="회의록 생성기 메인 레이아웃"
        className="h-auto w-full"
        height={1024}
        priority
        src="/media/main-page.png"
        width={1024}
      />
    </section>
  );
}
