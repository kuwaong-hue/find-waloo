"use client";

import { Download, PlayCircle, RotateCcw, Search } from "lucide-react";
import type { MockResult } from "@/lib/types";
import { buildMinutesText, buildTrollText, downloadTextFile } from "@/lib/download";

type ResultActionsProps = {
  result: MockResult;
  isTrollMode: boolean;
  audioUrl: string;
  onToggleMode: () => void;
  onReset: () => void;
};

export function ResultActions({
  result,
  isTrollMode,
  audioUrl,
  onToggleMode,
  onReset,
}: ResultActionsProps) {
  const handleDownload = () => {
    const content = isTrollMode ? buildTrollText(result) : buildMinutesText(result);
    const filename = isTrollMode ? "wollu-troll-board.txt" : "ai-meeting-minutes.txt";
    downloadTextFile(filename, content);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          className="inline-flex h-14 items-center gap-2 border-2 border-white bg-caution px-5 font-black text-black shadow-sticker transition hover:-translate-y-1"
          type="button"
          onClick={onToggleMode}
        >
          <Search className="h-5 w-5" />
          {isTrollMode ? "회의록 화면 보기" : "숨겨진 색출 보드 열기"}
        </button>
        <button
          className="inline-flex h-14 items-center gap-2 border-2 border-white bg-black px-5 font-black text-white transition hover:border-caution hover:text-caution"
          type="button"
          onClick={handleDownload}
        >
          <Download className="h-5 w-5" />
          TXT 다운로드
        </button>
        {audioUrl ? (
          <a
            className="inline-flex h-14 items-center gap-2 border-2 border-white bg-black px-5 font-black text-white transition hover:border-caution hover:text-caution"
            href={audioUrl}
            rel="noreferrer"
            target="_blank"
          >
            <PlayCircle className="h-5 w-5" />
            생성 음성 듣기
          </a>
        ) : null}
      </div>

      <button
        className="inline-flex h-14 items-center gap-2 border-2 border-white/70 bg-black/60 px-5 font-black text-white/80 transition hover:border-white hover:text-white"
        type="button"
        onClick={onReset}
      >
        <RotateCcw className="h-5 w-5" />
        다시 분석
      </button>
    </div>
  );
}
