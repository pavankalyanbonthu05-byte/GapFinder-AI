# GapFinder AI — Find What The Student Doesn't Know

> **Hackathon PS 2026:** Participants build an AI app that takes a student’s syllabus, textbook chapters, notes and past question papers, then finds the student’s weak areas and builds a personalized revision plan. Chat can support the experience, but the main output must be a diagnosis, not just answers.

---

## 🌟 Key Highlights

- **A Doctor for Studying:** Instead of waiting for student questions, GapFinder proactively tests the student, calculates topic-level vulnerability, and prescribes a targeted treatment plan.
- **Strict RAG Grounding:** Every question, answer, and explanation is derived strictly from uploaded materials—with **unforgeable source citations** (Section, Chapter, Page).
- **🔴 🟡 🟢 Gap Analysis Report:** Automatically classifies syllabus topics into Weak (<50%), Medium (50-75%), and Strong (>75%) with clinical AI diagnosis reasoning.
- **Adaptive 5-Day / 2-Hour Plan:** Formulaically prioritizes study time: `(100 - Mastery) × Exam Weightage`. As students re-test and improve, the plan dynamically updates.
- **Explain-This-Topic RAG Assistant:** An embedded tutor powered by Vercel AI SDK and Groq (`llama-3.3-70b-versatile`) that answers exclusively using your uploaded notes.
- **Built for Vercel Free-Tier & Edge:** Stateless, lightning-fast inference (~250 tokens/sec), under 100MB RAM consumption, and zero cold-start bottlenecks.

---

## 🏛️ System Architecture

```
[1. Upload Zone] ──► [2. Ingestion & Topic Graph] ──► [3. Topic Map & Exam Weightage]
 (Syllabus/Notes/Papers)       (Chunking + Metadata)                     │
                                                                         ▼
[6. "Explain Topic" Chat] ◄── [5. Gap Report & Study Plan] ◄── [4. Grounded Diagnostic Quiz]
  (Strict RAG Q&A drawer)       (Weak/Med/Strong + Schedule)     (Citations to source sections)
```

### Where Retrieval is Used vs. Where Generation is Used

| Component | Mechanism | Role |
| :--- | :--- | :--- |
| **Topic Extraction** | Groq (`llama-3.3-70b-versatile`) | Structures raw syllabus and tags past-paper frequencies into a clean Table of Contents. |
| **Material Indexing** | Semantic chunker & Section tagger | Slices notes into chunks with document title, section header, and page numbers. |
| **Diagnostic Quiz** | Lexical & Cosine Retrieval + Groq | Pulls relevant chunks and generates MCQs strictly grounded in retrieved chunks with exact citations. |
| **Gap Diagnosis** | Algorithmic scoring + AI Clinical Reasoning | Computes mastery percentages, assigns 🔴 🟡 🟢 badges, and explains the conceptual misconception. |
| **Adaptive Plan** | Optimization heuristic + Synthesis | Prioritizes `High Exam Frequency × High Weakness` into a 5-day / 2-hr study calendar. |
| **Explain Assistant** | Streaming RAG (`useChat` + `streamText`) | Retrieves chunks and answers student questions strictly with inline citations. |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/pavankalyanbonthu05-byte/GapFinder-AI.git
cd GapFinder-AI
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the project root:
```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demo Credentials for Hackathon Judges

To evaluate without manual setup:
- **Demo Login:** `demo@gapfinder.ai`
- **Password:** `password123`
- Or simply click **"1-Click Hackathon Judge Login"** on the login page.
- In the dashboard, click **"Load Demo Exam"** to preload a full course on *Cell Biology & Molecular Genetics* with 12 subtopics, notes chunks, and citation-backed exam questions.

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: initial release of GapFinder AI diagnostic RAG platform"
   git push -u origin main
   ```
2. Import the repository into [Vercel](https://vercel.com/new).
3. In **Settings -> Environment Variables**, add:
   - `GROQ_API_KEY` = `your_groq_api_key`
4. Deploy!
