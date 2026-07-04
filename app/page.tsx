"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Crown,
  FileText,
  Mic,
  Music2,
  Play,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { HeroIntro } from "@/components/HeroIntro";
import { LoadingVideoCard } from "@/components/LoadingVideoCard";
import { MeetingContextPanel } from "@/components/MeetingContextPanel";
import { MinutesView } from "@/components/MinutesView";
import { TrollMusicStudio } from "@/components/TrollMusicStudio";
import { TrollView } from "@/components/TrollView";
import { UploadPanel } from "@/components/UploadPanel";
import type {
  AnalyzeApiResponse,
  MockResult,
  MusicApiResponse,
  MusicStyle,
  WolluActivity,
} from "@/lib/types";

type Phase = "idle" | "loading" | "done";
type ScreenMode = "minutes" | "wollu";

const MAX_AUDIO_DURATION_SECONDS = 10 * 60;
const MAX_AUDIO_FILE_BYTES = 4 * 1024 * 1024;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [screenMode, setScreenMode] = useState<ScreenMode>("minutes");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDurationLabel, setAudioDurationLabel] = useState("");
  const [participantCount, setParticipantCount] = useState("");
  const [memberNames, setMemberNames] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<MusicStyle>("hiphop");
  const [selectedActivities, setSelectedActivities] = useState<WolluActivity[]>(["commute"]);
  const [result, setResult] = useState<MockResult | null>(null);
  const [musicUrl, setMusicUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [musicError, setMusicError] = useState("");
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);

  const canAnalyze = useMemo(() => phase !== "loading", [phase]);
  const fileName = audioFile?.name ?? "";
  const isWolluMode = screenMode === "wollu";

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "t" && result) {
        event.preventDefault();
        setScreenMode((current) => (current === "minutes" ? "wollu" : "minutes"));
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [result]);

  useEffect(() => {
    return () => {
      if (musicUrl) {
        URL.revokeObjectURL(musicUrl);
      }
    };
  }, [musicUrl]);

  const handleFileChange = async (file: File | null) => {
    setAudioFile(null);
    setAudioDurationLabel("");
    setErrorMessage("");

    if (!file) {
      return;
    }

    if (file.size > MAX_AUDIO_FILE_BYTES) {
      setErrorMessage("Vercel 배포 환경에서는 오디오 파일을 4MB 이하로 업로드해 주세요.");
      return;
    }

    try {
      const duration = await readAudioDuration(file);

      if (duration > MAX_AUDIO_DURATION_SECONDS) {
        setErrorMessage(
          `오디오 길이는 10분 이하만 가능합니다. 선택한 파일은 ${formatDuration(duration)}입니다.`,
        );
        return;
      }

      setAudioFile(file);
      setAudioDurationLabel(formatDuration(duration));
    } catch {
      setErrorMessage("오디오 길이를 확인하지 못했습니다. 다른 mp3/wav/m4a 파일로 시도해 주세요.");
    }
  };

  const handleAnalyze = async () => {
    if (!canAnalyze) {
      return;
    }

    if (!audioFile) {
      setErrorMessage("먼저 10분 이하의 회의 음성 파일을 업로드해 주세요.");
      return;
    }

    setPhase("loading");
    setScreenMode("minutes");
    setResult(null);
    setMusicUrl("");
    setErrorMessage("");
    setMusicError("");

    try {
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("style", selectedStyle);
      formData.append("participantCount", participantCount);
      formData.append("memberNames", memberNames);
      formData.append("meetingNotes", meetingNotes);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const payload = await readApiResponse<AnalyzeApiResponse>(response);

      if (!response.ok) {
        throw new Error(payload.error || "분석 요청에 실패했습니다.");
      }

      setResult(payload.result);
      setPhase("done");
    } catch (error) {
      const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      setErrorMessage(message);
      setPhase("idle");
    }
  };

  const handleGenerateMusic = async () => {
    if (!result) {
      return;
    }

    setIsGeneratingMusic(true);
    setMusicError("");

    try {
      const response = await fetch("/api/music", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          result,
          style: selectedStyle,
          activities: selectedActivities,
        }),
      });

      const payload = await readApiResponse<MusicApiResponse>(response);

      if (!response.ok) {
        throw new Error(payload.error || "음악 생성 요청에 실패했습니다.");
      }

      if (musicUrl) {
        URL.revokeObjectURL(musicUrl);
      }

      const audioBlob = base64ToBlob(payload.audioBase64, payload.audioMimeType);
      setMusicUrl(URL.createObjectURL(audioBlob));
    } catch (error) {
      const message = error instanceof Error ? error.message : "알 수 없는 음악 생성 오류가 발생했습니다.";
      setMusicError(message);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setScreenMode("minutes");
    setResult(null);
    setMusicUrl("");
    setErrorMessage("");
    setMusicError("");
  };

  return (
    <main
      className={
        isWolluMode
          ? "min-h-screen overflow-hidden bg-grit-noise px-8 py-7 text-white"
          : "min-h-screen overflow-hidden bg-[#f7faff] px-8 py-7 text-slate-950"
      }
    >
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1560px] flex-col gap-6">
        <AnimatePresence mode="wait">
          {!isWolluMode ? (
            <motion.div
              key="minutes-screen"
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              exit={{ opacity: 0, rotateY: -8, y: 16 }}
              initial={{ opacity: 0, rotateY: 8, y: 16 }}
              transition={{ duration: 0.38 }}
            >
              <MinutesHeader />
              <HeroIntro />

              <section className="mt-6 grid grid-cols-[0.74fr_1.26fr] gap-6">
                <div className="space-y-5">
                  <UploadPanel
                    audioDurationLabel={audioDurationLabel}
                    fileName={fileName}
                    onFileChange={handleFileChange}
                  />
                  <MeetingContextPanel
                    meetingNotes={meetingNotes}
                    memberNames={memberNames}
                    participantCount={participantCount}
                    onMeetingNotesChange={setMeetingNotes}
                    onMemberNamesChange={setMemberNames}
                    onParticipantCountChange={setParticipantCount}
                  />

                  {errorMessage ? (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">
                      <TriangleAlert className="mt-1 h-6 w-6 flex-none" />
                      <p>{errorMessage}</p>
                    </div>
                  ) : null}

                  <button
                    className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-blue-600 px-6 text-2xl font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 disabled:cursor-wait disabled:opacity-70"
                    disabled={!canAnalyze}
                    type="button"
                    onClick={handleAnalyze}
                  >
                    <Sparkles className="h-7 w-7" />
                    회의록 생성하기
                  </button>
                </div>

                <div className="min-h-[650px]">
                  <AnimatePresence mode="wait">
                    {phase === "idle" && (
                      <motion.section
                        key="idle"
                        animate={{ opacity: 1, y: 0 }}
                        className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70"
                        exit={{ opacity: 0, y: 12 }}
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div>
                          <p className="text-sm font-black text-blue-600">READY</p>
                          <h2 className="mt-4 text-5xl font-black leading-tight text-slate-950">
                            회의 내용을 정리하고,
                            <br />
                            핵심만 빠르게 확인하세요
                          </h2>
                          <p className="mt-5 max-w-2xl text-xl font-bold leading-relaxed text-slate-600">
                            음성 파일과 선택 참고 정보를 바탕으로 요약, 결정사항, 회의 주제,
                            다음 액션을 한 화면에 정리합니다.
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {["회의 음성 업로드", "사용자 지정", "회의록 생성"].map((item, index) => (
                            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="text-4xl font-black text-blue-600">0{index + 1}</p>
                              <p className="mt-2 text-xl font-black text-slate-900">{item}</p>
                            </div>
                          ))}
                        </div>
                      </motion.section>
                    )}

                    {phase === "loading" && (
                      <motion.div
                        key="loading"
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        initial={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                      >
                        <LoadingVideoCard mode="minutes" />
                      </motion.div>
                    )}

                    {phase === "done" && result && (
                      <motion.section
                        key="minutes-result"
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5"
                        exit={{ opacity: 0, y: 14 }}
                        initial={{ opacity: 0, y: 14 }}
                        transition={{ duration: 0.32 }}
                      >
                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/60">
                          <div>
                            <p className="text-sm font-black text-blue-600">회의록 생성 완료</p>
                            <p className="mt-1 font-bold text-slate-700">
                              Ctrl + Shift + T 로도 월루 모드 전환 가능
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 font-black text-slate-800"
                              type="button"
                              onClick={handleReset}
                            >
                              다시 분석
                            </button>
                            <button
                              className="inline-flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-5 font-black text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5"
                              type="button"
                              onClick={() => setScreenMode("wollu")}
                            >
                              <Music2 className="h-5 w-5" />
                              메모장의 핵심 요약 확인하기
                            </button>
                          </div>
                        </div>

                        <MinutesView result={result} />
                      </motion.section>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </motion.div>
          ) : (
            result && (
              <motion.div
                key="wollu-screen"
                animate={{ opacity: 1, rotateY: 0, y: 0 }}
                exit={{ opacity: 0, rotateY: 8, y: 16 }}
                initial={{ opacity: 0, rotateY: -8, y: 16 }}
                transition={{ duration: 0.38 }}
              >
                <section className="relative mb-6 overflow-hidden rounded-[10px] border-[3px] border-white bg-ink p-8 shadow-white">
                  <div className="absolute -left-16 -top-20 h-56 w-72 rotate-[-18deg] bg-caution" />
                  <div className="absolute inset-0 bg-grit-noise opacity-80" />
                  <div className="relative z-10 grid grid-cols-[1fr_0.58fr] gap-8">
                    <div>
                      <div className="sticker px-5 py-2 text-lg">MVP DEMO</div>
                      <h1 className="graffiti-title mt-5 text-7xl leading-none">
                        월루를
                        <br />
                        찾아라
                      </h1>
                      <p className="mt-4 text-2xl font-black white-pop">
                        회의록의 척하는 트롤 색출 음악 생성기
                      </p>
                      <div className="sticker mt-5 px-5 py-2 text-lg">
                        겉으로는 AI 회의록 · 속으로는 트롤 색출 & 음악 생성
                      </div>
                    </div>

                    <div className="paper-card torn-edge flex min-h-48 items-center justify-center p-6">
                      <div className="text-center">
                        <Crown className="mx-auto mb-4 h-14 w-14" />
                        <ShieldAlert className="mx-auto mb-2 h-20 w-20" />
                        <p className="text-xl font-black">오늘의 월루 감지 완료</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="paper-card mb-6 grid grid-cols-[1fr_0.42fr] gap-5 p-5">
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                        <Mic className="h-8 w-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black">회의 음성 분석 결과</h2>
                        <p className="font-bold text-neutral-500">
                          10분 이내 음성 파일 기반 · {result.meetingTitle}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-md border-2 border-dashed border-neutral-400 bg-white p-8 text-center font-black">
                      파일 분석 완료 · 숨겨진 후보와 음악 재료를 추출했습니다
                    </div>
                  </div>

                  <button
                    className="flex min-h-44 flex-col items-center justify-center rounded-lg border-[5px] border-black bg-neutral-900 p-5 text-center text-white shadow-sticker"
                    type="button"
                    onClick={() => setScreenMode("minutes")}
                  >
                    <span className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-black bg-caution text-black shadow-sticker">
                      <ArrowLeft className="h-10 w-10" />
                    </span>
                    <span className="text-3xl font-black white-pop">회의록 모드로</span>
                    <span className="text-4xl font-black text-caution">전환하기</span>
                  </button>
                </section>

                <div className="space-y-6">
                  <TrollView result={result} />
                  {isGeneratingMusic ? (
                    <LoadingVideoCard mode="wollu" />
                  ) : (
                    <TrollMusicStudio
                      isGeneratingMusic={isGeneratingMusic}
                      musicError={musicError}
                      musicUrl={musicUrl}
                      result={result}
                      selectedActivities={selectedActivities}
                      selectedStyle={selectedStyle}
                      onActivitiesChange={setSelectedActivities}
                      onGenerateMusic={handleGenerateMusic}
                      onStyleChange={setSelectedStyle}
                    />
                  )}
                  {!isGeneratingMusic && musicError ? (
                    <div className="border-2 border-caution bg-black p-4 font-bold text-caution">
                      {musicError}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function MinutesHeader() {
  return (
    <header className="mb-8 flex items-center justify-between border-b border-slate-200 bg-white/70 px-1 pb-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="text-5xl font-black text-blue-600">W</div>
        <div>
          <p className="text-3xl font-black text-slate-950">Find Waloo</p>
        </div>
      </div>
      <nav className="flex gap-4">
        <HeaderButton icon={Sparkles} label="AI 요약" active />
        <HeaderButton icon={FileText} label="회의 기록" />
        <HeaderButton icon={BriefcaseBusiness} label="실무 지원" />
      </nav>
    </header>
  );
}

function HeaderButton({
  icon: Icon,
  label,
  active = false,
}: {
  icon: typeof Sparkles;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`inline-flex h-14 items-center gap-2 rounded-2xl border px-6 text-lg font-black ${
        active
          ? "border-blue-200 bg-white text-blue-600 shadow-sm"
          : "border-slate-200 bg-white text-slate-600"
      }`}
      type="button"
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

function readAudioDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const audio = document.createElement("audio");
    const objectUrl = URL.createObjectURL(file);

    audio.preload = "metadata";
    audio.src = objectUrl;
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(audio.duration);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Cannot read audio metadata"));
    };
  });
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = Array.from(byteCharacters, (character) => character.charCodeAt(0));
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
}

async function readApiResponse<T>(response: Response): Promise<T & { error?: string }> {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (contentType.includes("application/json")) {
    return JSON.parse(rawText) as T & { error?: string };
  }

  if (rawText.includes("Request Entity Too Large")) {
    return {
      error: "업로드 파일이 서버 제한보다 큽니다. 4MB 이하의 짧은 mp3/wav 파일로 다시 시도해 주세요.",
    } as T & { error?: string };
  }

  return {
    error: rawText || `서버가 JSON이 아닌 응답을 반환했습니다. HTTP ${response.status}`,
  } as T & { error?: string };
}
