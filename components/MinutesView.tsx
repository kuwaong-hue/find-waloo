import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Compass,
  FileText,
  Target,
  Users,
} from "lucide-react";
import type { MockResult } from "@/lib/types";

type MinutesViewProps = {
  result: MockResult;
};

export function MinutesView({ result }: MinutesViewProps) {
  return (
    <section className="space-y-5">
      <NumberedCard
        icon={FileText}
        number="3"
        title="내용 요약"
        tone="blue"
      >
        <ul className="space-y-4 text-lg font-bold leading-relaxed text-slate-700">
          <li>• {result.summary}</li>
          {result.agendas.slice(0, 4).map((agenda) => (
            <li key={agenda}>• {agenda}</li>
          ))}
        </ul>
      </NumberedCard>

      <NumberedCard icon={Target} number="4" title="핵심 내용 요약" subtitle="결정사항" tone="amber">
        <div className="divide-y divide-slate-200">
          {result.decisions.map((decision, index) => (
            <div key={decision} className="grid grid-cols-[0.24fr_0.76fr] gap-4 py-3">
              <p className="font-black text-blue-600">{decisionLabels[index % decisionLabels.length]}</p>
              <p className="font-bold text-slate-700">{decision}</p>
            </div>
          ))}
        </div>
      </NumberedCard>

      <div className="grid grid-cols-2 gap-5">
        <NumberedCard icon={BookOpen} number="5" title="회의 주제" tone="blue">
          <p className="text-xl font-black leading-relaxed text-slate-800">{result.meetingTitle}</p>
          <div className="mt-5 divide-y divide-slate-200 text-base font-bold text-slate-600">
            <InfoLine label="회의 일시" value={result.generatedAt} />
            <InfoLine label="참석자" value={result.participants.join(", ")} />
            <InfoLine label="회의 길이" value={result.duration} />
          </div>
        </NumberedCard>

        <NumberedCard icon={Compass} number="6" title="앞으로의 방향성" tone="blue">
          <ul className="space-y-3">
            {result.actionItems.slice(0, 4).map((item) => (
              <li key={`${item.owner}-${item.task}`} className="flex items-start gap-3 font-bold text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-blue-600" />
                <span>{item.task}</span>
              </li>
            ))}
          </ul>
        </NumberedCard>
      </div>

      <NumberedCard icon={CheckCircle2} number="7" title="다음 액션" tone="blue">
        <div className="overflow-hidden rounded-md border border-slate-200">
          <div className="grid grid-cols-[1fr_0.34fr_0.34fr] bg-slate-50 text-center text-sm font-black text-slate-600">
            <div className="border-r border-slate-200 p-3">할 일</div>
            <div className="border-r border-slate-200 p-3">담당자</div>
            <div className="p-3">기한</div>
          </div>
          {result.actionItems.map((item) => (
            <div
              key={`${item.owner}-${item.task}`}
              className="grid grid-cols-[1fr_0.34fr_0.34fr] border-t border-slate-200 text-center text-sm font-bold text-slate-700"
            >
              <div className="border-r border-slate-200 p-3 text-left">{item.task}</div>
              <div className="border-r border-slate-200 p-3">{item.owner}</div>
              <div className="p-3">{item.due}</div>
            </div>
          ))}
        </div>
      </NumberedCard>
    </section>
  );
}

const decisionLabels = ["전략", "제품", "예산", "일정", "운영"];

type NumberedCardProps = {
  icon: typeof FileText;
  number: string;
  title: string;
  subtitle?: string;
  tone: "blue" | "amber";
  children: React.ReactNode;
};

function NumberedCard({ icon: Icon, number, title, subtitle, tone, children }: NumberedCardProps) {
  const iconClass = tone === "amber" ? "bg-amber-100 text-amber-500" : "bg-blue-50 text-blue-600";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-lg shadow-slate-200/70">
      <div className="mb-5 flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconClass}`}>
          <Icon className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">
          {number}. {title} {subtitle ? <span className="text-lg font-black text-slate-500">({subtitle})</span> : null}
        </h2>
      </div>
      {children}
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[0.32fr_0.68fr] gap-4 py-3">
      <p className="font-black text-slate-800">{label}</p>
      <p>{value}</p>
    </div>
  );
}
