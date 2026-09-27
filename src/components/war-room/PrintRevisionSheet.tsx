'use client';

import React from 'react';
import { Subject, SyllabusUnit, Resource } from '@/types/academic';
import { mockStudentProfile } from '@/data/mockData';

interface PrintRevisionSheetProps {
  subject: Subject;
  units: SyllabusUnit[];
  resources: Resource[];
}

export function PrintRevisionSheet({
  subject,
  units,
  resources,
}: PrintRevisionSheetProps) {
  // Extract all weak spot (untouched) topics across all units
  const weakSpotTopics = units.flatMap((u) =>
    u.topics
      .filter((t) => t.status === 'untouched')
      .map((t) => ({ ...t, unitTitle: u.title, unitNumber: u.unitNumber }))
  );

  const subjectResources = resources.filter(
    (r) => r.subjectId === subject.id || r.subjectCode === subject.code
  );

  const formulaSheets = subjectResources.filter(
    (r) => r.type === 'formula_sheet' || r.type === 'cheatsheet'
  );

  const pastPapers = subjectResources.filter(
    (r) => r.type === 'past_paper'
  );

  const labCodes = subjectResources.filter(
    (r) => r.type === 'code' || r.type === 'lab'
  );

  const examFormattedDate = subject.nextExamDate
    ? new Date(subject.nextExamDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Upcoming Examination';

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans max-w-4xl mx-auto space-y-6 text-sm">
      {/* Institutional Document Header */}
      <div className="border-b-2 border-black pb-4 flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
            StudyPulse Academic Revision Sheet • End-Term Preparation
          </div>
          <h1 className="text-2xl font-bold text-black mt-1">
            {subject.name} ({subject.code})
          </h1>
          <p className="text-xs text-neutral-700 mt-1">
            {subject.instructor ? <>Instructor: <strong>{subject.instructor}</strong></> : <span>Course Curriculum</span>}
            {subject.room ? ` • Room: ${subject.room}` : ''} • {subject.creditHours} Credits
          </p>
        </div>
        <div className="text-right font-mono text-xs">
          <div>Student: <strong>{mockStudentProfile.name}</strong></div>
          <div className="text-neutral-600">ID: CS-2024-8891</div>
          <div className="mt-1.5 font-bold text-black">
            Exam: {examFormattedDate}
          </div>
        </div>
      </div>

      {/* Readiness Snapshot Bar */}
      <div className="border border-black p-3.5 rounded-none flex items-center justify-between bg-neutral-50">
        <div>
          <span className="text-xs uppercase font-mono tracking-wide text-neutral-600">Overall Readiness:</span>
          <span className="ml-2 font-bold text-base">{subject.readinessScore}%</span>
        </div>
        <div>
          <span className="text-xs uppercase font-mono tracking-wide text-neutral-600">Syllabus Progress:</span>
          <span className="ml-2 font-bold">
            {subject.syllabusTopics.completed} of {subject.syllabusTopics.total} Topics Mastered
          </span>
        </div>
        <div>
          <span className="text-xs uppercase font-mono tracking-wide text-neutral-600">Untouched High-Risk:</span>
          <span className="ml-2 font-bold text-red-600">{weakSpotTopics.length} Topics</span>
        </div>
      </div>

      {/* Critical Weak Spots Callout Box */}
      {weakSpotTopics.length > 0 && (
        <div className="border-2 border-dashed border-red-700 p-4 rounded-none space-y-2 break-inside-avoid">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-red-700 uppercase tracking-wide text-xs">
              ⚠️ Priority 1: High-Risk Weak Spots (Clear Before Exam Eve)
            </h3>
            <span className="text-[11px] font-mono text-neutral-600">
              {weakSpotTopics.length} items requiring active review
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {weakSpotTopics.map((topic, i) => (
              <div key={topic.id} className="flex items-start gap-2">
                <span className="inline-block w-3.5 h-3.5 border border-black shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong>Unit {topic.unitNumber}:</strong> {topic.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete Syllabus Unit-by-Unit Checklist */}
      <div className="space-y-4">
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-neutral-300 pb-1">
          Complete Syllabus Examination Checklist
        </h2>

        <div className="space-y-4">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="border border-neutral-400 p-3.5 rounded-none space-y-2 break-inside-avoid"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
                <h3 className="font-bold text-black text-sm">
                  {unit.title}
                </h3>
                <span className="text-xs font-mono text-neutral-500">
                  {unit.topics.length} topics
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {unit.topics.map((topic) => (
                  <div key={topic.id} className="flex items-start gap-2">
                    <span
                      className={`inline-block w-3.5 h-3.5 border border-black shrink-0 mt-0.5 ${
                        topic.status === 'mastered' ? 'bg-neutral-800' : ''
                      }`}
                    />
                    <span
                      className={`leading-snug ${
                        topic.status === 'mastered'
                          ? 'line-through text-neutral-500'
                          : topic.status === 'untouched'
                          ? 'font-medium text-black'
                          : 'text-neutral-800'
                      }`}
                    >
                      {topic.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attached Digital Locker Formula & Past Paper Index */}
      <div className="border-t border-black pt-4 space-y-3 break-inside-avoid">
        <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
          Attached Digital Locker Reference Directory
        </h3>
        <div className="grid grid-cols-3 gap-4 text-xs font-mono">
          <div className="border border-neutral-300 p-2.5 space-y-1">
            <span className="font-bold text-black block">Formula Sheets:</span>
            {formulaSheets.length === 0 ? (
              <span className="text-neutral-400">None attached</span>
            ) : (
              formulaSheets.map((f) => (
                <div key={f.id} className="truncate">• {f.title}</div>
              ))
            )}
          </div>

          <div className="border border-neutral-300 p-2.5 space-y-1">
            <span className="font-bold text-black block">University PYQs:</span>
            {pastPapers.length === 0 ? (
              <span className="text-neutral-400">None attached</span>
            ) : (
              pastPapers.map((p) => (
                <div key={p.id} className="truncate">• {p.title}</div>
              ))
            )}
          </div>

          <div className="border border-neutral-300 p-2.5 space-y-1">
            <span className="font-bold text-black block">Verified Lab Code:</span>
            {labCodes.length === 0 ? (
              <span className="text-neutral-400">None attached</span>
            ) : (
              labCodes.map((c) => (
                <div key={c.id} className="truncate">• {c.title}</div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Signature & Exam Strategy Notes Footer */}
      <div className="border-t-2 border-neutral-300 pt-3 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
        <span>StudyPulse Offline Revision Engine • Carry to Examination Hall Study Room</span>
        <span>Generated on {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}
