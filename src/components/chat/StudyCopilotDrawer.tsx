'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname, useParams } from 'next/navigation';
import {
  Sparkles,
  X,
  Send,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Code2,
  HelpCircle,
  FileText,
  Bot,
  User,
  ArrowRight
} from 'lucide-react';
import { Subject } from '@/types/academic';
import { useAcademic } from '@/context/AcademicContext';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
}

interface StudyCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubject?: Subject | null;
  activeUnitTitle?: string;
  initialPrompt?: string;
}

export function StudyCopilotDrawer({
  isOpen,
  onClose,
  activeSubject,
  activeUnitTitle,
  initialPrompt,
}: StudyCopilotDrawerProps) {
  const pathname = usePathname() || '';
  const params = useParams();
  const { subjects, resources } = useAcademic();

  const isWarRoom = pathname.startsWith('/war-room');

  // Resolve active subject dynamically if inside a War Room
  const activeCourse = useMemo(() => {
    if (!isWarRoom) return null;
    if (activeSubject) return activeSubject;
    const subjectParam = (params?.subjectId as string) || pathname.split('/war-room/')[1]?.split('/')[0];
    if (subjectParam) {
      return (
        subjects.find(
          (s) =>
            s.id.toLowerCase() === subjectParam.toLowerCase() ||
            s.code.toLowerCase() === subjectParam.toLowerCase()
        ) || null
      );
    }
    return null;
  }, [isWarRoom, activeSubject, params?.subjectId, pathname, subjects]);

  const subjectName = isWarRoom && activeCourse ? activeCourse.name : null;
  const unitTitle = isWarRoom && activeCourse
    ? activeUnitTitle || activeCourse.syllabusUnits?.[0]?.title || null
    : null;

  const connectedResources = useMemo(() => {
    if (activeCourse) {
      return resources.filter((r) => r.subjectId === activeCourse.id);
    }
    return resources;
  }, [activeCourse, resources]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'copilot',
      text: subjectName
        ? `Hello! I am your StudyPulse Copilot for **${subjectName}**. I am connected to your uploaded course documents and notes (${connectedResources.length} document${connectedResources.length === 1 ? '' : 's'} available). Ask me to **summarize the chapter in short**, practice **Interactive MCQs**, or generate **10-Mark Exam Questions**.`
        : `Hello! I am your StudyPulse Copilot. I am directly connected to your uploaded notes and academic resources (${connectedResources.length} loaded). Ask me to **summarize any chapter**, generate **Interactive MCQs**, or ask technical queries!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update initial welcome message if user navigates routes and has not messaged yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id.startsWith('welcome')) {
        return [
          {
            id: 'welcome-1',
            sender: 'copilot',
            text: subjectName
              ? `Hello! I am your StudyPulse Copilot for **${subjectName}**. I am connected to your uploaded course documents and notes (${connectedResources.length} document${connectedResources.length === 1 ? '' : 's'} available). Ask me to **summarize the chapter in short**, practice **Interactive MCQs**, or generate **10-Mark Exam Questions**.`
              : `Hello! I am your StudyPulse Copilot. I am directly connected to your uploaded notes and academic resources (${connectedResources.length} loaded). Ask me to **summarize any chapter**, generate **Interactive MCQs**, or ask technical queries!`,
            timestamp: 'Just now',
          },
        ];
      }
      return prev;
    });
  }, [subjectName, connectedResources.length]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Auto-focus input on drawer open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Handle initial prompt if provided
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const inputMessage = (textToSend || inputText).trim();
    if (!inputMessage || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          subjectName: subjectName,
          unitTitle: unitTitle,
          subjectId: activeCourse?.id || null,
        }),
      });

      const data = await res.json();

      if (data.error) {
        const errorCopilotMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          sender: 'copilot',
          text: `⚠️ ${data.error}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorCopilotMessage]);
        return;
      }

      const copilotMessage: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: data.reply || 'No response generated. Please check your query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, copilotMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'copilot',
        text: `⚠️ Network Error: ${err.message || 'Unable to connect to Copilot API'}. Check server logs.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'copilot',
        text: subjectName
          ? `Conversation cleared. Ready for your next query on **${subjectName}**${unitTitle ? ` (${unitTitle})` : ''}.`
          : `Conversation cleared. Ready for your next academic question.`,
        timestamp: 'Just now',
      },
    ]);
  };

  const handleCopyCode = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBlockId(blockId);
    setTimeout(() => setCopiedBlockId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div className="relative z-50 flex h-full w-full max-w-lg flex-col bg-white border-l border-slate-200 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200/90 px-4 py-3 bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <Sparkles className="h-4 w-4 text-indigo-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900">
                  {subjectName ? `Copilot · ${subjectName}` : 'Copilot · Academic Assistant'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Gemini 3.8 Flash
                </span>
                {connectedResources.length > 0 && (
                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {connectedResources.length} {connectedResources.length === 1 ? 'doc connected' : 'docs connected'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[260px] sm:max-w-xs">
                {subjectName
                  ? `${activeCourse?.code || ''} • ${unitTitle || 'All Units'} • Grounded in Uploaded Materials`
                  : `${connectedResources.length} Platform Document${connectedResources.length === 1 ? '' : 's'} Active`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Clear conversation"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onClose}
              title="Close drawer"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex flex-col',
                msg.sender === 'user' ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={cn(
                  'rounded-2xl text-xs leading-relaxed max-w-[92%]',
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white p-3.5 rounded-tr-xs shadow-xs'
                    : 'bg-white border border-slate-200/90 text-slate-800 p-4 rounded-tl-xs shadow-xs space-y-2'
                )}
              >
                <MarkdownRenderer
                  text={msg.text}
                  isUser={msg.sender === 'user'}
                  onCopyCode={handleCopyCode}
                  copiedBlockId={copiedBlockId}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="rounded-2xl rounded-tl-xs bg-white border border-slate-200 p-3.5 shadow-xs flex items-center gap-2 text-xs text-slate-600">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse delay-150" />
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse delay-300" />
                <span className="text-xs text-slate-600 font-medium ml-1">
                  Analyzing uploaded resources & generating...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Accelerator Chips */}
        <div className="border-t border-slate-100 bg-white px-3.5 pt-2.5 pb-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() =>
                handleSendMessage(
                  `Give me the Chapter 1 MCQs with instant feedback based on my uploaded chapter document`
                )
              }
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-[11px] font-semibold text-indigo-900 transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <HelpCircle className="h-3 w-3 text-indigo-600" />
              <span>🎯 Chapter 1 MCQs</span>
            </button>

            <button
              onClick={() =>
                handleSendMessage(
                  `Summarize the chapter to me in short based on my uploaded document`
                )
              }
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-900 transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <Sparkles className="h-3 w-3 text-emerald-600" />
              <span>⚡ Summarize Chapter</span>
            </button>

            <button
              onClick={() =>
                handleSendMessage(
                  `Provide 2 university-exam long questions (10 marks) on the uploaded chapter with examiner checklist, model answers, and marking scheme`
                )
              }
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-[11px] font-semibold text-amber-900 transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <FileText className="h-3 w-3 text-amber-600" />
              <span>📝 10-Mark Questions</span>
            </button>

            <button
              onClick={() =>
                handleSendMessage(
                  `Extract core definitions, data structure classifications, and time/space complexity bounds from my uploaded chapter`
                )
              }
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
            >
              <Code2 className="h-3 w-3 text-emerald-600" />
              <span>💡 Formulas & Bounds</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200/90 p-3 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                subjectName
                  ? `Ask Copilot, get MCQs, or 10-mark questions on ${activeCourse?.code || subjectName}...`
                  : 'Ask question, practice MCQs, or request exam solutions...'
              }
              disabled={isLoading}
              className="flex-1 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-2xs shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5 text-indigo-200" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1.5">
            <span>Press Enter to send</span>
            <span>{subjectName ? `Grounded in ${subjectName}` : 'Interactive MCQs & Long Questions'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
