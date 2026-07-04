"use client";

type MeetingContextPanelProps = {
  participantCount: string;
  memberNames: string;
  meetingNotes: string;
  onParticipantCountChange: (value: string) => void;
  onMemberNamesChange: (value: string) => void;
  onMeetingNotesChange: (value: string) => void;
};

export function MeetingContextPanel({
  participantCount,
  memberNames,
  meetingNotes,
  onParticipantCountChange,
  onMemberNamesChange,
  onMeetingNotesChange,
}: MeetingContextPanelProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 text-slate-950 shadow-lg shadow-slate-200/60">
      <div className="mb-5">
        <p className="text-sm font-black text-amber-600">OPTIONAL CONTEXT</p>
        <h2 className="mt-1 text-3xl font-black">회의 참고 정보</h2>
        <p className="mt-2 text-sm font-bold text-slate-500">
          입력하지 않아도 분석할 수 있습니다. 넣으면 참석자와 맥락 추정이 더 안정적입니다.
        </p>
      </div>

      <div className="grid grid-cols-[0.36fr_0.64fr] gap-4">
        <label className="block">
          <span className="mb-2 block text-sm font-black text-slate-600">참석 인원 수</span>
          <input
            className="h-12 w-full rounded-md border border-slate-300 bg-slate-50 px-4 font-bold outline-none transition focus:border-amber-400 focus:bg-white"
            inputMode="numeric"
            min="1"
            placeholder="예: 7"
            type="number"
            value={participantCount}
            onChange={(event) => onParticipantCountChange(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-black text-slate-600">팀원 이름</span>
          <input
            className="h-12 w-full rounded-md border border-slate-300 bg-slate-50 px-4 font-bold outline-none transition focus:border-amber-400 focus:bg-white"
            placeholder="예: 민서, 지훈, 서연"
            type="text"
            value={memberNames}
            onChange={(event) => onMemberNamesChange(event.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-black text-slate-600">회의 참고 내용</span>
        <textarea
          className="min-h-32 w-full resize-none rounded-md border border-slate-300 bg-slate-50 p-4 font-bold leading-relaxed outline-none transition focus:border-amber-400 focus:bg-white"
          placeholder="예: 이번 회의는 7월 베타 오픈 준비 회의이고, 결제 QA와 온보딩 화면이 핵심입니다."
          value={meetingNotes}
          onChange={(event) => onMeetingNotesChange(event.target.value)}
        />
      </label>
    </section>
  );
}
