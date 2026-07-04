"use client";

import { MessageSquareQuote, NotebookText, Scale, Utensils } from "lucide-react";
import type { WolluActivity } from "@/lib/types";

type DialogueOption = {
  id: WolluActivity;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const dialogueOptions: DialogueOption[] = [
  {
    id: "quoteRaw",
    title: "하이라이트 대사 주변 대사를 그대로 발췌",
    description: "실제 회의 텍스트에서 나온 문장을 그대로 가져와 강조합니다.",
    icon: MessageSquareQuote,
  },
  {
    id: "summaryHighlight",
    title: "회의 내용 요약 + 하이라이트 부분만 반영",
    description: "회의 핵심과 가장 웃긴 장면만 뽑아 안정적인 버전으로 만듭니다.",
    icon: NotebookText,
  },
  {
    id: "logicalRoast",
    title: "월루를 논리적으로 저격하는 버전",
    description: "회의 맥락과 발언 근거를 바탕으로 후보를 재치 있게 짚습니다.",
    icon: Scale,
  },
  {
    id: "dinnerRecommend",
    title: "회사 앞날은 모르겠고 회의 기반 오늘 저메추",
    description: "회의 분위기를 음식 추천 밈으로 가볍게 바꿉니다.",
    icon: Utensils,
  },
];

type ActivityPlannerProps = {
  selectedActivities: WolluActivity[];
  onActivitiesChange: (activities: WolluActivity[]) => void;
};

export function ActivityPlanner({
  selectedActivities,
  onActivitiesChange,
}: ActivityPlannerProps) {
  const selectedActivity = selectedActivities[0] ?? "summaryHighlight";

  return (
    <section className="black-card p-6">
      <div className="mb-5">
        <div className="sticker px-3 py-1 text-sm">DIALOGUE MODE</div>
        <h2 className="mt-3 text-3xl font-black">대사 반영 방식</h2>
        <p className="mt-2 text-sm font-bold text-white/60">하나의 방식만 선택됩니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {dialogueOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedActivity === option.id;

          return (
            <button
              key={option.id}
              className={`min-h-32 border-2 p-4 text-left transition ${
                isSelected
                  ? "border-caution bg-caution text-black shadow-sticker"
                  : "border-white/70 bg-black/55 text-white hover:border-caution"
              }`}
              type="button"
              onClick={() => onActivitiesChange([option.id])}
            >
              <Icon className="mb-3 h-8 w-8" />
              <p className="text-lg font-black leading-tight">{option.title}</p>
              <p className={`mt-2 text-sm font-bold ${isSelected ? "text-black/70" : "text-white/60"}`}>
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
