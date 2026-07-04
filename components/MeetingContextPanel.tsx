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
    <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-950 shadow-lg shadow-slate-200/60">
      <div className="mb-5">
        <p className="text-sm font-black text-blue-600">STEP 2</p>
        <h2 className="mt-1 text-3xl font-black">회의 참고 정보</h2>
        <p className="mt-2 text-sm font-bold text-slate-500">
          음성 파일이 없어도 아래에 회의 내용을 붙여 넣으면 회의록과 월루송 재료를 만들 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-[0.36fr_0.64fr] gap-4">
        <label className="block">
          <span className="mb-2 block text-sm font-black text-slate-600">참석 인원 수</span>
          <input
            className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 font-bold outline-none transition focus:border-blue-500 focus:bg-white"
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
            className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 font-bold outline-none transition focus:border-blue-500 focus:bg-white"
            placeholder="예: 민서, 지훈, 서연"
            type="text"
            value={memberNames}
            onChange={(event) => onMemberNamesChange(event.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-black text-slate-600">
          회의 내용 직접 입력
        </span>
        <textarea
          className="min-h-40 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 p-4 font-bold leading-relaxed outline-none transition focus:border-blue-500 focus:bg-white"
          placeholder="음성 없이 테스트할 때는 여기에 회의 메모나 대화 내용을 넣어주세요. 예: 오늘 회의에서는 베타 출시 일정, 결제 QA, 온보딩 화면 개선을 논의했습니다..."
          value={meetingNotes}
          onChange={(event) => onMeetingNotesChange(event.target.value)}
        />
      </label>
    </section>
  );
}
