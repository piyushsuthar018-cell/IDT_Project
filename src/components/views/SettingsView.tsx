'use client';

import React, { useState } from 'react';
import { Settings, Check, Database, RefreshCw, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { mockStudentProfile } from '@/data/mockData';
import { useAcademic } from '@/context/AcademicContext';

export function SettingsView() {
  const { resetDemoData, isLoading, subjects } = useAcademic();
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    setResetSuccess(false);
    try {
      await resetDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-600" />
          Student Account & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure academic goal targets, deadline alert thresholds, and local database sync options
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-6 shadow-xs">
        {/* Profile Card */}
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <div className="h-12 w-12 rounded-xl bg-slate-900 text-white font-semibold text-base flex items-center justify-center">
            {mockStudentProfile.initials}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{mockStudentProfile.name}</h3>
            <p className="text-xs text-slate-500">{mockStudentProfile.program} • {mockStudentProfile.batch}</p>
            <span className="mt-1 inline-block text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.2 rounded border border-emerald-200">
              Verified Student Enrollee
            </span>
          </div>
        </div>

        {/* Academic Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-medium text-slate-500">Target Cumulative GPA</span>
            <div className="text-xl font-mono font-semibold text-slate-900">3.90 / 4.00</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-medium text-slate-500">Exam Preparation Trigger</span>
            <div className="text-xl font-mono font-semibold text-slate-900">&le; 5 Days Before Exam</div>
          </div>
        </div>

        {/* Local SQLite Database & Presentation Demo Section */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50/50 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Database className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span>SQLite Database Persistence</span>
                  <span className="text-[10px] font-medium px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Connected
                  </span>
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  prisma/dev.db • {subjects.length} courses loaded
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              disabled={isResetting || isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs disabled:opacity-50 self-start sm:self-auto"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-indigo-300 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Re-seeding...' : 'Reset Demo Data'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            StudyPulse stores all course units, topics, deadlines, resources, and roadmap milestones in a persistent local SQLite database via Prisma ORM. Clicking <strong>Reset Demo Data</strong> will re-populate the 3 benchmark engineering courses (Operating Systems, DSA, DBMS) with full syllabus matrices and STEM code assets.
          </p>

          {resetSuccess && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Demo data re-seeded successfully! 3 courses and verified syllabus models restored.</span>
            </div>
          )}
        </div>

        {/* Workspace Preferences */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Workspace Preferences</h4>
          <div className="space-y-2">
            {[
              { title: 'Push Alerts for Deadlines (<48h)', desc: 'Receive high-priority notifications for upcoming submissions', enabled: true },
              { title: 'Auto-generate Daily Revision Goals', desc: 'Auto-synthesize 3 high-yield review tasks every morning', enabled: true },
              { title: 'Peer Anonymous Benchmarking', desc: 'Compare topic readiness against course cohort averages', enabled: false },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 border border-slate-100">
                <div>
                  <h5 className="text-xs font-medium text-slate-900">{pref.title}</h5>
                  <p className="text-[11px] text-slate-500">{pref.desc}</p>
                </div>
                <div
                  className={`h-5 w-5 rounded-md flex items-center justify-center ${
                    pref.enabled ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
