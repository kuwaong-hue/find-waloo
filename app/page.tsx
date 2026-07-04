"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  Music2,
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
  const [selectedActivities, setSelectedActivities] = useState<WolluActivity[]>([
    "summaryHighlight",
  ]);
  const [result, setResult] = useState<MockResult | null>(null);
  const [musicUrl, setMusicUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [musicError, setMusicError] = useState("");
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);

  const canAnalyze = useMemo(() => phase !== "loading", [phase]);
  const fileName = audioFile?.name ?? "";
  const isWolluMode = screenMode === "wollu";

  const handleFileChange = async (file: File | null) => {
    setAudioFile(null);
    setAudioDurationLabel("");
    setErrorMessage("");

    if (!file) {
      return;
    }

    if (file.size > MAX_AUDIO_FILE_BYTES) {
      setErrorMessage("배포 환경에서는 4MB 이하의 짧은 오디오 파일만 업로드할 수 있습니다.");
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

    if (!audioFile && meetingNotes.trim().length === 0) {
      setErrorMessage("회의 음성 파일을 올리거나, 회의 내용을 직접 입력해 주세요.");
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
      if (audioFile) {
        formData.append("file", audioFile);
      }
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
      const message = error instanceof Error ? error.message : "알 수 없는 분석 오류가 발생했습니다.";
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
                            자료를 넣고
                            <br />
                            회의록부터 확인하세요
                          </h2>
                          <p className="mt-5 max-w-2xl text-xl font-bold leading-relaxed text-slate-600">
                            음성 파일이 없으면 회의 내용을 텍스트로 넣어도 됩니다. 기본 화면은 업무용
                            회의록에 집중하고, 월루송 생성은 결과 화면에서 별도로 전환합니다.
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {["음성 또는 텍스트 입력", "회의록 요약", "월루송 모드 전환"].map(
                            (item, index) => (
                              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-4xl font-black text-blue-600">0{index + 1}</p>
                                <p className="mt-2 text-xl font-black text-slate-900">{item}</p>
                              </div>
                            ),
                          )}
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
                              회의록을 확인한 뒤 월루송 생성기로 이동할 수 있습니다.
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
                              월루송 생성기로 전환
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
                <section className="relative mb-6 overflow-hidden rounded-[10px] border-[3px] border-white bg-ink p-6 shadow-white">
                  <div className="absolute inset-0 bg-grit-noise opacity-80" />
                  <div className="relative z-10 grid grid-cols-[0.9fr_1.1fr] items-center gap-7">
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
                        겉으로는 회의록, 속으로는 하이라이트와 월루송
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-md border-2 border-white bg-black">
                      <Image
                        alt="월루 색출 완료 레이아웃"
                        className="h-auto w-full"
                        height={1024}
                        priority
                        src="/media/wollu-found.png"
                        width={1024}
                      />
                    </div>
                  </div>
                </section>

                <section className="paper-card mb-6 grid grid-cols-[1fr_0.34fr] gap-5 p-5">
                  <div className="overflow-hidden rounded-md border-2 border-neutral-300 bg-white">
                    <Image
                      alt="월루 분석 결과 패널"
                      className="h-auto w-full"
                      height={1024}
                      src="/media/wollu-result.png"
                      width={1024}
                    />
                  </div>

                  <button
                    className="group overflow-hidden rounded-lg border-[4px] border-black bg-neutral-900 text-left shadow-sticker transition hover:-translate-y-1"
                    type="button"
                    onClick={() => setScreenMode("minutes")}
                  >
                    <Image
                      alt="회의록 모드로 전환하기"
                      className="h-auto w-full"
                      height={1024}
                      src="/media/button-off.png"
                      width={1024}
                    />
                    <span className="flex items-center justify-center gap-2 bg-caution px-3 py-3 text-xl font-black text-black">
                      <ArrowLeft className="h-6 w-6" />
                      회의록으로 돌아가기
                    </span>
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
        <p className="text-3xl font-black text-slate-950">Find Waloo</p>
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
