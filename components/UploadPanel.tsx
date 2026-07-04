"use client";

import { FileAudio, UploadCloud } from "lucide-react";

type UploadPanelProps = {
  fileName: string;
  audioDurationLabel: string;
  onFileChange: (file: File | null) => void;
};

export function UploadPanel({ fileName, audioDurationLabel, onFileChange }: UploadPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 text-slate-950 shadow-lg shadow-slate-200/60">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-amber-600">STEP 1</p>
          <h2 className="mt-1 text-3xl font-black">회의 음성 업로드</h2>
          <p className="mt-2 text-sm font-bold text-slate-500">
            10분 이하, 25MB 이하 오디오 파일만 업로드할 수 있습니다.
          </p>
        </div>
        <UploadCloud className="h-11 w-11 text-amber-500" />
      </div>

      <label className="group flex h-56 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-amber-400 hover:bg-amber-50">
        <input
          accept="audio/*"
          className="sr-only"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            onFileChange(file ?? null);
            event.target.value = "";
          }}
        />
        <FileAudio className="mb-4 h-16 w-16 text-amber-500 transition group-hover:scale-110" />
        <p className="text-2xl font-black text-slate-950">
          {fileName || "파일을 드래그 앤 드롭하거나 클릭하세요"}
        </p>
        <p className="mt-2 text-sm font-bold text-slate-500">
          mp3 / wav / m4a / webm 지원, 최대 25MB
        </p>
        {audioDurationLabel ? (
          <p className="mt-3 rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-700">
            길이 확인됨: {audioDurationLabel}
          </p>
        ) : null}
      </label>
    </section>
  );
}
