import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('Clearing existing records...');
  // Delete in cascade order
  await prisma.roadmapMilestone.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.deadline.deleteMany({});
  await prisma.syllabusTopic.deleteMany({});
  await prisma.syllabusUnit.deleteMany({});
  await prisma.subject.deleteMany({});

  console.log('Seeding courses...');

  // 1. Operating Systems (CS-301)
  const osExamDate = new Date(Date.now() + 3.5 * 86400000); // 3.5 days from now
  const os = await prisma.subject.create({
    data: {
      code: 'CS-301',
      name: 'Operating Systems',
      instructor: 'Dr. Aris Thorne',
      examDate: osExamDate,
      color: 'indigo',
      units: {
        create: [
          {
            unitNumber: 1,
            title: 'Unit 1: Process Synchronization & Concurrency',
            topics: {
              create: [
                { title: 'Critical Section Problem & Race Conditions', status: 'MASTERED' },
                { title: "Peterson's Algorithm & Hardware Synchronization (TSL)", status: 'MASTERED' },
                { title: 'Counting & Binary Semaphores Implementation', status: 'MASTERED' },
                { title: 'Classic Concurrency: Producer-Consumer & Bounded Buffer', status: 'IN_PROGRESS' },
                { title: 'Dining Philosophers Problem & Monitor Abstraction', status: 'UNTOUCHED' },
              ],
            },
          },
          {
            unitNumber: 2,
            title: 'Unit 2: Memory Management & Virtual Memory',
            topics: {
              create: [
                { title: 'Paging Architecture, Frame Tables & Hardware TLB', status: 'MASTERED' },
                { title: 'Multi-Level Paging & Inverted Page Tables', status: 'IN_PROGRESS' },
                { title: 'Virtual Memory, Demand Paging & Page Fault Handling', status: 'MASTERED' },
                { title: 'Page Replacement Algorithms (FIFO, Optimal, LRU, Clock)', status: 'IN_PROGRESS' },
                { title: 'Thrashing, Working Set Model & Page Fault Frequency', status: 'UNTOUCHED' },
              ],
            },
          },
          {
            unitNumber: 3,
            title: 'Unit 3: Deadlocks & Resource Allocation',
            topics: {
              create: [
                { title: 'Deadlock Necessary Conditions (Coffman Conditions)', status: 'MASTERED' },
                { title: 'Resource Allocation Graph (RAG) & Cycle Detection', status: 'MASTERED' },
                { title: "Banker's Algorithm: Safety & Resource Request", status: 'IN_PROGRESS' },
                { title: 'Deadlock Detection, Prevention & Recovery Strategies', status: 'UNTOUCHED' },
              ],
            },
          },
          {
            unitNumber: 4,
            title: 'Unit 4: File Systems & Mass Storage',
            topics: {
              create: [
                { title: 'File System Mounting, Inodes & Directory Structures', status: 'IN_PROGRESS' },
                { title: 'Disk Arm Scheduling: FCFS, SSTF, SCAN, C-LOOK', status: 'MASTERED' },
                { title: 'RAID Architectures (Levels 0, 1, 5, 6, 10)', status: 'UNTOUCHED' },
              ],
            },
          },
        ],
      },
      deadlines: {
        create: [
          {
            title: 'Lab 4: Virtual Memory & Page Replacement in C',
            type: 'assignment',
            dueDate: new Date(Date.now() + 36 * 3600000), // in 36 hours (<48h urgent)
            status: 'pending',
          },
          {
            title: 'End-Term Theory Assessment',
            type: 'exam',
            dueDate: osExamDate, // in 3.5 days
            status: 'pending',
          },
          {
            title: 'Problem Set 5: Banker’s Algorithm Safety Matrices',
            type: 'assignment',
            dueDate: new Date(Date.now() + 6 * 86400000), // in 6 days
            status: 'pending',
          },
        ],
      },
      resources: {
        create: [
          {
            title: "Banker's Algorithm Deadlock Safety Simulation",
            fileType: 'code',
            fileUrl: '/code/bankers_algorithm.py',
            fileSize: '1.4 MB',
            unitNumber: 3,
            isStarred: true,
          },
          {
            title: 'Clock (Second-Chance) Page Replacement Simulator',
            fileType: 'code',
            fileUrl: '/code/page_replacement_clock.c',
            fileSize: '890 KB',
            unitNumber: 2,
            isStarred: true,
          },
          {
            title: 'OS End-Term Formula & Disk Bounds Sheet',
            fileType: 'formula_sheet',
            fileUrl: '/docs/os_formulas.pdf',
            fileSize: '620 KB',
            unitNumber: 1,
            isStarred: true,
          },
          {
            title: '2024 University End-Term Solved Paper',
            fileType: 'past_paper',
            fileUrl: '/docs/os_pyq_2024.pdf',
            fileSize: '3.1 MB',
            unitNumber: 4,
            isStarred: false,
          },
        ],
      },
      milestones: {
        create: [
          { phase: 1, title: "Review Peterson's Solution and Semaphore Definitions", isCompleted: true },
          { phase: 1, title: 'Verify Inode File Structure Layout & Framing', isCompleted: true },
          { phase: 1, title: 'Identify all red untouched topics in the matrix', isCompleted: false },
          { phase: 2, title: "Trace Banker's Algorithm with 5 processes & 3 resources", isCompleted: false },
          { phase: 2, title: 'Complete Clock Page Replacement Simulation in C', isCompleted: false },
          { phase: 2, title: 'Elevate at least 3 untouched topics to in-progress', isCompleted: false },
          { phase: 3, title: 'Attempt 2024 University full-length question paper', isCompleted: false },
          { phase: 3, title: 'Execute 15-minute formula speed recall without notes', isCompleted: false },
          { phase: 3, title: 'Verify final exam readiness gauge reaches 85%+', isCompleted: false },
        ],
      },
    },
  });

  // 2. Data Structures & Algorithms (CS-204)
  const dsaExamDate = new Date(Date.now() + 12 * 86400000); // 12 days
  const dsa = await prisma.subject.create({
    data: {
      code: 'CS-204',
      name: 'Data Structures & Algorithms',
      instructor: 'Prof. Elena Rostova',
      examDate: dsaExamDate,
      color: 'emerald',
      units: {
        create: [
          {
            unitNumber: 1,
            title: 'Unit 1: Self-Balancing Trees & Heaps',
            topics: {
              create: [
                { title: 'AVL Tree Rotations (LL, RR, LR, RL)', status: 'MASTERED' },
                { title: 'Red-Black Tree Properties & Color Flip Rules', status: 'MASTERED' },
                { title: 'Binary Heaps, Heapify & Priority Queues', status: 'MASTERED' },
              ],
            },
          },
          {
            unitNumber: 2,
            title: 'Unit 2: Graph Algorithms & Traversals',
            topics: {
              create: [
                { title: 'BFS & DFS Traversal Applications', status: 'MASTERED' },
                { title: "Dijkstra's Single Source Shortest Path with Min-Heap", status: 'IN_PROGRESS' },
                { title: 'Bellman-Ford & Negative Weight Cycle Detection', status: 'IN_PROGRESS' },
                { title: "Minimum Spanning Trees: Kruskal's & Prim's", status: 'UNTOUCHED' },
              ],
            },
          },
          {
            unitNumber: 3,
            title: 'Unit 3: Dynamic Programming Paradigms',
            topics: {
              create: [
                { title: '0/1 Knapsack Problem & Memoization Tables', status: 'IN_PROGRESS' },
                { title: 'Longest Common Subsequence (LCS) Optimal Substructure', status: 'UNTOUCHED' },
                { title: 'Matrix Chain Multiplication & Parenthesization', status: 'UNTOUCHED' },
              ],
            },
          },
        ],
      },
      deadlines: {
        create: [
          {
            title: 'Quiz 3: Graph Traversal & Dijkstra Shortest Path',
            type: 'quiz',
            dueDate: new Date(Date.now() + 72 * 3600000), // in 3 days (<5d soon)
            status: 'pending',
          },
          {
            title: 'Contest Problem Bank 4: Dynamic Programming',
            type: 'assignment',
            dueDate: new Date(Date.now() + 8 * 86400000),
            status: 'pending',
          },
        ],
      },
      resources: {
        create: [
          {
            title: "Dijkstra Shortest Path with Priority Queue",
            fileType: 'code',
            fileUrl: '/code/dijkstra_routing.cpp',
            fileSize: '1.1 MB',
            unitNumber: 2,
            isStarred: true,
          },
          {
            title: 'Graph Theory & DP Complexity Master Cheat Sheet',
            fileType: 'formula_sheet',
            fileUrl: '/docs/dsa_cheat_sheet.pdf',
            fileSize: '450 KB',
            unitNumber: 1,
            isStarred: true,
          },
        ],
      },
      milestones: {
        create: [
          { phase: 1, title: 'Review AVL Tree Rotation Invariants', isCompleted: true },
          { phase: 2, title: 'Code Dijkstra using std::priority_queue', isCompleted: false },
          { phase: 3, title: 'Solve 10 LeetCode Medium Graph Problems', isCompleted: false },
        ],
      },
    },
  });

  // 3. Database Management Systems (CS-305)
  const dbmsExamDate = new Date(Date.now() + 19 * 86400000); // 19 days
  const dbms = await prisma.subject.create({
    data: {
      code: 'CS-305',
      name: 'Database Management Systems',
      instructor: 'Dr. Marcus Vance',
      examDate: dbmsExamDate,
      color: 'amber',
      units: {
        create: [
          {
            unitNumber: 1,
            title: 'Unit 1: Relational Algebra & Advanced SQL',
            topics: {
              create: [
                { title: 'Relational Calculus & Set Operations', status: 'MASTERED' },
                { title: 'Correlated Subqueries & Window Functions', status: 'MASTERED' },
                { title: 'Recursive Common Table Expressions (CTEs)', status: 'IN_PROGRESS' },
              ],
            },
          },
          {
            unitNumber: 2,
            title: 'Unit 2: Storage Engines & Index Structures',
            topics: {
              create: [
                { title: 'B+ Tree Index Insertion, Deletion & Splitting', status: 'IN_PROGRESS' },
                { title: 'Hash Indexes vs. Clustered Indexes', status: 'MASTERED' },
                { title: 'Buffer Pool Replacement & LRU-K', status: 'UNTOUCHED' },
              ],
            },
          },
          {
            unitNumber: 3,
            title: 'Unit 3: Transactions & Concurrency Control',
            topics: {
              create: [
                { title: 'ACID Properties & Conflict Serializability', status: 'IN_PROGRESS' },
                { title: 'Two-Phase Locking (2PL) & Deadlock Handling', status: 'UNTOUCHED' },
                { title: 'Write-Ahead Logging (WAL) & ARIES Recovery', status: 'UNTOUCHED' },
              ],
            },
          },
        ],
      },
      deadlines: {
        create: [
          {
            title: 'SQL Query Tuning & B+ Tree Indexing Homework',
            type: 'assignment',
            dueDate: new Date(Date.now() + 96 * 3600000), // in 4 days
            status: 'pending',
          },
          {
            title: 'DBMS Lab Practical Assessment',
            type: 'lab_report',
            dueDate: new Date(Date.now() + 10 * 86400000),
            status: 'pending',
          },
        ],
      },
      resources: {
        create: [
          {
            title: 'B+ Tree Indexing & Hash Join Performance Benchmarks',
            fileType: 'code',
            fileUrl: '/code/schema_indexing_joins.sql',
            fileSize: '950 KB',
            unitNumber: 2,
            isStarred: true,
          },
          {
            title: 'Transactions & Normalization Summary Guide',
            fileType: 'notes',
            fileUrl: '/docs/dbms_transactions.pdf',
            fileSize: '1.8 MB',
            unitNumber: 3,
            isStarred: false,
          },
        ],
      },
      milestones: {
        create: [
          { phase: 1, title: 'Master 2PL & Serializability Precedence Graphs', isCompleted: false },
          { phase: 2, title: 'Benchmark SQL Queries with EXPLAIN ANALYZE', isCompleted: false },
          { phase: 3, title: 'Solve 2023 University DBMS Examination Paper', isCompleted: false },
        ],
      },
    },
  });

  console.log('Seed completed successfully for CS-301, CS-204, CS-305.');
}

async function main() {
  await seedDatabase();
}

const isDirectRun = typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('seed');

if (isDirectRun) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
