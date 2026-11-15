# GapFinder AI — End-to-End Technical Architecture & System Documentation

> **Project Mission:** Find What the Student Doesn’t Know (Diagnosis, Not Just Answers).  
> **Core Concept:** A diagnostic EdTech platform that ingests syllabus, lecture notes, and past exams to discover student weaknesses, assign citation-grounded diagnostic quizzes, and generate adaptive revision schedules.

---

## 1. System Overview & Architecture Paradigm

GapFinder AI transforms the standard study model from **passive answering** to **proactive diagnosis**:

```
 ┌──────────────────────┐
 │  Student Course Data │ (Syllabus PDF, Lecture Notes, Past Question Papers)
 └──────────┬───────────┘
            │
            ▼ [Client-Side Extraction: pdfjs-dist]
 ┌─────────────────────────────────────────────────────────┐
 │ 1. Ingestion Pipeline (/api/ingest)                     │
 │    • Hierarchical syllabus breakdown                    │
 │    • Exam weightage estimation (past paper frequencies) │
 │    • Semantic chunking with verbatim citations          │
 └──────────┬──────────────────────────────────────────────┘
            │
            ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 2. Diagnostic Quiz Engine (/api/quiz)                   │
 │    • Proportional question allocation per weightage     │
 │    • Citation-grounded MCQs via Groq gpt-oss-120b       │
 │    • Distractors mapped to common conceptual traps      │
 └──────────┬──────────────────────────────────────────────┘
            │
            ▼ [Student Submits Answers]
 ┌─────────────────────────────────────────────────────────┐
 │ 3. Evaluation & Clinical Diagnosis (/api/evaluate)      │
 │    • Topic mastery scoring                              │
 │    • Vulnerability classification (🔴 Weak / 🟡 Med / 🟢)│
 │    • Misconception explanation                          │
 │    • 5-Day / 2-Hour adaptive schedule generation        │
 └──────────┬──────────────────────────────────────────────┘
            │
            ▼
 ┌─────────────────────────────────────────────────────────┐
 │ 4. Multi-Turn AI Tutor & Hybrid RAG (/api/chat)         │
 │    • Notes chunk retrieval (searchUploadedNotes)        │
 │    • Live Web knowledge tool (searchWeb)                │
 │    • Groq streaming output parsed via ReactMarkdown     │
 └─────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack & Frameworks

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `14.2.24` | Full-stack serverless framework, API endpoints, React Server Components. |
| **Language** | TypeScript | `^5.7.3` | End-to-end static typing and contracts. |
| **UI & Styling** | Tailwind CSS + Typography | `3.4.17` | Utility-first responsive styling and typography markdown rendering. |
| **Icons** | Lucide React | `0.475.0` | Modern, clean iconography. |
| **AI Inference** | Groq Cloud Platform | `openai/gpt-oss-120b` | High-speed LLM inference (~250–300 tokens/sec) for quizzes, evaluations, and tutor streaming. |
| **Fallback LLM** | Groq Cloud Platform | `openai/gpt-oss-20b` | Fallback model in case of rate limit or quota spikes. |
| **AI Orchestration** | Vercel AI SDK | `ai@4.1.45`, `@ai-sdk/groq` | Streaming chat, tool-calling pipelines, structured schema validation. |
| **Document Parser** | `pdfjs-dist` | `3.11.174` | Local browser-side PDF text extraction without uploading documents to a server. |
| **Markdown Parser**| `react-markdown` + `remark-gfm` | `10.1.0` / `4.0.1` | Renders LLM markdown stream into styled tables, bold text, and formulas. |
| **Validation** | Zod | `3.24.2` | Runtime schema validation for API payloads and tool definitions. |

---

## 3. Database & State Architecture

### Why No Heavy SQL/NoSQL Database?
GapFinder AI was deliberately designed as a **privacy-first, stateless edge architecture**:
1. **Zero Data Retention Liability:** Students' private textbooks, course notes, and exam papers are extracted **in-browser on the client side** using `pdfjs-dist`. Raw PDF files never touch external disks or third-party databases.
2. **Session Persistence:** State (`topics`, `chunks`, `quiz`, `gapReport`, `revisionPlan`) is maintained in client React state and session cache.
3. **Stateless Scalability:** This allows GapFinder AI to be deployed on **Vercel Serverless Free Tier** with `<100MB RAM`, zero cold-start database connection penalties, and instantaneous response times.

---

## 4. End-to-End File Breakdown

### Root Configuration
- **`package.json`**: Defines dependencies, build commands (`next build`), and runtime requirements.
- **`requirements.txt`**: Standardized environment specification for evaluators and Python tooling.
- **`tailwind.config.js`**: Custom color palette, including diagnostic badges:
  - 🔴 Weak (`#EF4444`, bg: `#FEF2F2`)
  - 🟡 Medium (`#F59E0B`, bg: `#FFFBEB`)
  - 🟢 Strong (`#10B981`, bg: `#F0FDF4`)
- **`next.config.js`**: Configures webpack canvas aliasing for `pdfjs-dist` execution in Next.js.
- **`.env.local`**: Stores `GROQ_API_KEY` securely.

---

### Library Core (`/lib`)

#### `lib/groq.ts`
- Initializes the Groq client via `@ai-sdk/groq`.
- Configures `GROQ_MODEL = "openai/gpt-oss-120b"` with an automatic fallback mechanism to `"openai/gpt-oss-20b"` if quota or endpoint errors occur.

#### `lib/types.ts`
Defines the strict TypeScript interfaces across the entire platform:
- `Topic`: ID, title, description, exam weightage (`high` | `medium` | `low`), estimated percentage, subtopics.
- `DocumentChunk`: Text passage, document title, section header, page or slide number.
- `QuizQuestion`: Question text, 4 choices, correct answer index, explanation, verbatim citation (`sourceDoc`, `section`, `pageOrSlide`, `exactQuote`).
- `GapReport`: Topics categorized into `weakTopics`, `mediumTopics`, `strongTopics`, and overall vulnerability index.
- `RevisionPlan`: 5-day schedule items with time allotments based on weightage and weakness.

#### `lib/pdfExtractor.ts`
- Uses `pdfjs-dist/legacy/build/pdf` on the browser main thread.
- Iterates page by page, extracts text streams, and maps raw text into chunk objects tagged with document titles and page numbers.

#### `lib/cleanText.ts`
- Cleans and normalizes LLM outputs.
- Converts raw LaTeX delimiters (`\[ ... \]`, `\frac{...}{...}`) into human-readable math symbols (`×`, `·`, `→`, `Δ`).
- Strips unicode spacing glitches to ensure responses match ChatGPT/Gemini quality.

#### `lib/webSearch.ts`
- External knowledge tool for the AI tutor.
- When students ask about concepts outside their uploaded notes, it queries reliable educational summaries to enrich explanations.

#### `lib/rag/retriever.ts`
- Token-based lexical and keyword retrieval engine.
- Filters and ranks chunks based on question queries and active topic tags.

#### `lib/rag/sampleData.ts`
- High-yield preloaded curriculum on **Cell Biology & Molecular Genetics**.
- Contains 12 detailed subtopics, 10 notes chunks, and citation-backed exam questions for 1-click evaluation without file uploads.

---

### API Endpoints (`/app/api`)

#### 1. Ingestion Route: `app/api/ingest/route.ts`
- **Method:** `POST`
- **Input:** `{ syllabusText, notesText, examPapersText }`
- **Working:**
  1. Assembles syllabus and past paper extracts.
  2. Prompts Groq 120B with strict JSON output schemas.
  3. Extracts a clean Topic Map, assigns exam weightages (e.g. 35% for Genetics), and splits text into structured `DocumentChunk` records with section citations.
- **Output:** `{ topics: Topic[], chunks: DocumentChunk[] }`

#### 2. Quiz Generator Route: `app/api/quiz/route.ts`
- **Method:** `POST`
- **Input:** `{ topics: Topic[], chunks: DocumentChunk[], questionCount: number }`
- **Working:**
  1. Allocates questions proportionally according to topic exam weightages.
  2. For each topic, retrieves relevant chunks.
  3. Prompts the LLM to generate multiple-choice questions grounded strictly in the provided text.
  4. Requires exact verbatim citations (`sourceDoc`, `section`, `exactQuote`).
- **Output:** `{ questions: QuizQuestion[] }`

#### 3. Evaluation Route: `app/api/evaluate/route.ts`
- **Method:** `POST`
- **Input:** `{ questions: QuizQuestion[], userAnswers: Record<string, number>, topics: Topic[] }`
- **Working:**
  1. Grades answers against ground-truth keys.
  2. Calculates topic mastery percentages.
  3. Classifies topics:
     - 🔴 Weak: `< 50%`
     - 🟡 Medium: `50% - 75%`
     - 🟢 Strong: `> 75%`
  4. Generates clinical diagnostic reasoning explaining the exact misconception.
  5. Computes the adaptive 5-day / 2-hour schedule using:
     $$\text{Priority} = (100 - \text{Mastery}) \times \text{Exam Weightage}$$
- **Output:** `{ gapReport: GapReport, revisionPlan: RevisionPlan }`

#### 4. Streaming Tutor Route: `app/api/chat/route.ts`
- **Method:** `POST` (Streaming)
- **Input:** `{ messages, chunks, activeTopicId, activeTopicName }`
- **Working:**
  1. Establishes a multi-turn conversation stream using `streamText` from the Vercel AI SDK.
  2. Equips the model with two live tools:
     - `searchUploadedNotes`: Queries student notes for relevant passages.
     - `searchWeb`: Fetches external context for out-of-syllabus questions.
  3. Formats responses using natural, conversational prose without raw code dumps.
- **Output:** Server-Sent Events (SSE) data stream.

---

### User Interface Components (`/components` & `/app`)

- **`app/page.tsx`**: Landing page introducing GapFinder AI with interactive feature spotlights and direct guest onboarding.
- **`app/login/page.tsx`**: Clean authentication page offering credential login or instant **"Continue as Guest"** access.
- **`app/dashboard/page.tsx`**: The main command center connecting all widgets: Upload Zone, Topic Map Tree, Diagnostic Quiz, Gap Report, Revision Planner, and AI Tutor Drawer.
- **`components/Navbar.tsx`**: Header with brand identity ("Bridge Your Gap"), "Ask AI Tutor" button, and "Load Demo Exam".
- **`components/UploadZone.tsx`**: Drag-and-drop zone with client-side PDF parsing and progress indicators.
- **`components/TopicMapTree.tsx`**: Visual hierarchy showing syllabus topics with weightage badges.
- **`components/DiagnosticQuiz.tsx`**: Interactive quiz interface displaying live citation snippets and explanations.
- **`components/GapReportCard.tsx`**: Diagnostic breakdown cards (🔴/🟡/🟢) with 1-click "Explain Topic" action triggers.
- **`components/RevisionPlanner.tsx`**: Adaptive 5-day study calendar prioritizing weak high-yield topics.
- **`components/ExplainDrawer.tsx`**: Slide-out tutor chat powered by `useChat` and `ReactMarkdown` with custom Tailwind component styling.

---

## 5. Deployment Guide (Vercel)

1. **Repository:** Pushed to GitHub.
2. **Environment Variable:** Set `GROQ_API_KEY` on Vercel.
3. **Execution Mode:** Serverless edge execution with zero server state requirements.
