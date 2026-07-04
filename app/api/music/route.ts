import { NextResponse } from "next/server";
import type { MockResult, MusicStyle, WolluActivity } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const ELEVENLABS_MUSIC_URL = "https://api.elevenlabs.io/v1/music";

const stylePrompts: Record<MusicStyle, string> = {
  hiphop: "Korean comedy hip hop, bold bass, chant hook, playful office satire",
  rock: "Korean pop rock, energetic guitars, office escape anthem, catchy chorus",
  trot: "modern Korean trot, funny workplace lyrics, bright brass, sing-along chorus",
  edm: "Korean EDM, office meme energy, punchy drop, crowd chant hook",
};

const activityPrompts: Record<WolluActivity, string> = {
  commute: "made for listening on the commute home after work",
  afterwork: "made for a team after-work hangout before dinner",
  home: "made for relaxing at home while laughing about the meeting",
  shorts: "made for a short-form meme video with a memorable hook",
};

type MusicRequest = {
  result?: MockResult;
  style?: MusicStyle;
  activities?: WolluActivity[];
};

export async function POST(request: Request) {
  try {
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

    if (!elevenLabsKey) {
      return jsonError("ELEVENLABS_API_KEY가 .env.local에 없습니다.", 500);
    }

    const body = (await request.json()) as MusicRequest;

    if (!body.result) {
      return jsonError("음악을 만들 회의 분석 결과가 없습니다.", 400);
    }

    const style = normalizeStyle(body.style);
    const activities = normalizeActivities(body.activities);
    const prompt = buildMusicPrompt(body.result, style, activities);

    const response = await fetch(`${ELEVENLABS_MUSIC_URL}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": elevenLabsKey,
      },
      body: JSON.stringify({
        prompt,
        music_length_ms: 30000,
        model_id: process.env.ELEVENLABS_MUSIC_MODEL || "music_v1",
        force_instrumental: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return jsonError(errorText || "ElevenLabs 음악 생성 요청에 실패했습니다.", response.status);
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    return NextResponse.json({
      audioBase64: audioBuffer.toString("base64"),
      audioMimeType: response.headers.get("content-type") || "audio/mpeg",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 음악 생성 오류가 발생했습니다.";
    return jsonError(message, 500);
  }
}

function buildMusicPrompt(result: MockResult, style: MusicStyle, activities: WolluActivity[]) {
  const topCandidate = result.trollCandidates[0];
  const activityText = activities.map((activity) => activityPrompts[activity]).join(", ");
  const lyrics = result.lyrics.lines.join(" / ");

  return [
    stylePrompts[style],
    activityText,
    "Language: Korean.",
    "Mood: funny, energetic, meme-like, not offensive.",
    "Create a complete short song with vocals and instrumental backing.",
    `Meeting summary: ${result.summary}`,
    `Top office slacker candidate: ${topCandidate?.name ?? "unknown"} - ${
      topCandidate?.reason ?? "funny meeting drift"
    }`,
    `Use or adapt these Korean lyrics: ${lyrics}`,
  ].join("\n");
}

function normalizeStyle(value: unknown): MusicStyle {
  if (value === "rock" || value === "trot" || value === "edm" || value === "hiphop") {
    return value;
  }

  return "hiphop";
}

function normalizeActivities(value: unknown): WolluActivity[] {
  if (!Array.isArray(value)) {
    return ["commute"];
  }

  const activities = value.filter(
    (item): item is WolluActivity =>
      item === "commute" || item === "afterwork" || item === "home" || item === "shorts",
  );

  return activities.length > 0 ? activities : ["commute"];
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
