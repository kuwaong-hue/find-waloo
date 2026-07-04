"use client";

import { motion } from "framer-motion";
import { FileText, Search, TriangleAlert, Waves } from "lucide-react";

const steps = [
  { label: "음성 파형 스캔", icon: Waves },
  { label: "회의록 요약 생성", icon: FileText },
  { label: "수상한 발언 탐지", icon: Search },
  { label: "월루 후보 압축", icon: TriangleAlert },
];

export function AnalysisProgress() {
  return (
    <section className="black-card halftone p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="sticker px-4 py-2 text-sm">ANALYZING</div>
          <h2 className="mt-4 text-4xl font-black white-pop">회의를 분석하는 중</h2>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          className="flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-caution text-caution"
          transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
        >
          <Search className="h-10 w-10" />
        </motion.div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.label}
              animate={{ y: [0, -8, 0] }}
              className="border-2 border-white bg-black/70 p-5 text-center"
              transition={{ delay: index * 0.16, duration: 1.1, repeat: Infinity }}
            >
              <Icon className="mx-auto mb-3 h-10 w-10 text-caution" />
              <p className="text-lg font-black">{step.label}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
