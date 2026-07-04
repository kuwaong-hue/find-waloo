"use client";

import { Home, Martini, TrainFront, Video } from "lucide-react";
import type { WolluActivity } from "@/lib/types";

type ActivityOption = {
  id: WolluActivity;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const activityOptions: ActivityOption[] = [
  {
    id: "commute",
    title: "퇴근길 플레이리스트",
    description: "지하철/버스에서 듣는 30초 월루송",
    icon: TrainFront,
  },
  {
    id: "afterwork",
    title: "회식 전 예열곡",
    description: "팀원들에게 공유하기 좋은 흥얼흥얼 버전",
    icon: Martini,
  },
  {
    id: "home",
    title: "집에서 복기",
    description: "회의를 떠올리며 혼자 웃는 홈 리스닝",
    icon: Home,
  },
  {
    id: "shorts",
    title: "밈 쇼츠 배경음",
    description: "짧고 강한 후렴을 우선하는 숏폼 버전",
    icon: Video,
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
  const toggleActivity = (activity: WolluActivity) => {
    if (selectedActivities.includes(activity)) {
      const next = selectedActivities.filter((item) => item !== activity);
      onActivitiesChange(next.length > 0 ? next : ["commute"]);
      return;
    }

    onActivitiesChange([...selectedActivities, activity]);
  };

  return (
    <section className="black-card p-6">
      <div className="mb-5">
        <div className="sticker px-3 py-1 text-sm">ACTIVITY</div>
        <h2 className="mt-3 text-3xl font-black">관련 활동 지정</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {activityOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedActivities.includes(option.id);

          return (
            <button
              key={option.id}
              className={`min-h-32 border-2 p-4 text-left transition ${
                isSelected
                  ? "border-caution bg-caution text-black shadow-sticker"
                  : "border-white/70 bg-black/55 text-white hover:border-caution"
              }`}
              type="button"
              onClick={() => toggleActivity(option.id)}
            >
              <Icon className="mb-3 h-8 w-8" />
              <p className="text-xl font-black">{option.title}</p>
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
