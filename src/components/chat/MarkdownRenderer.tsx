'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { InteractiveMcq, McqQuestion } from './InteractiveMcq';
import { LongQuestionView, LongQuestionItem } from './LongQuestionView';

interface MarkdownRendererProps {
  text: string;
  isUser: boolean;
  onCopyCode: (code: string, blockId: string) => void;
  copiedBlockId: string | null;
}

/**
 * Parses and renders inline markdown tokens: **bold**, *italic*, `code`, and cleans raw {A} tags
 */
export function CleanMarkdownText({ text }: { text: string }) {
  if (!text) return null;

  // Replace stray raw tokens like `*{A}*` or `{B}` with a clean styled pill
  const sanitized = text
    .replace(/\*\{\s*([A-Za-z0-9]+)\s*\}\*/g, '[$1]')
    .replace(/\{\s*([A-Za-z0-9]+)\s*\}/g, '($1)');

  // Tokenize for bold (**...**) and inline code (`...`)
  const tokens = sanitized.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return (
    <span>
      {tokens.map((token, i) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          const inner = token.slice(2, -2);
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {inner}
            </strong>
          );
        }

        if (token.startsWith('`') && token.endsWith('`')) {
          const inner = token.slice(1, -1);
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-[11px] border border-slate-200"
            >
              {inner}
            </code>
          );
        }

        // Handle single asterisks or italic if present
        const italicTokens = token.split(/(\*[^*]+\*)/g);
        return (
          <span key={i}>
            {italicTokens.map((it, j) => {
              if (it.startsWith('*') && it.endsWith('*') && it.length > 2) {
                return <em key={j} className="italic text-slate-800">{it.slice(1, -1)}</em>;
              }
              // Clean any standalone asterisks
              const cleanText = it.replace(/(?<!\w)\*(?!\w)/g, '');
              return <React.Fragment key={j}>{cleanText}</React.Fragment>;
            })}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Intelligent fallback parser to detect markdown-based MCQs if the model didn't wrap in ```mcq-json
 */
function tryExtractMarkdownMcqs(rawText: string): McqQuestion[] | null {
  try {
    const qBlocks = rawText.split(/(?=(?:(?:Q(?:uestion)?\s*\d+[:.]?)|(?:\b\d+\.\s+))(?=[^\n]*\b(?:which|what|explain|calculate|how|identify|is|the|when|in|consider|suppose)\b|\s*[A-Z]))/i);
    const parsedQuestions: McqQuestion[] = [];

    for (let idx = 0; idx < qBlocks.length; idx++) {
      const block = qBlocks[idx].trim();
      if (!block) continue;

      // Check for presence of A), B), C), D) options
      const optA = block.match(/(?:[*•-]\s*)?(?:\(?A\)?[:.]?|\bA[:.]\s+)\s*([^\n]+)/i);
      const optB = block.match(/(?:[*•-]\s*)?(?:\(?B\)?[:.]?|\bB[:.]\s+)\s*([^\n]+)/i);
      const optC = block.match(/(?:[*•-]\s*)?(?:\(?C\)?[:.]?|\bC[:.]\s+)\s*([^\n]+)/i);
      const optD = block.match(/(?:[*•-]\s*)?(?:\(?D\)?[:.]?|\bD[:.]\s+)\s*([^\n]+)/i);

      if (optA && optB) {
        // Extract Question statement
        const firstOptIndex = block.search(/(?:[*•-]\s*)?(?:\(?A\)?[:.]?|\bA[:.]\s+)/i);
        let qStatement = block.substring(0, firstOptIndex).trim();
        qStatement = qStatement.replace(/^(?:\*\*)?(?:Question\s*\d+:?|\d+\.)(?:\*\*)?\s*/i, '').replace(/^\*\*|\*\*$/g, '').trim();

        // Extract Correct Answer
        const ansMatch = block.match(/(?:Answer|Correct\s*Answer|Correct\s*Option|Ans)[:\s*]*[({*]?\s*([A-D])\s*[)}*]?/i);
        const correctAnswer = ansMatch ? ansMatch[1].toUpperCase() : 'A';

        // Extract Explanation
        const expMatch = block.match(/(?:Explanation|Rationale)[:\s*]*([\s\S]+?)(?=(?:Question|\d+\.|$))/i);
        const explanation = expMatch
          ? expMatch[1].replace(/^\*\*|\*\*$/g, '').trim()
          : `Option ${correctAnswer} is the correct answer according to academic curriculum standards.`;

        const options = [
          { label: 'A', text: optA[1].replace(/^\*\*|\*\*$/g, '').trim() },
          { label: 'B', text: optB[1].replace(/^\*\*|\*\*$/g, '').trim() },
        ];
        if (optC) options.push({ label: 'C', text: optC[1].replace(/^\*\*|\*\*$/g, '').trim() });
        if (optD) options.push({ label: 'D', text: optD[1].replace(/^\*\*|\*\*$/g, '').trim() });

        if (qStatement && options.length >= 2) {
          parsedQuestions.push({
            id: idx + 1,
            question: qStatement,
            options,
            correctAnswer,
            explanation,
          });
        }
      }
    }

    return parsedQuestions.length >= 1 ? parsedQuestions : null;
  } catch {
    return null;
  }
}

/**
 * Main Content Formatter: splits code blocks, MCQ JSON, Long Questions, and clean text
 */
export function MarkdownRenderer({
  text,
  isUser,
  onCopyCode,
  copiedBlockId,
}: MarkdownRendererProps) {
  if (isUser) {
    return <span className="leading-relaxed">{text}</span>;
  }

  // Split content by code blocks ```...```
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const contentWithoutTicks = part.slice(3, -3);
          const firstNewline = contentWithoutTicks.indexOf('\n');
          const languageTag = (
            firstNewline !== -1 ? contentWithoutTicks.slice(0, firstNewline) : ''
          ).trim().toLowerCase();
          const rawCode =
            firstNewline !== -1 ? contentWithoutTicks.slice(firstNewline + 1) : contentWithoutTicks;

          // 1. Structured MCQ block (supports mcq-json, json-mcq, or standard json with questions)
          if (languageTag === 'mcq-json' || languageTag === 'json-mcq' || languageTag === 'json' || (rawCode.includes('"question"') && rawCode.includes('"options"'))) {
            try {
              const parsed = JSON.parse(rawCode.trim());
              const rawQuestions: any[] = Array.isArray(parsed)
                ? parsed
                : parsed.questions || parsed.mcqs || [];

              if (rawQuestions.length > 0 && rawQuestions[0].question && Array.isArray(rawQuestions[0].options)) {
                const normalized: McqQuestion[] = rawQuestions.map((q, qIdx) => {
                  const rawOpts: any[] = q.options || [];
                  const options = rawOpts.map((opt, optIdx) => {
                    if (typeof opt === 'string') {
                      return {
                        label: String.fromCharCode(65 + optIdx),
                        text: opt.replace(/^[A-D][:.)]\s*/i, '').trim(),
                      };
                    }
                    return {
                      label: opt.label || String.fromCharCode(65 + optIdx),
                      text: opt.text || opt.title || String(opt),
                    };
                  });

                  let rawAns = (q.correctAnswer || q.answer || q.correct_answer || 'A').toString().trim();
                  let cleanAns = rawAns.toUpperCase();

                  if (cleanAns.length > 1) {
                    const matchIdx = options.findIndex((o) =>
                      o.text.toLowerCase() === rawAns.toLowerCase() ||
                      rawAns.toLowerCase().includes(o.text.toLowerCase())
                    );
                    if (matchIdx !== -1) {
                      cleanAns = options[matchIdx].label;
                    } else {
                      cleanAns = cleanAns[0] || 'A';
                    }
                  }

                  return {
                    id: q.id || qIdx + 1,
                    question: q.question,
                    options,
                    correctAnswer: cleanAns,
                    explanation: q.explanation || q.rationale || `Option ${cleanAns} is the correct answer according to academic curriculum standards.`,
                  };
                });

                return <InteractiveMcq key={index} questions={normalized} />;
              }
            } catch {
              // Not an MCQ JSON, proceed
            }
          }

          // 2. Structured Long Question block (supports long-question or json with modelAnswer)
          if (languageTag === 'long-question' || languageTag === 'long-questions' || languageTag === 'json') {
            try {
              const parsed = JSON.parse(rawCode.trim());
              const questions: LongQuestionItem[] = Array.isArray(parsed) ? parsed : [parsed];
              if (
                questions.length > 0 &&
                (questions[0].modelAnswer || questions[0].keyPoints || questions[0].markingScheme)
              ) {
                return <LongQuestionView key={index} questions={questions} />;
              }
            } catch {
              // Not a Long Question JSON, proceed
            }
          }

          // 3. Regular Code block
          const blockId = `code-block-${index}`;
          const language = languageTag || 'code';

          return (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 my-2 text-xs font-mono shadow-md"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="uppercase tracking-wider font-semibold text-[10px] text-slate-300">
                  {language}
                </span>
                <button
                  type="button"
                  onClick={() => onCopyCode(rawCode, blockId)}
                  className="flex items-center gap-1 text-[10px] hover:text-white transition-colors py-0.5 px-2 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                >
                  {copiedBlockId === blockId ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed text-slate-200">
                <code>{rawCode}</code>
              </pre>
            </div>
          );
        }

        // Raw JSON check: If part is raw JSON without markdown code ticks
        const trimmedPart = part.trim();
        if (
          (trimmedPart.startsWith('[') && trimmedPart.endsWith(']')) ||
          (trimmedPart.startsWith('{') && trimmedPart.endsWith('}'))
        ) {
          try {
            const parsed = JSON.parse(trimmedPart);
            const questions = Array.isArray(parsed) ? parsed : parsed.questions || parsed.mcqs;
            if (Array.isArray(questions) && questions.length > 0 && questions[0].question && questions[0].options) {
              return <InteractiveMcq key={index} questions={questions} />;
            }
            if (Array.isArray(questions) && questions.length > 0 && (questions[0].modelAnswer || questions[0].keyPoints)) {
              return <LongQuestionView key={index} questions={questions} />;
            }
          } catch {
            // Not valid JSON, continue with normal parsing
          }
        }

        // Fallback check: If the plain text section contains markdown MCQs, parse and render them interactively!
        const detectedMcqs = tryExtractMarkdownMcqs(part);
        if (detectedMcqs && detectedMcqs.length >= 1) {
          return <InteractiveMcq key={index} questions={detectedMcqs} />;
        }

        // Standard Text Content: split into paragraphs and clean up symbols
        const paragraphs = part.split(/\n\s*\n/);

        return (
          <div key={index} className="space-y-2.5">
            {paragraphs.map((p, pIndex) => {
              const trimmed = p.trim();
              if (!trimmed) return null;

              // Headings
              if (trimmed.startsWith('### ')) {
                return (
                  <h4
                    key={pIndex}
                    className="font-semibold text-slate-900 text-xs mt-3 pt-1 border-b border-slate-100 pb-1"
                  >
                    <CleanMarkdownText text={trimmed.replace(/^###\s+/, '')} />
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3
                    key={pIndex}
                    className="font-bold text-slate-900 text-sm mt-3.5 pt-1 border-b border-slate-200 pb-1"
                  >
                    <CleanMarkdownText text={trimmed.replace(/^##\s+/, '')} />
                  </h3>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2
                    key={pIndex}
                    className="font-bold text-slate-900 text-base mt-4 border-b border-slate-200 pb-1.5"
                  >
                    <CleanMarkdownText text={trimmed.replace(/^#\s+/, '')} />
                  </h2>
                );
              }

              // Check if paragraph is a list of items (starting with * , - , • or numbers)
              const lines = trimmed.split('\n');
              const isBulletList = lines.every(
                (l) => l.trim() === '' || /^[*•-]\s+/.test(l.trim()) || /^\d+\.\s+/.test(l.trim())
              );

              if (isBulletList && lines.length > 1) {
                return (
                  <ul key={pIndex} className="space-y-1.5 pl-1 my-1.5">
                    {lines.map((line, lIdx) => {
                      const cleanLine = line.trim().replace(/^([*•-]\s+|\d+\.\s+)/, '');
                      if (!cleanLine) return null;
                      return (
                        <li key={lIdx} className="flex items-start gap-2 text-slate-700 text-xs leading-relaxed">
                          <span className="text-indigo-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>
                            <CleanMarkdownText text={cleanLine} />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              // Normal clean paragraph
              return (
                <p key={pIndex} className="leading-relaxed text-slate-700 text-xs">
                  <CleanMarkdownText text={trimmed} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
