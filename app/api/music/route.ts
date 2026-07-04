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
  quoteRaw:
    "Use the highlighted quote and nearby context as directly as possible while keeping it safe and playful.",
  summaryHighlight:
    "Use the meeting summary and only the strongest highlight moments for a clean, catchy song.",
  logicalRoast:
    "Make the lyrics feel like a witty evidence-based roast of the office slacker candidate, without harassment.",
  dinnerRecommend:
    "Turn the meeting mood into a funny Korean dinner recommendation song based on the meeting context.",
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
      return jsonError("ELEVENLABS_API_KEY가 설정되어 있지 않습니다.", 500);
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
  const activityText = activities.map((activity) => activityPrompts[activity]).join("\n");
  const lyrics = result.lyrics.lines.join(" / ");

  return [
    stylePrompts[style],
    "Language: Korean.",
    "Mood: funny, energetic, meme-like, not offensive.",
    "Create a complete short song with vocals and instrumental backing.",
    "Dialogue reflection rules:",
    activityText,
    `Meeting summary: ${result.summary}`,
    `Funny highlights: ${result.trollHighlights.join(" / ")}`,
    `Off-context quotes: ${result.offContextQuotes.join(" / ")}`,
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
    return ["summaryHighlight"];
  }

  const activities = value.filter(
    (item): item is WolluActivity =>
      item === "quoteRaw" ||
      item === "summaryHighlight" ||
      item === "logicalRoast" ||
      item === "dinnerRecommend",
  );

  return activities.length > 0 ? activities : ["summaryHighlight"];
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
