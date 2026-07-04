import {
  CalendarDays,
  CheckSquare,
  Clock,
  Crown,
  FileText,
  Music2,
  Star,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { MockResult } from "@/lib/types";

type TrollViewProps = {
  result: MockResult;
};

export function TrollView({ result }: TrollViewProps) {
  const topCandidate = result.trollCandidates[0];
  const derailmentCount = result.derailmentLines.length + result.offContextQuotes.length;

  return (
    <section className="space-y-6">
      <div className="paper-card grid grid-cols-[1fr_1fr_1fr_0.55fr] gap-3 p-5">
        <SummaryCard
          icon={FileText}
          title="오늘의 회의 요약"
          lines={[
            result.summary,
            `하이라이트 ${result.trollHighlights.length}개 추출`,
            "종합 평가: 회의는 끝났고, 밈은 남았습니다.",
          ]}
        />
        <div className="rounded-md border-2 border-neutral-300 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <Crown className="h-8 w-8 text-black" />
            <h3 className="text-2xl font-black">오늘의 월루 후보</h3>
          </div>
          <p className="mb-3 text-sm font-black text-neutral-500">점수 기준 TOP 3</p>
          <div className="space-y-3">
            {result.trollCandidates.slice(0, 3).map((candidate, index) => (
              <div key={candidate.name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-black">{candidate.name}</p>
                    <p className="line-clamp-1 text-xs font-bold text-neutral-500">{candidate.reason}</p>
                  </div>
                </div>
                <p className="text-xl font-black">{candidate.score}점</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border-2 border-neutral-300 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <CheckSquare className="h-8 w-8 text-black" />
            <h3 className="text-2xl font-black">액션 아이템</h3>
          </div>
          <div className="space-y-3">
            {result.actionItems.slice(0, 4).map((item) => (
              <label key={`${item.owner}-${item.task}`} className="flex items-start gap-2 text-sm font-bold">
                <input checked readOnly className="mt-1 accent-black" type="checkbox" />
                <span>
                  {item.task} <b>({item.due})</b>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-md border-2 border-neutral-300 bg-white p-5">
          <InfoRow icon={Users} label="참석자" value={`${result.participants.length}명`} />
          <InfoRow icon={Clock} label="회의 시간" value={result.duration} />
          <InfoRow icon={CalendarDays} label="생성 일시" value={result.generatedAt} />
        </div>
      </div>

      <div>
        <div className="sticker mb-4 px-5 py-2 text-2xl">세부 결과 내용</div>
        <div className="grid grid-cols-4 gap-4">
          <DarkDetailCard
            icon={Star}
            title="하이라이트 추출"
            main={`"${result.offContextQuotes[0] ?? result.trollHighlights[0] ?? "오늘의 명대사 수집 중"}"`}
            caption="회의 뒤에 남은 진짜 이야기"
          />
          <div className="black-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Crown className="h-8 w-8 text-caution" />
              <h3 className="text-2xl font-black">월루 후보</h3>
            </div>
            <div className="flex min-h-48 flex-col items-center justify-center rounded-md border border-caution/60 bg-black/45 text-center">
              <p className="text-7xl font-black text-caution">{topCandidate?.score ?? 0}</p>
              <p className="text-xl font-black">/100</p>
              <p className="mt-3 text-lg font-black">{topCandidate?.name ?? "후보 없음"}</p>
            </div>
          </div>
          <div className="black-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <TriangleAlert className="h-8 w-8 text-caution" />
              <h3 className="text-2xl font-black">맥락 이탈 발견</h3>
            </div>
            <div className="rounded-md border border-white/20 bg-black/45 p-5 text-center">
              <p className="text-6xl font-black text-caution">{derailmentCount}회</p>
              <p className="mt-3 text-sm font-bold text-white/70">
                주제 이탈, 흐름 끊김, 회의 좌초 멘트 감지
              </p>
            </div>
            <ul className="mt-4 space-y-2 text-xs font-bold text-white/70">
              {result.derailmentLines.slice(0, 3).map((line) => (
                <li key={line}>- {line}</li>
              ))}
            </ul>
          </div>
          <DarkDetailCard
            icon={Music2}
            title="음악 생성 재료"
            main={result.lyrics.title}
            caption={result.lyrics.lines.slice(0, 3).join(" / ")}
          />
        </div>
      </div>

      <div className="paper-card p-5">
        <div className="sticker mb-5 px-5 py-2 text-2xl">한눈에 보는 프로세스</div>
        <div className="flex items-center justify-between gap-4 text-black">
          {[
            { label: "입력 수집", icon: FileText },
            { label: "회의록 요약", icon: CheckSquare },
            { label: "하이라이트 추출", icon: Star },
            { label: "오늘의 월루", icon: Crown },
            { label: "음악 생성", icon: Music2 },
          ].map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.label} className="flex flex-1 items-center gap-4">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-caution">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-black">{step.label}</p>
                </div>
                {index < 4 ? <span className="text-4xl font-black">→</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type SummaryCardProps = {
  icon: LucideIcon;
  title: string;
  lines: string[];
};

function SummaryCard({ icon: Icon, title, lines }: SummaryCardProps) {
  return (
    <div className="rounded-md border-2 border-neutral-300 bg-white p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-8 w-8 text-black" />
        <h3 className="text-2xl font-black">{title}</h3>
      </div>
      <ul className="space-y-3 text-sm font-bold leading-relaxed">
        {lines.map((line) => (
          <li key={line}>- {line}</li>
        ))}
      </ul>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-neutral-300 py-4 last:border-0">
      <Icon className="mb-2 h-8 w-8 text-black" />
      <p className="text-sm font-black text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}

function DarkDetailCard({
  icon: Icon,
  title,
  main,
  caption,
}: {
  icon: LucideIcon;
  title: string;
  main: string;
  caption: string;
}) {
  return (
    <div className="black-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-8 w-8 text-caution" />
        <h3 className="text-2xl font-black">{title}</h3>
      </div>
      <div className="min-h-36 rounded-md border-2 border-caution bg-black/45 p-5 text-xl font-black leading-relaxed text-caution">
        {main}
      </div>
      <p className="mt-4 text-sm font-bold leading-relaxed text-white/70">{caption}</p>
    </div>
  );
}
