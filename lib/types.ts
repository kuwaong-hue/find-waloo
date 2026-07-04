export type MusicStyle = "hiphop" | "rock" | "trot" | "edm";

export type WolluActivity = "quoteRaw" | "summaryHighlight" | "logicalRoast" | "dinnerRecommend";

export type ActionItem = {
  owner: string;
  task: string;
  due: string;
};

export type TrollCandidate = {
  name: string;
  score: number;
  reason: string;
};

export type MockResult = {
  meetingTitle: string;
  generatedAt: string;
  duration: string;
  participants: string[];
  summary: string;
  agendas: string[];
  decisions: string[];
  actionItems: ActionItem[];
  trollHighlights: string[];
  offContextQuotes: string[];
  derailmentLines: string[];
  trollCandidates: TrollCandidate[];
  lyrics: {
    title: string;
    style: string;
    lines: string[];
  };
};

export type AnalyzeApiResponse = {
  result: MockResult;
  transcript: string;
};

export type MusicApiResponse = {
  audioBase64: string;
  audioMimeType: string;
};
