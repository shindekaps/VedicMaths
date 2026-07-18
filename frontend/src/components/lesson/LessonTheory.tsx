import React from 'react';
import { motion } from 'framer-motion';
import { type Lesson } from '../../api/lessons';

interface LessonTheoryProps {
  lesson: Lesson;
  onNext: () => void;
}

const renderContent = (content: string) => {
  const isHtml = content.trim().startsWith('<') || content.includes('</');

  if (isHtml) {
    return (
      <div 
        className="space-y-4 text-left leading-relaxed text-slate-800 theory-html-content"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    );
  }

  // Fallback: legacy line-by-line markdown parser (slightly enhanced)
  const lines = content.split('\n');
  return (
    <div className="space-y-4 text-left leading-relaxed text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Process simple bold & italics: **text** -> <strong>text</strong>, *text* -> <em>text</em>
        const processInlineStyles = (txt: string) => {
          let formatted = txt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
          return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
        };

        if (trimmed.startsWith('##')) {
          return (
            <h3 key={idx} className="text-base font-black text-violet mt-5 mb-2 border-b border-violet-100 pb-1.5">
              {processInlineStyles(trimmed.replace(/^#+\s*/, ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('#')) {
          return (
            <h2 key={idx} className="text-lg font-black text-ink mt-6 mb-3">
              {processInlineStyles(trimmed.replace(/^#+\s*/, ''))}
            </h2>
          );
        }
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          return (
            <div key={idx} className="flex gap-3 items-start my-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet mt-2 flex-shrink-0" />
              <span className="font-extrabold text-sm text-slate-700">
                {processInlineStyles(trimmed.substring(1).trim())}
              </span>
            </div>
          );
        }
        if (/^\d+\./.test(trimmed)) {
          const dotIdx = trimmed.indexOf('.');
          const num = trimmed.substring(0, dotIdx);
          const rest = trimmed.substring(dotIdx + 1).trim();
          return (
            <div key={idx} className="flex gap-3 items-start my-2">
              <span className="font-black text-violet text-sm">{num}.</span>
              <span className="font-extrabold text-sm text-slate-700">{processInlineStyles(rest)}</span>
            </div>
          );
        }
        if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
          return (
            <div key={idx} className="bg-violet-50/50 border border-violet-100 p-4 rounded-2xl font-mono text-center text-lg text-violet font-black my-4">
              {trimmed.replace(/`/g, '')}
            </div>
          );
        }
        return (
          <p key={idx} className="text-sm text-slate-700 font-extrabold">
            {processInlineStyles(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export const LessonTheory: React.FC<LessonTheoryProps> = ({ lesson, onNext }) => {
  return (
    <div className="w-full max-w-lg mx-auto space-y-5 animate-fadeUp relative z-10">
      <div className="bg-[#FFFDF6] rounded-[32px] p-6 text-slate-900 shadow-2xl border-2 border-amber-100/70 relative">
        {renderContent(lesson.content)}
      </div>

      {/* Guru's Secret Tip */}
      <motion.div
        className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-100 rounded-3xl p-5 flex gap-4 items-center text-slate-800 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="text-4xl flex-shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>🧙‍♂️</div>
        <div>
          <h5 className="text-[10px] font-black text-saffron uppercase tracking-widest">Guru's Math Magic Tip!</h5>
          <p className="text-[11px] text-slate-700 font-bold leading-normal mt-0.5">
            "Every Vedic math formula has a secret pattern. Find the pattern, and you can calculate faster than a flash of lightning! ⚡"
          </p>
        </div>
      </motion.div>

      <button
        onClick={onNext}
        className="bg-gradient-to-r from-violet to-saffron hover:scale-[1.02] active:scale-[0.98] transition-transform text-white rounded-2xl w-full py-3.5 font-black text-sm shadow-lg shadow-violet/25"
      >
        Next: Examples ➜
      </button>
    </div>
  );
};
