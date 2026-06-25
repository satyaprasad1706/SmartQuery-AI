# SmartQuery AI 🚀

### Human-Centered Query Optimization for Token-Efficient LLM Interactions

SmartQuery AI is a Human-AI Interaction (HAI) platform designed to bridge the gap between verbose user prompts and token-efficient Large Language Model (LLM) processing. By intercepting raw user inputs and running them through a **Gemini-powered Prompt Optimization Engine**, it removes redundancy, structures constraints, injects domain personas, and calculates token/cost savings in real-time before fetching final AI responses.

---

## 🌟 Key Features

*   **Intelligent Prompt Optimization:** Leverages Gemini 2.5 Flash to automatically refactor prompts, pruning filler context and conversational fluff without losing user intent.
*   **Dual-Pane Workspace Interface:** A high-fidelity chat workspace showing the direct output on the left and a detailed **Intelligence Panel** on the right with token delta percentages (`-40%+` average reduction), applied rules lists, and pruned words.
*   **Token Savings & Cost Analytics:** Aggregates real-time KPIs (Total Queries, Total Tokens Saved, Average Reduction %, Est. Cost Savings) and visualizes savings trends using Recharts.
*   **Searchable Chat History:** Full search and deletion capability for past conversation logs, with options to quickly launch previous prompt configurations back into the workspace.
*   **Robust Local Fallback Sandbox:** Automatically runs simulated optimizations and chat completions if API keys are missing, enabling instant out-of-the-box local testing.
*   **Secure Email Authentication:** Simple, lightweight authentication powered by Supabase Auth (with email confirmation toggle compatibility).

---

## 🏗️ Tech Stack

*   **Frontend Framework:** Next.js (App Router) & React (v19)
*   **Programming Language:** TypeScript
*   **Styling:** Tailwind CSS (v4) with custom CSS dark/light theme variables
*   **Database & Auth:** Supabase (PostgreSQL & Supabase SSR Auth)
*   **AI Engine:** Google Gemini SDK (`@google/genai`)
*   **Data Visualization:** Recharts
*   **Iconography:** Lucide React

---

## 📂 Project Structure

```text
j:/Optimizer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts       # Gemini Chat Response Endpoint
│   │   │   └── optimize/route.ts   # Gemini Prompt Optimization Endpoint
│   │   ├── dashboard/
│   │   │   ├── analytics/page.tsx  # Analytics charts and statistics
│   │   │   ├── history/page.tsx    # Searchable logs history
│   │   │   ├── layout.tsx          # Shared Dashboard view layout
│   │   │   ├── settings/page.tsx   # Account and model configurations
│   │   │   └── workspace/page.tsx  # Core split-pane chat interface
│   │   ├── login/page.tsx          # Email Auth page with sandbox bypass
│   │   ├── layout.tsx              # Root HTML wrapper
│   │   └── page.tsx                # Marketing Landing Page with live sandbox demo
│   ├── components/
│   │   └── Sidebar.tsx             # Responsive Navigation Sidebar
│   ├── contexts/
│   │   └── ThemeContext.tsx        # Dark/Light mode state provider
│   └── utils/
│       └── supabase/               # Supabase SSR server/client/middleware helpers
├── supabase/
│   └── schema.sql                  # PostgreSQL DB Migrations script
├── .env.example                    # Env template file
├── .env.local                      # Local secret variables (ignored from git)
├── tailwind.config.ts              # Theme overrides
└── tsconfig.json                   # TS Compiler options
```

---

## ⚙️ Local Installation & Setup

Follow these steps to run SmartQuery AI locally:

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/satyaprasad1706/SmartQuery-AI.git
cd SmartQuery-AI
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
GEMINI_API_KEY=your-gemini-api-key
```
*(If you leave these blank, the app will automatically launch in **Sandbox Mode** with mock fallback algorithms for testing).*

### 3. Setup Supabase Database
*   Create a new project in the [Supabase Dashboard](https://supabase.com).
*   Go to **SQL Editor** -> **New Query**.
*   Copy the SQL contents of [supabase/schema.sql](file:///j:/Optimizer/supabase/schema.sql) and paste it into the editor.
*   Click **Run** to set up database tables, RLS policies, and new-user triggers.

### 4. Disable Email Verification (Optional for rapid local testing)
If you want to log in instantly without checking validation emails:
*   In Supabase, go to **Authentication** -> **Providers** -> **Email**.
*   Turn **OFF** the toggle for **Confirm email** and click **Save**.

### 5. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🚀 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Under the **Environment Variables** section, configure:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   `GEMINI_API_KEY`
4. Click **Deploy**. Vercel will build and host your App Router pages and Serverless API Routes automatically.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
