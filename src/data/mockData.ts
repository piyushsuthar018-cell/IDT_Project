import {
  Subject,
  Deadline,
  Resource,
  StudyMilestone,
  Semester,
  StudentProfile,
  NotificationItem,
  SyllabusUnit,
  ExamRoadmap
} from '@/types/academic';

export const osSyllabusUnits: SyllabusUnit[] = [
  {
    id: 'unit-1',
    unitNumber: 1,
    title: 'Process Management & CPU Scheduling',
    weightPercentage: 20,
    topics: [
      {
        id: 't-1-1',
        title: 'Process States, PCB & Context Switching Overheads',
        status: 'mastered',
        importance: 'core',
        estimatedMinutes: 30,
        notesSummary: 'Process lifecycle transitions (New, Ready, Running, Waiting, Terminated) and context switch registers save/restore.',
        formulaReference: 'Overhead = T_save + T_load',
      },
      {
        id: 't-1-2',
        title: 'Thread Models & Kernel vs User Level Threads',
        status: 'mastered',
        importance: 'standard',
        estimatedMinutes: 25,
        notesSummary: 'Many-to-One, One-to-One, and Many-to-Many threading models with POSIX pthreads.',
      },
      {
        id: 't-1-3',
        title: 'Preemptive vs Non-Preemptive CPU Scheduling (FCFS, SJF, RR)',
        status: 'mastered',
        importance: 'high_yield',
        estimatedMinutes: 45,
        notesSummary: 'Gantt chart calculations for turnaround time, waiting time, and response time.',
        formulaReference: 'Turnaround Time = Completion Time - Arrival Time',
      },
      {
        id: 't-1-4',
        title: 'Multilevel Queue & Feedback Queue (MLFQ) Scheduling',
        status: 'in_progress',
        importance: 'high_yield',
        estimatedMinutes: 40,
        notesSummary: 'Aging mechanisms to prevent starvation across dynamic priority queues.',
      },
    ],
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    title: 'Concurrency, Synchronization & Mutexes',
    weightPercentage: 25,
    topics: [
      {
        id: 't-2-1',
        title: "Critical Section Criteria & Peterson's Algorithm",
        status: 'mastered',
        importance: 'core',
        estimatedMinutes: 35,
        notesSummary: 'Mutual exclusion, progress, and bounded waiting requirements with 2-process software solutions.',
      },
      {
        id: 't-2-2',
        title: 'Hardware Atomic Primitives (TestAndSet, CompareAndSwap)',
        status: 'mastered',
        importance: 'standard',
        estimatedMinutes: 30,
        notesSummary: 'Atomic memory instructions enabling spinlocks without software race conditions.',
      },
      {
        id: 't-2-3',
        title: 'Counting & Binary Semaphores (wait/P, signal/V)',
        status: 'mastered',
        importance: 'high_yield',
        estimatedMinutes: 45,
        notesSummary: 'Semaphore blocking implementation with waiting queues and priority inversion solutions.',
      },
      {
        id: 't-2-4',
        title: 'Classic Problem: Dining Philosophers (Deadlock & Starvation Avoidance)',
        status: 'untouched',
        importance: 'high_yield',
        estimatedMinutes: 50,
        notesSummary: 'Asymmetric chopsticks pickup, monitor state variables, and resource hierarchy.',
      },
      {
        id: 't-2-5',
        title: 'Producer-Consumer Bounded Buffer with Semaphores',
        status: 'in_progress',
        importance: 'high_yield',
        estimatedMinutes: 40,
        notesSummary: 'Empty, full, and mutex semaphores protecting circular FIFO buffers.',
      },
    ],
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    title: 'Deadlock Characterization, Avoidance & Recovery',
    weightPercentage: 15,
    topics: [
      {
        id: 't-3-1',
        title: "Coffman's 4 Necessary Deadlock Conditions",
        status: 'mastered',
        importance: 'core',
        estimatedMinutes: 25,
        notesSummary: 'Mutual exclusion, Hold & Wait, No Preemption, and Circular Wait conditions.',
      },
      {
        id: 't-3-2',
        title: 'Resource Allocation Graph (RAG) & Cycle Detection',
        status: 'mastered',
        importance: 'core',
        estimatedMinutes: 35,
        notesSummary: 'Claim edges, request edges, and assignment edges. Cycles imply deadlocks only for single instances.',
      },
      {
        id: 't-3-3',
        title: "Banker's Algorithm for Safe State Avoidance (Numerical)",
        status: 'untouched',
        importance: 'high_yield',
        estimatedMinutes: 60,
        notesSummary: 'Available vector, Max matrix, Allocation matrix, and Need matrix safety algorithm calculations.',
        formulaReference: 'Need[i][j] = Max[i][j] - Allocation[i][j]',
      },
      {
        id: 't-3-4',
        title: 'Deadlock Detection, Wait-For Graphs & Process Termination',
        status: 'untouched',
        importance: 'standard',
        estimatedMinutes: 30,
        notesSummary: 'Cost factor selection for victim process termination and rollback mechanisms.',
      },
    ],
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    title: 'Memory Management, Paging & Virtual Memory',
    weightPercentage: 25,
    topics: [
      {
        id: 't-4-1',
        title: 'Paging Hardware, Address Translation & TLB Hit Ratios',
        status: 'mastered',
        importance: 'high_yield',
        estimatedMinutes: 45,
        notesSummary: 'Page number (p) and offset (d) bit splits, TLB miss penalty, and effective access time calculations.',
        formulaReference: 'EAT = hit_rate * (t_tlb + t_mem) + (1 - hit_rate) * (t_tlb + 2*t_mem)',
      },
      {
        id: 't-4-2',
        title: 'Hierarchical & Inverted Multi-Level Page Tables',
        status: 'in_progress',
        importance: 'high_yield',
        estimatedMinutes: 40,
        notesSummary: 'Two-level address translation scheme reducing physical page table memory footprints.',
      },
      {
        id: 't-4-3',
        title: 'Page Replacement Algorithms (FIFO, Belady Anomaly, Optimal, LRU)',
        status: 'mastered',
        importance: 'high_yield',
        estimatedMinutes: 50,
        notesSummary: 'Reference string simulation, fault counts, and stack algorithm proofs.',
      },
      {
        id: 't-4-4',
        title: 'Second-Chance (Clock Algorithm) & Working Set Thrashing Prevention',
        status: 'untouched',
        importance: 'high_yield',
        estimatedMinutes: 45,
        notesSummary: 'Reference bit reset clock-hand sweep and Page Fault Frequency (PFF) controls.',
      },
    ],
  },
  {
    id: 'unit-5',
    unitNumber: 5,
    title: 'File Systems Architecture & Disk Scheduling',
    weightPercentage: 15,
    topics: [
      {
        id: 't-5-1',
        title: 'UNIX Inode Structure (Direct, Single, Double & Triple Indirect)',
        status: 'in_progress',
        importance: 'high_yield',
        estimatedMinutes: 40,
        notesSummary: 'File pointer block calculations and maximum addressable file size limits.',
        formulaReference: 'Max Size = (12 + (Block/Ptr) + (Block/Ptr)^2 + (Block/Ptr)^3) * Block_Size',
      },
      {
        id: 't-5-2',
        title: 'Disk Head Scheduling: FCFS, SSTF, SCAN, C-SCAN, C-LOOK',
        status: 'mastered',
        importance: 'high_yield',
        estimatedMinutes: 45,
        notesSummary: 'Total head movement cylinder calculations with boundary return algorithms.',
      },
      {
        id: 't-5-3',
        title: 'RAID Architecture Levels (0, 1, 5, 6, 10) & Redundancy',
        status: 'untouched',
        importance: 'standard',
        estimatedMinutes: 30,
        notesSummary: 'Striping, mirroring, and distributed parity write-penalty tradeoffs.',
      },
    ],
  },
];

export const mockStudentProfile: StudentProfile = {
  id: 'stu-alex-rivera-2026',
  name: 'Alex Rivera',
  initials: 'AR',
  email: 'a.rivera@cs.university.edu',
  program: 'B.S. in Computer Science',
  department: 'Computer Science & Engineering',
  semesterName: 'Semester 4 - Spring 2026',
  batch: 'Class of 2026',
  gpa: 3.84,
  studyStreakDays: 14,
  averageReadiness: 75.4,
};

export const mockSemesters: Semester[] = [
  {
    id: 'sem-4',
    code: 'SEM-4',
    name: 'Semester 4 - CS & Engineering',
    department: 'Computer Science',
    isCurrent: true,
    totalCredits: 18,
    gpa: 3.84,
    targetGpa: 3.90,
  },
  {
    id: 'sem-3',
    code: 'SEM-3',
    name: 'Semester 3 - Core Fundamentals',
    department: 'Computer Science',
    isCurrent: false,
    totalCredits: 20,
    gpa: 3.79,
    targetGpa: 3.80,
  },
  {
    id: 'sem-2',
    code: 'SEM-2',
    name: 'Semester 2 - Foundations',
    department: 'Computer Science',
    isCurrent: false,
    totalCredits: 19,
    gpa: 3.82,
    targetGpa: 3.80,
  },
  {
    id: 'sem-1',
    code: 'SEM-1',
    name: 'Semester 1 - Intro to Computing',
    department: 'Computer Science',
    isCurrent: false,
    totalCredits: 18,
    gpa: 3.75,
    targetGpa: 3.75,
  },
];

export const mockSubjects: Subject[] = [
  {
    id: 'subj-os-301',
    code: 'CS-301',
    name: 'Operating Systems',
    instructor: 'Prof. Aris Thorne',
    instructorEmail: 'a.thorne@cs.university.edu',
    room: 'Hall 402 / Turing Lab',
    color: '#4F46E5',
    accentGradient: 'from-indigo-500/20 to-purple-500/20',
    nextExamDate: '2026-09-23T09:00:00.000Z',
    nextExamTitle: 'End-Term Comprehensive Exam',
    daysUntilExam: 3,
    examType: 'End-Term',
    readinessScore: 68,
    resources: {
      notesCount: 14,
      labsCount: 6,
      pastPapersCount: 5,
      slidesCount: 11,
    },
    syllabusTopics: {
      completed: 13,
      total: 20,
    },
    syllabusUnits: osSyllabusUnits,
    creditHours: 4,
  },
  {
    id: 'subj-dsa-204',
    code: 'CS-204',
    name: 'Data Structures & Algorithms',
    instructor: 'Dr. Elena Vance',
    instructorEmail: 'e.vance@cs.university.edu',
    room: 'Auditorium B / Knuth Lab',
    color: '#0284C7',
    accentGradient: 'from-sky-500/20 to-blue-500/20',
    nextExamDate: '2026-10-02T14:00:00.000Z',
    nextExamTitle: 'Mid-Semester Assessment II',
    daysUntilExam: 12,
    examType: 'Mid-Term',
    readinessScore: 85,
    resources: {
      notesCount: 18,
      labsCount: 10,
      pastPapersCount: 6,
      slidesCount: 14,
    },
    syllabusTopics: {
      completed: 22,
      total: 26,
    },
    creditHours: 4,
  },
  {
    id: 'subj-la-220',
    code: 'MATH-220',
    name: 'Linear Algebra & Probability',
    instructor: 'Dr. Robert Chen',
    instructorEmail: 'r.chen@math.university.edu',
    room: 'Euler 108',
    color: '#059669',
    accentGradient: 'from-emerald-500/20 to-teal-500/20',
    nextExamDate: '2026-10-11T10:00:00.000Z',
    nextExamTitle: 'Final Theory Exam',
    daysUntilExam: 21,
    examType: 'End-Term',
    readinessScore: 92,
    resources: {
      notesCount: 11,
      labsCount: 4,
      pastPapersCount: 5,
      slidesCount: 9,
    },
    syllabusTopics: {
      completed: 20,
      total: 22,
    },
    creditHours: 3,
  },
  {
    id: 'subj-cn-305',
    code: 'CS-305',
    name: 'Computer Networks',
    instructor: 'Prof. Marcus Sterling',
    instructorEmail: 'm.sterling@cs.university.edu',
    room: 'Networks Lab 203',
    color: '#D97706',
    accentGradient: 'from-amber-500/20 to-orange-500/20',
    nextExamDate: '2026-09-27T11:00:00.000Z',
    nextExamTitle: 'Practical Lab Exam & Oral Defense',
    daysUntilExam: 7,
    examType: 'Practical',
    readinessScore: 58,
    resources: {
      notesCount: 9,
      labsCount: 8,
      pastPapersCount: 4,
      slidesCount: 7,
    },
    syllabusTopics: {
      completed: 12,
      total: 20,
    },
    creditHours: 4,
  },
  {
    id: 'subj-dbms-310',
    code: 'CS-310',
    name: 'Database Management Systems',
    instructor: 'Dr. Priya Sharma',
    instructorEmail: 'p.sharma@cs.university.edu',
    room: 'Babbage Hall 301',
    color: '#DB2777',
    accentGradient: 'from-rose-500/20 to-pink-500/20',
    nextExamDate: '2026-10-06T09:30:00.000Z',
    nextExamTitle: 'Mid-Term Theory & SQL Assessment',
    daysUntilExam: 16,
    examType: 'Mid-Term',
    readinessScore: 74,
    resources: {
      notesCount: 13,
      labsCount: 7,
      pastPapersCount: 4,
      slidesCount: 10,
    },
    syllabusTopics: {
      completed: 17,
      total: 24,
    },
    creditHours: 3,
  },
];

export const mockDeadlines: Deadline[] = [
  {
    id: 'dl-1',
    title: 'Kernel Process Scheduling & Semaphore Lab',
    subjectId: 'subj-os-301',
    subjectCode: 'CS-301',
    subjectName: 'Operating Systems',
    type: 'lab_report',
    dueDate: '2026-09-21T18:29:00.000Z',
    urgencyLevel: 'urgent',
    weightPercentage: 10,
    status: 'in_progress',
    points: 100,
    description: 'Submit C implementation of Priority Inversion avoidance and round-robin scheduler tests.',
  },
  {
    id: 'dl-2',
    title: 'Advanced Graph Theory & Max-Flow Quiz',
    subjectId: 'subj-dsa-204',
    subjectCode: 'CS-204',
    subjectName: 'Data Structures & Algorithms',
    type: 'quiz',
    dueDate: '2026-09-22T08:00:00.000Z',
    urgencyLevel: 'urgent',
    weightPercentage: 5,
    status: 'pending',
    points: 50,
    description: '30-minute timed quiz covering Dinic algorithm and bipartite matching.',
  },
  {
    id: 'dl-3',
    title: 'CS-301 End-Term Comprehensive Exam',
    subjectId: 'subj-os-301',
    subjectCode: 'CS-301',
    subjectName: 'Operating Systems',
    type: 'exam',
    dueDate: '2026-09-23T09:00:00.000Z',
    urgencyLevel: 'soon',
    weightPercentage: 35,
    status: 'pending',
    points: 100,
    description: 'Comprehensive 3-hour theoretical exam covering units 1 through 5.',
  },
  {
    id: 'dl-4',
    title: 'Packet Tracer Multi-Area OSPF Configuration',
    subjectId: 'subj-cn-305',
    subjectCode: 'CS-305',
    subjectName: 'Computer Networks',
    type: 'assignment',
    dueDate: '2026-09-25T17:00:00.000Z',
    urgencyLevel: 'soon',
    weightPercentage: 10,
    status: 'pending',
    points: 75,
    description: 'Configure Area 0 backbone and stub areas with VLSM addressing schemes.',
  },
  {
    id: 'dl-5',
    title: 'B+ Tree Indexing & Query Optimizer Project',
    subjectId: 'subj-dbms-310',
    subjectCode: 'CS-310',
    subjectName: 'Database Management Systems',
    type: 'project',
    dueDate: '2026-09-29T23:59:00.000Z',
    urgencyLevel: 'normal',
    weightPercentage: 15,
    status: 'pending',
    points: 120,
    description: 'Milestone 2: Implementing split/merge disk buffer nodes in Java or C++.',
  },
  {
    id: 'dl-6',
    title: 'Orthogonal Projections & SVD Problem Set',
    subjectId: 'subj-la-220',
    subjectCode: 'MATH-220',
    subjectName: 'Linear Algebra & Probability',
    type: 'assignment',
    dueDate: '2026-10-02T12:00:00.000Z',
    urgencyLevel: 'normal',
    weightPercentage: 10,
    status: 'pending',
    points: 80,
    description: 'Solve problem set 6 covering singular value decomposition and least-squares fits.',
  },
];

export const mockStudyMilestones: StudyMilestone[] = [
  {
    id: 'ms-1',
    title: 'Master Page Replacement Algorithms (FIFO, LRU, Optimal Clock)',
    subjectCode: 'CS-301',
    dueDate: 'Today',
    completed: true,
    estimatedMinutes: 45,
    priority: 'high',
    relatedExamId: 'subj-os-301',
    topicTag: 'Virtual Memory',
  },
  {
    id: 'ms-2',
    title: "Solve 2024 OS End-Term Section B (Banker's Algorithm & Deadlock Avoidance)",
    subjectCode: 'CS-301',
    dueDate: 'Today',
    completed: false,
    estimatedMinutes: 60,
    priority: 'high',
    relatedExamId: 'subj-os-301',
    topicTag: 'Past Papers',
  },
  {
    id: 'ms-3',
    title: 'Implement Dijkstra vs Bellman-Ford negative cycle edge checks',
    subjectCode: 'CS-305',
    dueDate: 'Today',
    completed: false,
    estimatedMinutes: 30,
    priority: 'medium',
    relatedExamId: 'subj-cn-305',
    topicTag: 'Routing Protocols',
  },
];

export const mockWarRoomResources: Resource[] = [
  {
    id: 'res-os-formula',
    title: 'Virtual Memory, TLB Hit Rates & Disk Scheduling Formulas',
    type: 'formula_sheet',
    subjectId: 'subj-os-301',
    subjectCode: 'CS-301',
    fileSize: '1.4 MB',
    format: 'PDF',
    updatedAt: '2 days ago',
    downloadUrl: '#',
    isStarred: true,
    tags: ['Cheat Sheet', 'Formulas', 'High Yield'],
    unitNumber: 4,
    pageCount: 6,
    tableOfContents: [
      '1. Effective Access Time (EAT) & Inverted Page Tables',
      '2. Two-Level Page Address Translation Bits',
      '3. Clock / Second-Chance Replacement Equations',
      '4. Cylinder Seek Formulas (SCAN vs C-LOOK)',
    ],
    keyConcepts: 'Essential formulas for 30 marks of numerical problems on OS end-term exams.',
  },
  {
    id: 'res-os-pyq-2024',
    title: '2023 & 2024 Solved End-Term Papers with Step-by-Step Marking',
    type: 'past_paper',
    subjectId: 'subj-os-301',
    subjectCode: 'CS-301',
    fileSize: '3.8 MB',
    format: 'PDF',
    updatedAt: '3 days ago',
    downloadUrl: '#',
    isStarred: true,
    tags: ['PYQ', 'Solved', 'End-Term'],
    unitNumber: 3,
    pageCount: 14,
    tableOfContents: [
      'Section A: 10 Compulsory Short Answer Questions',
      "Section B: Banker's Algorithm 5-Process Safe Sequence",
      'Section C: Multi-Level Paging 32-bit vs 64-bit Numerical',
      'Section D: Dining Philosophers Deadlock Solution in C',
    ],
    keyConcepts: 'Full step-by-step marking rubrics showing points awarded for partial steps.',
  },
  {
    id: 'res-os-summary',
    title: 'Concurrency, Semaphores & Critical Section Summary Deck',
    type: 'cheatsheet',
    subjectId: 'subj-os-301',
    subjectCode: 'CS-301',
    fileSize: '2.1 MB',
    format: 'PDF',
    updatedAt: 'Yesterday',
    downloadUrl: '#',
    isStarred: false,
    tags: ['Core Theorems', 'Summary'],
    unitNumber: 2,
    pageCount: 12,
    tableOfContents: [
      '1. Mutual Exclusion, Progress, Bounded Waiting Proofs',
      "2. Peterson's Algorithm Register Proof",
      '3. Counting Semaphores using Mutex and Condition Variables',
    ],
  },
];

export const mockSTEMCodeResources: Resource[] = [
  {
    id: 'res-code-bankers',
    title: "bankers_algorithm.py — Deadlock Avoidance Safety Engine",
    type: 'code',
    subjectId: 'subj-os-301',
    subjectCode: 'CS-301',
    fileSize: '4.2 KB',
    format: 'PY',
    language: 'python',
    updatedAt: '3 days ago',
    isStarred: true,
    tags: ['Deadlock', 'Python', 'Unit 3', 'Lab Code'],
    unitNumber: 3,
    complexity: 'O(m * n^2)',
    keyConcepts: 'Calculates Need matrix = Max - Allocation. Iteratively finds process where Need <= Work, executes, releases allocation until safe sequence is found or deadlock declared.',
    codeSnippet: `"""
Banker's Algorithm for Deadlock Avoidance
CS-301: Operating Systems Theory & Lab
Computes safe execution sequence for n processes and m resources.
"""

def is_safe_state(available, max_m, alloc):
    n = len(alloc)     # Number of processes
    m = len(available) # Number of resource types

    # 1. Compute Need Matrix: Need[i][j] = Max[i][j] - Alloc[i][j]
    need = [[max_m[i][j] - alloc[i][j] for j in range(m)] for i in range(n)]

    work = available.copy()
    finish = [False] * n
    safe_seq = []

    # 2. Find process P_i such that finish[i] == False and need[i] <= work
    while len(safe_seq) < n:
        found = False
        for i in range(n):
            if not finish[i] and all(need[i][j] <= work[j] for j in range(m)):
                # Simulate resource release
                for j in range(m):
                    work[j] += alloc[i][j]
                finish[i] = True
                safe_seq.append(f"P{i}")
                found = True
                break

        if not found:
            return False, [] # Unsafe state detected

    return True, safe_seq

# Test case matching 2024 End-Term Section B question
if __name__ == "__main__":
    alloc = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]]
    max_m = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]]
    avail = [3, 3, 2]

    safe, seq = is_safe_state(avail, max_m, alloc)
    print(f"System Safe: {safe}")
    print(f"Safe Execution Sequence: {' -> '.join(seq)}")
`,
  },
  {
    id: 'res-code-dijkstra',
    title: 'dijkstra_routing.cpp — Priority Queue OSPF Shortest Path',
    type: 'code',
    subjectId: 'subj-cn-305',
    subjectCode: 'CS-305',
    fileSize: '5.6 KB',
    format: 'CPP',
    language: 'cpp',
    updatedAt: '5 days ago',
    isStarred: true,
    tags: ['Routing', 'C++', 'OSPF', 'Algorithms'],
    unitNumber: 2,
    complexity: 'O((V + E) log V)',
    keyConcepts: 'Single-source shortest path algorithm using std::priority_queue with min-heap for OSPF link-state routing table construction.',
    codeSnippet: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

typedef pair<int, int> pii; // {distance, vertex}

// Computes shortest path from source router in OSPF area
vector<int> dijkstra(int n, const vector<vector<pii>>& adj, int src) {
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    vector<int> dist(n, 1e9);

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;

            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}

int main() {
    int routers = 5;
    vector<vector<pii>> network(routers);
    network[0].push_back({1, 10}); // Router 0 -> 1 cost 10
    network[0].push_back({2, 5});  // Router 0 -> 2 cost 5
    network[2].push_back({1, 3});  // Router 2 -> 1 cost 3
    network[1].push_back({3, 1});  // Router 1 -> 3 cost 1

    auto costs = dijkstra(routers, network, 0);
    cout << "Cost to Router 3: " << costs[3] << endl;
    return 0;
}
`,
  },
  {
    id: 'res-code-btree',
    title: 'schema_indexing_joins.sql — B+ Tree Indexing & Hash Joins',
    type: 'code',
    subjectId: 'subj-dbms-310',
    subjectCode: 'CS-310',
    fileSize: '3.1 KB',
    format: 'SQL',
    language: 'sql',
    updatedAt: '1 week ago',
    isStarred: false,
    tags: ['DBMS', 'SQL', 'B+ Tree', 'Performance'],
    unitNumber: 3,
    complexity: 'O(log_B N) index lookup',
    keyConcepts: 'Creates composite non-clustered index to avoid full table scans, demonstrates EXPLAIN ANALYZE cost differences between Nested Loop and Hash Join.',
    codeSnippet: `-- CS-310 DBMS: Performance Optimization & Query Tuning
-- Compares Index Scan vs Sequential Table Scan

-- 1. Create student course registry table
CREATE TABLE student_registrations (
    registration_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    course_code VARCHAR(10) NOT NULL,
    term_gpa NUMERIC(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create B+ Tree Index for O(log N) lookup
CREATE INDEX idx_student_course_btree 
ON student_registrations (course_code, term_gpa DESC);

-- 3. Query Plan analysis with index utilization
EXPLAIN ANALYZE
SELECT student_id, term_gpa
FROM student_registrations
WHERE course_code = 'CS-301' AND term_gpa >= 3.50;
`,
  },
  {
    id: 'res-code-clock',
    title: 'page_replacement_clock.c — Second-Chance Clock Algorithm',
    type: 'code',
    subjectId: 'subj-os-301',
    subjectCode: 'CS-301',
    fileSize: '4.8 KB',
    format: 'C',
    language: 'c',
    updatedAt: '4 days ago',
    isStarred: true,
    tags: ['C', 'Paging', 'Virtual Memory', 'Unit 4'],
    unitNumber: 4,
    complexity: 'O(N) worst case sweep',
    keyConcepts: 'Circular linked buffer simulation with reference bit check. If bit is 1, reset to 0 and advance clock pointer; if 0, replace victim frame.',
    codeSnippet: `/* Second-Chance (Clock) Page Replacement Algorithm
 * CS-301 Operating Systems Lab
 */
#include <stdio.h>
#include <stdbool.h>

#define FRAMES 4

typedef struct {
    int page_num;
    bool ref_bit;
} Frame;

int clock_page_replacement(int pages[], int n) {
    Frame memory[FRAMES];
    for (int i = 0; i < FRAMES; i++) {
        memory[i].page_num = -1;
        memory[i].ref_bit = false;
    }

    int pointer = 0;
    int page_faults = 0;

    for (int i = 0; i < n; i++) {
        int current_page = pages[i];
        bool found = false;

        // Check if page hit
        for (int j = 0; j < FRAMES; j++) {
            if (memory[j].page_num == current_page) {
                memory[j].ref_bit = true;
                found = true;
                break;
            }
        }

        if (!found) {
            page_faults++;
            // Clock sweep for victim
            while (memory[pointer].ref_bit) {
                memory[pointer].ref_bit = false;
                pointer = (pointer + 1) % FRAMES;
            }
            // Replace frame at pointer
            memory[pointer].page_num = current_page;
            memory[pointer].ref_bit = true;
            pointer = (pointer + 1) % FRAMES;
        }
    }
    return page_faults;
}
`,
  },
];

export const mockAllResources: Resource[] = [
  ...mockWarRoomResources,
  ...mockSTEMCodeResources,
  {
    id: 'res-dsa-1',
    title: 'Graph Algorithms Complexity & Master Theorem Cheat Sheet',
    type: 'formula_sheet',
    subjectId: 'subj-dsa-204',
    subjectCode: 'CS-204',
    fileSize: '1.8 MB',
    format: 'PDF',
    updatedAt: '4 days ago',
    isStarred: true,
    tags: ['Cheat Sheet', 'DSA', 'Formulas'],
    unitNumber: 2,
    pageCount: 8,
    tableOfContents: [
      '1. Master Theorem 3 Cases Proof',
      '2. Graph Traversal: BFS vs DFS Space-Time Bound',
      '3. Strongly Connected Components (Tarjan vs Kosaraju)',
    ],
  },
  {
    id: 'res-la-1',
    title: 'Eigenvalues, SVD & Orthogonality Core Problem Set Solutions',
    type: 'past_paper',
    subjectId: 'subj-la-220',
    subjectCode: 'MATH-220',
    fileSize: '3.1 MB',
    format: 'PDF',
    updatedAt: '1 week ago',
    isStarred: false,
    tags: ['Solutions', 'Math', 'PYQ'],
    unitNumber: 4,
    pageCount: 16,
    tableOfContents: [
      'Problem 1: Characteristic Polynomial Roots',
      'Problem 2: Gram-Schmidt Orthonormalization',
      'Problem 3: Singular Value Decomposition (U Sigma V^T)',
    ],
  },
  {
    id: 'res-dbms-1',
    title: 'SQL B+ Tree Storage Engine Architecture Reference',
    type: 'note',
    subjectId: 'subj-dbms-310',
    subjectCode: 'CS-310',
    fileSize: '2.4 MB',
    format: 'PDF',
    updatedAt: '5 days ago',
    isStarred: true,
    tags: ['DBMS', 'Architecture', 'Notes'],
    unitNumber: 3,
    pageCount: 10,
    tableOfContents: [
      '1. Disk Page Layout and Slotted Pages',
      '2. B+ Tree Internal vs Leaf Node Fanout',
      '3. Write-Ahead Logging (WAL) and ARIES Recovery Protocol',
    ],
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Approaching Deadline Alert',
    message: 'OS Kernel Submission is due in 18 hours. 1 task remaining.',
    timeAgo: '15 mins ago',
    type: 'urgent',
    category: 'deadline',
    isRead: false,
    actionLabel: 'Review Submission',
    actionHref: '/#deadlines',
  },
  {
    id: 'notif-2',
    title: 'Roadmap Phase Shift',
    message: 'Data Structures has entered Phase 2 (Practice Problems). Click to view your assigned exercises.',
    timeAgo: '1 hour ago',
    type: 'info',
    category: 'roadmap',
    isRead: false,
    actionLabel: 'View Exercises',
    actionHref: '/war-room/subj-dsa-204',
  },
  {
    id: 'notif-3',
    title: 'Weak Spot Warning',
    message: 'Operating Systems exam is in 3 days. 3 topics are still marked Untouched in Memory Management.',
    timeAgo: '2 hours ago',
    type: 'urgent',
    category: 'weak_spot',
    isRead: false,
    actionLabel: 'Enter War Room',
    actionHref: '/war-room/subj-os-301',
  },
  {
    id: 'notif-4',
    title: 'Study Streak Milestone',
    message: "You've maintained your daily revision streak for 14 consecutive days! Excellent consistency.",
    timeAgo: 'Yesterday',
    type: 'success',
    category: 'system',
    isRead: true,
  },
];

export const mockInitialRoadmaps: ExamRoadmap[] = [
  {
    id: 'roadmap-os-301',
    subjectId: 'subj-os-301',
    subjectCode: 'CS-301',
    subjectName: 'Operating Systems',
    examDate: '2026-09-23T09:00:00.000Z',
    targetLevel: 'full_review',
    completedTasksCount: 4,
    totalTasksCount: 9,
    phases: [
      {
        id: 'phase-1',
        phaseNumber: 1,
        title: 'Phase 1: Foundation Pass',
        daysRange: 'Days T-3 (Day 1)',
        focusDescription: 'Review core concepts, process transitions, and virtual memory address translations.',
        tasks: [
          {
            id: 'task-1-1',
            title: "Review Peterson's Algorithm proof and Critical Section criteria",
            completed: true,
            estimatedHours: 1.5,
            type: 'concept',
            unitReference: 'Unit 2',
          },
          {
            id: 'task-1-2',
            title: 'Study Multi-Level Paging address bit breakdown (p1, p2, d)',
            completed: true,
            estimatedHours: 2.0,
            type: 'formula',
            unitReference: 'Unit 4',
          },
          {
            id: 'task-1-3',
            title: "Memorize Coffman's 4 Necessary Conditions for Deadlocks",
            completed: true,
            estimatedHours: 1.0,
            type: 'concept',
            unitReference: 'Unit 3',
          },
        ],
      },
      {
        id: 'phase-2',
        phaseNumber: 2,
        title: 'Phase 2: Active Practice',
        daysRange: 'Days T-2 (Day 2)',
        focusDescription: 'Algorithm implementations, Banker matrix calculations & Second-Chance Clock simulations.',
        tasks: [
          {
            id: 'task-2-1',
            title: "Solve 2 Banker's Algorithm Safe State numeric allocation matrices",
            completed: true,
            estimatedHours: 2.5,
            type: 'pyq',
            unitReference: 'Unit 3',
          },
          {
            id: 'task-2-2',
            title: 'Simulate LRU vs Clock page replacement with reference string',
            completed: false,
            estimatedHours: 2.0,
            type: 'code',
            unitReference: 'Unit 4',
          },
          {
            id: 'task-2-3',
            title: 'Implement Producer-Consumer bounded buffer using Semaphores',
            completed: false,
            estimatedHours: 2.0,
            type: 'code',
            unitReference: 'Unit 2',
          },
        ],
      },
      {
        id: 'phase-3',
        phaseNumber: 3,
        title: 'Phase 3: Exam Simulation',
        daysRange: 'Days T-1 (Final Sprint)',
        focusDescription: 'Timed past paper trials, formula sheet speed review & weak spots elimination.',
        tasks: [
          {
            id: 'task-3-1',
            title: 'Solve 2023 End-Term Comprehensive Exam under 2-hour timed conditions',
            completed: false,
            estimatedHours: 2.0,
            type: 'pyq',
            unitReference: 'All Units',
          },
          {
            id: 'task-3-2',
            title: 'Formula Speed Review: EAT hit ratios, Disk Seek (SCAN/C-LOOK)',
            completed: false,
            estimatedHours: 1.5,
            type: 'formula',
            unitReference: 'Unit 4 & 5',
          },
          {
            id: 'task-3-3',
            title: 'Verify all Untouched (🔴) topics in Syllabus Matrix are elevated to Mastered (🟢)',
            completed: false,
            estimatedHours: 1.0,
            type: 'concept',
            unitReference: 'Weak Spots',
          },
        ],
      },
    ],
  },
];
