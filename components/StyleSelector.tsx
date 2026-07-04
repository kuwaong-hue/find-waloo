"use client";

import { Music, Radio, Sparkles, Volume2 } from "lucide-react";
import type { MusicStyle } from "@/lib/types";

type StyleOption = {
  id: MusicStyle;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const styleOptions: StyleOption[] = [
  {
    id: "hiphop",
    title: "경고 힙합",
    description: "회의 좌초 멘트를 가장 찰지게 살림",
    icon: Radio,
  },
  {
    id: "rock",
    title: "퇴근 록",
    description: "퇴근길에 어울리는 강한 기타 리프",
    icon: Volume2,
  },
  {
    id: "trot",
    title: "월루 트로트",
    description: "팀장님도 흥얼거릴 후렴구",
    icon: Music,
  },
  {
    id: "edm",
    title: "회의실 EDM",
    description: "밈 쇼츠에 맞는 강한 드롭",
    icon: Sparkles,
  },
];

type StyleSelectorProps = {
  selectedStyle: MusicStyle;
  onStyleChange: (style: MusicStyle) => void;
};

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  return (
    <section className="black-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="sticker px-3 py-1 text-sm">MUSIC STYLE</div>
          <h2 className="mt-3 text-3xl font-black">음악 스타일 선택</h2>
        </div>
        <Music className="h-12 w-12 text-caution" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {styleOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedStyle === option.id;

          return (
            <button
              key={option.id}
              className={`min-h-28 border-2 p-4 text-left transition ${
                isSelected
                  ? "border-caution bg-caution text-black shadow-sticker"
                  : "border-white/70 bg-black/55 text-white hover:border-caution"
              }`}
              type="button"
              onClick={() => onStyleChange(option.id)}
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
