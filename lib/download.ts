import type { MockResult } from "./types";

export function buildMinutesText(result: MockResult): string {
  const actionItems = result.actionItems
    .map((item) => `- ${item.owner}: ${item.task} (${item.due})`)
    .join("\n");

  return [
    `[AI 회의록] ${result.meetingTitle}`,
    `생성 시간: ${result.generatedAt}`,
    `회의 길이: ${result.duration}`,
    `참석자: ${result.participants.join(", ")}`,
    "",
    "요약",
    result.summary,
    "",
    "주요 안건",
    result.agendas.map((agenda) => `- ${agenda}`).join("\n"),
    "",
    "결정사항",
    result.decisions.map((decision) => `- ${decision}`).join("\n"),
    "",
    "액션 아이템",
    actionItems,
  ].join("\n");
}

export function buildTrollText(result: MockResult): string {
  return [
    `[월루를 찾아라] ${result.meetingTitle}`,
    "",
    "웃긴 하이라이트",
    result.trollHighlights.map((item) => `- ${item}`).join("\n"),
    "",
    "맥락 이탈 발언",
    result.offContextQuotes.map((item) => `- ${item}`).join("\n"),
    "",
    "회의 좌초 멘트",
    result.derailmentLines.map((item) => `- ${item}`).join("\n"),
    "",
    "오늘의 월루 후보",
    result.trollCandidates
      .map((candidate) => `- ${candidate.name} (${candidate.score}점): ${candidate.reason}`)
      .join("\n"),
    "",
    `${result.lyrics.title} / ${result.lyrics.style}`,
    result.lyrics.lines.join("\n"),
  ].join("\n");
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
