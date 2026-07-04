"use client";

import { FileAudio, UploadCloud } from "lucide-react";

type UploadPanelProps = {
  fileName: string;
  audioDurationLabel: string;
  onFileChange: (file: File | null) => void;
};

export function UploadPanel({ fileName, audioDurationLabel, onFileChange }: UploadPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-lg shadow-slate-200/60">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-blue-600">STEP 1</p>
          <h2 className="mt-1 text-3xl font-black">회의 음성 업로드</h2>
          <p className="mt-2 text-sm font-bold text-slate-500">
            선택 사항입니다. 배포 환경에서는 10분 이하, 4MB 이하 파일을 권장합니다.
          </p>
        </div>
        <UploadCloud className="h-11 w-11 text-blue-600" />
      </div>

      <label className="group flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
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
        <FileAudio className="mb-4 h-14 w-14 text-blue-600 transition group-hover:scale-110" />
        <p className="text-xl font-black text-slate-950">
          {fileName || "파일을 드래그하거나 클릭해서 업로드"}
        </p>
        <p className="mt-2 text-sm font-bold text-slate-500">
          mp3 / wav / m4a / webm, 최대 4MB
        </p>
        {audioDurationLabel ? (
          <p className="mt-3 rounded-full bg-blue-100 px-4 py-2 text-sm font-black text-blue-700">
            길이 확인됨: {audioDurationLabel}
          </p>
        ) : null}
      </label>
    </section>
  );
}
