import { NextResponse } from "next/server";
import type { MockResult, MusicStyle } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const OPENAI_TRANSCRIPTIONS_URL = "https://api.openai.com/v1/audio/transcriptions";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const MAX_AUDIO_FILE_BYTES = 25 * 1024 * 1024;

const styleLabels: Record<MusicStyle, string> = {
  hiphop: "옐로우 경고 힙합",
  rock: "퇴근 록",
  trot: "월루 트로트",
  edm: "회의실 EDM",
};

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "meetingTitle",
    "generatedAt",
    "duration",
    "participants",
    "summary",
    "agendas",
    "decisions",
    "actionItems",
    "trollHighlights",
    "offContextQuotes",
    "derailmentLines",
    "trollCandidates",
    "lyrics",
  ],
  properties: {
    meetingTitle: { type: "string" },
    generatedAt: { type: "string" },
    duration: { type: "string" },
    participants: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
    agendas: { type: "array", items: { type: "string" } },
    decisions: { type: "array", items: { type: "string" } },
    actionItems: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["owner", "task", "due"],
        properties: {
          owner: { type: "string" },
          task: { type: "string" },
          due: { type: "string" },
        },
      },
    },
    trollHighlights: { type: "array", items: { type: "string" } },
    offContextQuotes: { type: "array", items: { type: "string" } },
    derailmentLines: { type: "array", items: { type: "string" } },
    trollCandidates: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "score", "reason"],
        properties: {
          name: { type: "string" },
          score: { type: "number" },
          reason: { type: "string" },
        },
      },
    },
    lyrics: {
      type: "object",
      additionalProperties: false,
      required: ["title", "style", "lines"],
      properties: {
        title: { type: "string" },
        style: { type: "string" },
        lines: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;

type OpenAITranscriptionResponse = {
  text?: string;
  error?: {
    message?: string;
  };
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  try {
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!openAiKey) {
      return jsonError("OPENAI_API_KEY가 .env.local에 없습니다.", 500);
    }

    const formData = await request.formData();
    const audioFile = formData.get("file");
    const style = normalizeStyle(formData.get("style"));
    const participantCount = stringValue(formData.get("participantCount"));
    const memberNames = stringValue(formData.get("memberNames"));
    const meetingNotes = stringValue(formData.get("meetingNotes"));

    if (!(audioFile instanceof File)) {
      return jsonError("회의 음성 파일을 먼저 업로드해 주세요.", 400);
    }

    if (audioFile.size > MAX_AUDIO_FILE_BYTES) {
      return jsonError("오디오 파일은 25MB 이하만 업로드할 수 있습니다.", 400);
    }

    const transcript = await transcribeAudio(audioFile, openAiKey);
    const result = await analyzeTranscript(
      transcript,
      style,
      openAiKey,
      participantCount,
      memberNames,
      meetingNotes,
    );

    return NextResponse.json({ result, transcript });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 분석 오류가 발생했습니다.";
    return jsonError(message, 500);
  }
}

async function transcribeAudio(audioFile: File, apiKey: string): Promise<string> {
  const transcriptionForm = new FormData();
  transcriptionForm.append("file", audioFile, audioFile.name || "meeting-audio.webm");
  transcriptionForm.append(
    "model",
    process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe",
  );
  transcriptionForm.append("language", "ko");
  transcriptionForm.append("response_format", "json");

  const response = await fetch(OPENAI_TRANSCRIPTIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: transcriptionForm,
  });

  const data = (await response.json()) as OpenAITranscriptionResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI 음성 전사 요청에 실패했습니다.");
  }

  if (!data.text) {
    throw new Error("OpenAI 전사 결과에 text가 없습니다.");
  }

  return data.text;
}

async function analyzeTranscript(
  transcript: string,
  style: MusicStyle,
  apiKey: string,
  participantCount: string,
  memberNames: string,
  meetingNotes: string,
): Promise<MockResult> {
  const now = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date());

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "너는 한국어 회의록 작성자이자 예능식 회의 하이라이트 분석가다. 결과는 반드시 JSON schema에 맞춰 한국어로만 작성한다. 실제 인물 모욕이나 혐오 표현 없이, 가벼운 밈 톤으로 회의 흐름을 분석한다.",
        },
        {
          role: "user",
          content: [
            `생성 시각: ${now}`,
            `월루 모드에서 사용할 음악 스타일: ${styleLabels[style]}`,
            participantCount ? `사용자가 입력한 참석 인원 수: ${participantCount}` : "사용자가 참석 인원 수를 입력하지 않음",
            memberNames ? `사용자가 입력한 팀원 이름: ${memberNames}` : "사용자가 팀원 이름을 입력하지 않음",
            meetingNotes ? `사용자가 입력한 회의 참고 내용: ${meetingNotes}` : "사용자가 회의 참고 내용을 입력하지 않음",
            "아래 전사 텍스트를 바탕으로 정상 회의록과 숨겨진 월루 색출 보드 데이터를 동시에 생성해줘.",
            "사용자가 입력한 인원 수, 이름, 참고 내용이 있으면 우선 반영해줘.",
            "참석자 이름이 명확하지 않으면 '참석자 A'처럼 안전하게 추정해줘.",
            "trollCandidates score는 0~100 사이 숫자로 작성해줘.",
            "lyrics.lines는 5~8줄의 짧은 노래 가사로 작성해줘.",
            "",
            "전사 텍스트:",
            transcript,
          ].join("\n"),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "meeting_troll_analysis",
          strict: true,
          schema: analysisSchema,
        },
      },
    }),
  });

  const data = (await response.json()) as OpenAIResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || "OpenAI 회의 분석 요청에 실패했습니다.");
  }

  const rawText = getResponseText(data);

  if (!rawText) {
    throw new Error("OpenAI 분석 결과 텍스트를 찾지 못했습니다.");
  }

  return JSON.parse(rawText) as MockResult;
}

function getResponseText(data: OpenAIResponse): string {
  if (data.output_text) {
    return data.output_text;
  }

  return (
    data.output
      ?.flatMap((item) => item.content ?? [])
      .find((content) => content.type === "output_text" && content.text)?.text ?? ""
  );
}

function normalizeStyle(value: FormDataEntryValue | null): MusicStyle {
  if (value === "rock" || value === "trot" || value === "edm" || value === "hiphop") {
    return value;
  }

  return "hiphop";
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
