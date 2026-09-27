'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface McqOption {
  label: string;
  text: string;
}

export interface McqQuestion {
  id: number | string;
  question: string;
  options: McqOption[];
  correctAnswer: string;
  explanation: string;
}

interface InteractiveMcqProps {
  questions: McqQuestion[];
}

export function InteractiveMcq({ questions }: InteractiveMcqProps) {
  // Map of questionId -> selected option label (e.g., 'A', 'B')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string | number, string>>({});

  const handleSelectOption = (questionId: string | number, label: string) => {
    // If already answered, don't allow changing to preserve quiz integrity
    if (selectedAnswers[questionId]) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: label.toUpperCase().trim(),
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
  };

  // Calculate scores
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id]?.toUpperCase() === q.correctAnswer.toUpperCase()
  ).length;

  return (
    <div className="space-y-4 my-2">
      {/* Quiz Header & Score Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-[11px]">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-semibold text-indigo-950">Interactive Practice Quiz</span>
            <span className="text-[11px] text-indigo-600 ml-1.5">
              ({totalQuestions} {totalQuestions === 1 ? 'Question' : 'Questions'})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {answeredCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-indigo-900 font-semibold text-[11px] shadow-2xs">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>
                {correctCount} / {answeredCount} Correct
              </span>
            </div>
          )}

          {answeredCount > 0 && (
            <button
              onClick={handleReset}
              title="Reset and retake this quiz"
              className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = Boolean(userChoice);
          const isCorrect = isAnswered && userChoice === q.correctAnswer.toUpperCase();
          const cleanCorrectAnswer = q.correctAnswer.toUpperCase().trim();

          return (
            <div
              key={q.id || idx}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3 transition-all"
            >
              {/* Question Header */}
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white text-[10px] font-bold mt-0.5">
                  Q{idx + 1}
                </span>
                <p className="font-semibold text-slate-900 text-xs leading-relaxed flex-1">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-1.5 pt-1">
                {q.options.map((opt) => {
                  const optLabel = opt.label.toUpperCase().trim();
                  const isSelected = userChoice === optLabel;
                  const isThisOptionCorrect = optLabel === cleanCorrectAnswer;

                  let buttonStyle =
                    'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 text-slate-700 bg-white';
                  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

                  if (isAnswered) {
                    if (isThisOptionCorrect) {
                      // Correct option always highlighted green once answered
                      buttonStyle =
                        'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium shadow-2xs';
                      badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isSelected && !isCorrect) {
                      // Wrong option picked by user
                      buttonStyle =
                        'border-rose-400 bg-rose-50/70 text-rose-950 font-medium';
                      badgeStyle = 'bg-rose-500 text-white border-rose-500';
                    } else {
                      // Unselected non-correct options
                      buttonStyle = 'border-slate-100 bg-slate-50/40 text-slate-400 opacity-60';
                      badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                    }
                  }

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.label)}
                      disabled={isAnswered}
                      className={cn(
                        'w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-all duration-150',
                        buttonStyle,
                        !isAnswered && 'cursor-pointer active:scale-[0.99]'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold border',
                            badgeStyle
                          )}
                        >
                          {opt.label}
                        </span>
                        <span className="leading-snug break-words">{opt.text}</span>
                      </div>

                      {isAnswered && (
                        <div className="shrink-0 ml-2">
                          {isThisOptionCorrect && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          )}
                          {isSelected && !isCorrect && (
                            <XCircle className="h-4 w-4 text-rose-500" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback & Academic Explanation */}
              {isAnswered && (
                <div
                  className={cn(
                    'mt-2.5 p-3 rounded-lg border text-[11px] leading-relaxed animate-in fade-in duration-200 space-y-1.5',
                    isCorrect
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/60 border-amber-200 text-amber-950'
                  )}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Correct! Option {cleanCorrectAnswer}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-rose-500" />
                        <span className="text-rose-700">
                          Incorrect! Correct Answer is Option {cleanCorrectAnswer}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-700">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
