# GapFinder AI — Bridge Your Knowledge Gap

GapFinder AI is a diagnostic EdTech platform built to uncover what a student doesn't know. Instead of acting as a passive answer box, it ingests course materials, maps syllabus exam weightages, conducts citation-grounded diagnostic quizzes, visualizes topic vulnerabilities, and builds an adaptive revision calendar.

---

## Key Capabilities

- **Diagnostic Over Answers:** Proactively isolates conceptual gaps instead of waiting for passive student queries.
- **Citation-Backed Verification:** Diagnostic questions and answer keys cite exact source sections and pages.
- **Vulnerability Mapping:** Classifies syllabus topics into **Weak (<50%)**, **Medium (50–75%)**, and **Strong (>75%)** mastery tiers.
- **Adaptive Revision Plan:** Dynamically schedules revision priority using `(100 - Mastery) × Exam Weightage`.
- **Hybrid AI Tutor:** Interactive tutor powered by Groq models (`gpt-oss-120b` / `gpt-oss-20b`) combined with course chunk retrieval and live external web tools.
- **Client-Side Document Parsing:** Ingests syllabus PDFs, notes, and past exams locally via `pdfjs-dist` with zero server document storage.

---

## Tech Stack & Models

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | High-performance React framework for serverless edge and web. |
| **Language & Styling** | TypeScript, Tailwind CSS | Type safety and utility-first responsive UI. |
| **LLM Provider** | Groq Cloud | Ultra-low latency inference engine. |
| **Active Models** | `openai/gpt-oss-120b` (Primary)<br>`openai/gpt-oss-20b` (Fallback) | Clinical diagnostic evaluation, quiz generation, and student coaching. |
| **AI Orchestration** | Vercel AI SDK (`ai`, `@ai-sdk/groq`) | Tool-calling, structured JSON outputs, and streaming chat. |
| **Document Processing** | `pdfjs-dist` (v3.11.174) | Browser-based text and section extraction. |
| **Markdown Rendering** | `react-markdown` + `remark-gfm` | Custom styled typography for equations, tables, and notes. |

---

## Project Structure

```text
├── app/
│   ├── api/
│   │   ├── chat/         # Multi-turn AI tutor route with tool-calling
│   │   ├── evaluate/     # Diagnostic answer scoring and gap categorization
│   │   ├── ingest/       # Syllabus parsing and topic graph extraction
│   │   └── quiz/         # Citation-grounded MCQ generation
│   ├── dashboard/        # Main study dashboard (Topic Map, Quiz, Gap Report, Plan)
│   ├── login/            # Authentication with 1-click Guest access
│   ├── globals.css       # Tailwind base configuration and custom theme tokens
│   └── layout.tsx        # Global app layout
├── components/           # Reusable UI components (Quiz, Drawer, TopicTree, Navbar)
├── lib/
│   ├── rag/              # Ingestion, chunking, and keyword retrieval logic
│   ├── cleanText.ts      # Markdown and formula formatting layer
│   ├── groq.ts           # Groq client initialization with fallback handling
│   ├── pdfExtractor.ts   # Client-side PDF parser
│   ├── types.ts          # Core TypeScript data contracts
│   └── webSearch.ts      # Live web retrieval tool
├── requirements.txt      # Dependency specification reference
├── package.json          # Node.js dependencies and build scripts
└── tailwind.config.js    # UI design system tokens
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18.17.0+`
- **npm**: `v9.0.0+`
- A **Groq API Key** (from [console.groq.com](https://console.groq.com))

### 2. Installation
```bash
git clone https://github.com/pavankalyanbonthu05-byte/GapFinder-AI.git
cd GapFinder-AI
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the project root:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## Testing Without Setup

1. Open the login page and click **"Continue as Guest"**.
2. On the dashboard, click **"Load Demo Exam"** in the top navigation bar.
3. This preloads a complete course on *Cell Biology & Molecular Genetics* with 12 subtopics, exam weightages, practice questions, and notes chunks.

---

## Vercel Deployment

1. Push your repository to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com).
3. Under **Environment Variables**, add:
   - `GROQ_API_KEY`: Your Groq API key
4. Click **Deploy**.
