'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target, Sparkles } from 'lucide-react';
import { SyllabusTopic } from '@/types/academic';
import { cn } from '@/lib/utils';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

interface PomodoroTimerProps {
  activeTopic?: SyllabusTopic | null;
  onClearTopic?: () => void;
}

export function PomodoroTimer({ activeTopic, onClearTopic }: PomodoroTimerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSecondsLeft(TIMER_DURATIONS[mode]);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const toggleRunning = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(TIMER_DURATIONS[mode]);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalDuration = TIMER_DURATIONS[mode];
  const progressPercent = Math.round(((totalDuration - secondsLeft) / totalDuration) * 100);

  if (!isMounted) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex items-center justify-between">
        <span className="text-sm font-mono text-slate-800">25:00 Focus Timer</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-900">Sprint Focus Timer</span>
            <p className="text-[11px] text-slate-500">Deliberate study sprints with active intervals</p>
          </div>
        </div>

        {/* Mode selector pills */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 text-xs self-start sm:self-auto">
          <button
            onClick={() => setMode('focus')}
            className={cn(
              'px-2.5 py-1 rounded-md font-medium transition-colors',
              mode === 'focus' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => setMode('shortBreak')}
            className={cn(
              'px-2.5 py-1 rounded-md font-medium transition-colors',
              mode === 'shortBreak' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Break (5m)
          </button>
          <button
            onClick={() => setMode('longBreak')}
            className={cn(
              'px-2.5 py-1 rounded-md font-medium transition-colors',
              mode === 'longBreak' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            )}
          >
            Long (15m)
          </button>
        </div>
      </div>

      {/* Timer Body */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Time display & progress */}
        <div className="flex items-center gap-4">
          <div className="text-3xl sm:text-4xl font-mono font-semibold tracking-tight text-slate-900">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">
              {isRunning ? (
                <span className="text-indigo-600 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping" />
                  Sprint Active
                </span>
              ) : (
                'Timer Paused'
              )}
            </span>
            <span className="text-[11px] text-slate-400">
              {progressPercent}% interval elapsed
            </span>
          </div>
        </div>

        {/* Target Topic Pill if active */}
        {activeTopic && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-indigo-50/60 border border-indigo-100 max-w-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="text-xs text-slate-800 font-medium truncate">
              Target: {activeTopic.title}
            </span>
            {onClearTopic && (
              <button
                onClick={onClearTopic}
                className="text-slate-400 hover:text-slate-600 text-xs px-1"
                title="Clear topic"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={toggleRunning}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors shadow-xs',
              isRunning
                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            )}
          >
            {isRunning ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Thin subtle progress bar */}
      <div className="mt-3.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
