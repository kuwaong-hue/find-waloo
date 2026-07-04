"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Music2, Play, WandSparkles } from "lucide-react";
import { ActivityPlanner } from "@/components/ActivityPlanner";
import { StyleSelector } from "@/components/StyleSelector";
import type { MockResult, MusicStyle, WolluActivity } from "@/lib/types";
import { buildTrollText, downloadTextFile } from "@/lib/download";

type TrollMusicStudioProps = {
  result: MockResult;
  selectedStyle: MusicStyle;
  selectedActivities: WolluActivity[];
  musicUrl: string;
  isGeneratingMusic: boolean;
  musicError: string;
  onStyleChange: (style: MusicStyle) => void;
  onActivitiesChange: (activities: WolluActivity[]) => void;
  onGenerateMusic: () => void;
};

export function TrollMusicStudio({
  result,
  selectedStyle,
  selectedActivities,
  musicUrl,
  isGeneratingMusic,
  musicError,
  onStyleChange,
  onActivitiesChange,
  onGenerateMusic,
}: TrollMusicStudioProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [lyricStartOffset, setLyricStartOffset] = useState(6);
  const [lyricCoverage, setLyricCoverage] = useState(78);

  const lyricTimings = useMemo(() => {
    const lines = result.lyrics.lines.length > 0 ? result.lyrics.lines : ["가사를 생성하는 중입니다"];
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 30;
    const start = Math.min(lyricStartOffset, Math.max(0, safeDuration - 1));
    const usableDuration = Math.max(1, (safeDuration - start) * (lyricCoverage / 100));
    const segment = usableDuration / lines.length;

    return lines.map((line, index) => ({
      line,
      start: start + segment * index,
      end: start + segment * (index + 1),
    }));
  }, [duration, lyricCoverage, lyricStartOffset, result.lyrics.lines]);

  const activeLyricIndex = getActiveLyricIndex(lyricTimings, currentTime);

  const handleDownloadText = () => {
    downloadTextFile("wollu-troll-board.txt", buildTrollText(result));
  };

  return (
    <section className="grid grid-cols-[0.82fr_1.18fr] gap-6">
      <div className="space-y-5">
        <StyleSelector selectedStyle={selectedStyle} onStyleChange={onStyleChange} />
        <ActivityPlanner
          selectedActivities={selectedActivities}
          onActivitiesChange={onActivitiesChange}
        />

        <button
          className="flex h-20 w-full items-center justify-center gap-3 border-[3px] border-white bg-caution text-3xl font-black text-black shadow-white transition hover:-translate-y-1 disabled:cursor-wait disabled:opacity-70"
          disabled={isGeneratingMusic}
          type="button"
          onClick={onGenerateMusic}
        >
          <WandSparkles className="h-9 w-9" />
          {isGeneratingMusic ? "음악 생성 중" : "월루송 생성"}
        </button>

        {musicError ? (
          <div className="border-2 border-caution bg-black p-4 font-bold text-caution">
            {musicError}
          </div>
        ) : null}
      </div>

      <div className="black-card overflow-hidden p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="sticker px-4 py-2 text-sm">MUSIC GENERATOR</div>
            <h2 className="mt-4 text-4xl font-black white-pop">회의록으로 월루송 만들기</h2>
          </div>
          <Music2 className="h-14 w-14 text-caution" />
        </div>

        <div className="grid grid-cols-[0.9fr_1.1fr] gap-5">
          <div className="paper-card torn-edge p-5">
            <p className="text-sm font-black text-neutral-500">가사 제목</p>
            <h3 className="mt-2 text-3xl font-black">{result.lyrics.title}</h3>
            <div className="scribble-line my-5" />
            <div className="space-y-2 text-base font-extrabold leading-relaxed">
              {result.lyrics.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="rounded-md border-2 border-white bg-black/60 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-2xl font-black">
              <Play className="h-7 w-7 text-caution" />
              플레이어
            </h3>
            {musicUrl ? (
              <div className="space-y-4">
                <audio
                  className="w-full"
                  controls
                  src={musicUrl}
                  onDurationChange={(event) => setDuration(event.currentTarget.duration || 30)}
                  onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                >
                  <track kind="captions" />
                </audio>

                <div className="rounded-md border border-caution/70 bg-black p-4">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="text-sm font-black text-caution">실시간 가사</p>
                    <p className="text-xs font-bold text-white/50">
                      현재 {formatTime(currentTime)} / 시작 {lyricStartOffset.toFixed(1)}초
                    </p>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-2 block text-xs font-black text-white/60">
                        가사 시작 시간
                      </span>
                      <input
                        className="w-full accent-yellow-300"
                        max="18"
                        min="0"
                        step="0.5"
                        type="range"
                        value={lyricStartOffset}
                        onChange={(event) => setLyricStartOffset(Number(event.target.value))}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-black text-white/60">
                        가사 진행 속도
                      </span>
                      <input
                        className="w-full accent-yellow-300"
                        max="100"
                        min="45"
                        step="1"
                        type="range"
                        value={lyricCoverage}
                        onChange={(event) => setLyricCoverage(Number(event.target.value))}
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    {lyricTimings.map((timing, index) => (
                      <p
                        key={`${timing.line}-${index}`}
                        className={`rounded px-3 py-2 text-lg font-black transition ${
                          index === activeLyricIndex
                            ? "bg-caution text-black"
                            : "text-white/45"
                        }`}
                      >
                        {formatTime(timing.start)} · {timing.line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    className="inline-flex h-12 items-center gap-2 border-2 border-white bg-caution px-4 font-black text-black"
                    download="wollu-song.mp3"
                    href={musicUrl}
                  >
                    <Download className="h-5 w-5" />
                    MP3 다운로드
                  </a>
                  <button
                    className="inline-flex h-12 items-center gap-2 border-2 border-white bg-black px-4 font-black text-white"
                    type="button"
                    onClick={handleDownloadText}
                  >
                    <FileText className="h-5 w-5" />
                    분석 TXT
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-72 items-center justify-center border-2 border-dashed border-white/60 bg-black/45 text-center font-black text-white/65">
                <div>
                  <Play className="mx-auto mb-3 h-12 w-12 text-caution" />
                  월루송 생성 후 플레이 바와 싱크 가사가 표시됩니다
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type LyricTiming = {
  line: string;
  start: number;
  end: number;
};

function getActiveLyricIndex(timings: LyricTiming[], currentTime: number) {
  if (timings.length === 0) {
    return 0;
  }

  const activeIndex = timings.findIndex(
    (timing) => currentTime >= timing.start && currentTime < timing.end,
  );

  if (activeIndex >= 0) {
    return activeIndex;
  }

  if (currentTime < timings[0].start) {
    return 0;
  }

  return timings.length - 1;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}
