'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  DollarSign, 
  Cpu, 
  CheckCircle,
  Play,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  Users2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [trialPrompt, setTrialPrompt] = useState(
    'Please can you write a very long and detailed email to my team about the new project launch next week; make sure to include all the small details and be very descriptive about every single step we need to take.'
  )
  const [optimizedOutput, setOptimizedOutput] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      }
    }
    checkSession()
  }, [])

  const handleTestOptimize = () => {
    setLoading(true)
    setTimeout(() => {
      // Clean up prompt client-side for the landing page demo
      let cleaned = trialPrompt
        .replace(/please can you/i, '')
        .replace(/very long and detailed/i, '')
        .replace(/make sure to include all the small details and be very descriptive about every single step we need to take/i, '')
        .trim()

      const optimized = `Act as an expert Project Lead. Write a comprehensive project launch email for the team outlining key deliverables, timeline for next week, and immediate next steps.`
      
      setOptimizedOutput({
        originalPrompt: trialPrompt,
        optimizedPrompt: optimized,
        originalTokens: Math.ceil(trialPrompt.length / 4),
        optimizedTokens: Math.ceil(optimized.length / 4),
        savings: 45
      })
      setLoading(false)
    }, 800)
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background text-foreground selection:bg-brand-violet/20 selection:text-brand-violet">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-violet to-brand-rose text-white shadow-md shadow-brand-violet/20">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="gradient-text font-extrabold">SmartQuery AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#solutions" className="hover:text-foreground transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#docs" className="hover:text-foreground transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
                  Logged in as: <strong className="text-foreground">{user.email}</strong>
                </span>
                <Link
                  href="/dashboard/workspace"
                  className="rounded-xl bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-rose px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-rose px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
          {/* Background blur effects */}
          <div className="absolute top-10 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-violet/10 blur-[120px] animate-pulse-subtle"></div>
          
          <div className="mx-auto max-w-5xl px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-violet/20 bg-brand-violet/5 px-3.5 py-1.5 text-[10px] font-bold text-brand-violet uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
              <span>Introducing Version 2.0 - Faster, Smarter, Cheaper</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground leading-[1.1] max-w-3xl mx-auto">
              Think Better. <span className="gradient-text">Prompt Smarter.</span>
            </h1>

            <p className="mx-auto max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
              SmartQuery AI helps teams communicate more efficiently with AI by automatically optimizing prompts before they reach Large Language Models. Reduce costs and improve accuracy instantly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href={user ? "/dashboard/workspace" : "/login"}
                className="rounded-xl bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-rose px-6 py-3.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Try SmartQuery</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                className="rounded-xl border border-border bg-card hover:bg-secondary px-6 py-3.5 text-xs font-bold text-foreground transition-all flex items-center gap-2"
              >
                <Play className="h-3.5 w-3.5 fill-current text-muted-foreground" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* INTERACTIVE PLAYGROUND WIDGET */}
            <div className="max-w-2xl mx-auto mt-16 rounded-2xl border border-border bg-card/60 p-5 md:p-6 shadow-xl backdrop-blur-md relative glass">
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-lg bg-brand-violet text-white text-[9px] font-bold uppercase tracking-wider">
                Live Interactive Demo
              </div>
              
              <div className="space-y-4 text-left mt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Paste a wordy or redundant prompt:</label>
                  <textarea
                    value={trialPrompt}
                    onChange={(e) => setTrialPrompt(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-brand-violet transition-all text-foreground leading-relaxed"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleTestOptimize}
                    disabled={loading}
                    className="rounded-xl bg-brand-violet hover:bg-brand-violet/90 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    {loading ? 'Optimizing...' : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Optimize Prompt</span>
                      </>
                    )}
                  </button>
                </div>

                {optimizedOutput && (
                  <div className="rounded-xl border border-brand-violet/20 bg-brand-violet/5 p-4 space-y-4 animate-pulse-subtle">
                    <div className="flex items-center justify-between text-[10px] font-bold text-brand-violet uppercase tracking-wider border-b border-brand-violet/10 pb-2">
                      <span>Optimization Results</span>
                      <span className="bg-brand-violet/15 px-2.5 py-1 rounded-lg">-{optimizedOutput.savings}% tokens saved</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Before ({optimizedOutput.originalTokens} tokens)</span>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{optimizedOutput.originalPrompt}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-semibold text-brand-violet uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          After ({optimizedOutput.optimizedTokens} tokens)
                        </span>
                        <p className="text-xs text-foreground font-semibold line-clamp-3 leading-relaxed">{optimizedOutput.optimizedPrompt}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* TRUSTED TECH LOGOS */}
        <section className="border-t border-b border-border bg-card/20 py-8">
          <div className="mx-auto max-w-7xl px-6 text-center space-y-3.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Trusted Integration Partners</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all text-sm font-semibold text-muted-foreground">
              <span>Google Gemini</span>
              <span>Supabase</span>
              <span>React</span>
              <span>TypeScript</span>
            </div>
          </div>
        </section>

        {/* PROBLEM CARD GRID */}
        <section className="py-20 md:py-24 max-w-6xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              AI Shouldn't Cost More Than It Needs To
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Unoptimized queries drain budgets and degrade performance. The hidden costs of raw prompting are slowing down your operations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm hover:border-brand-violet/10 transition-all duration-200">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground">Long prompts waste tokens</h3>
                <p className="text-[10px] text-muted-foreground leading-normal mt-1">Fluff and conversational filter directly translate to higher API costs per request.</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm hover:border-brand-violet/10 transition-all duration-200">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground">Poor prompts reduce accuracy</h3>
                <p className="text-[10px] text-muted-foreground leading-normal mt-1">Ambiguous instructions lead to hallucinations and require multiple corrective follow-ups.</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm hover:border-brand-violet/10 transition-all duration-200">
              <div className="h-10 w-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground">Repeated context increases costs</h3>
                <p className="text-[10px] text-muted-foreground leading-normal mt-1">Sending redundant system prompts every time exponentially increases your bill over time.</p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm hover:border-brand-violet/10 transition-all duration-200">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground">Complex queries slow responses</h3>
                <p className="text-[10px] text-muted-foreground leading-normal mt-1">Overloaded context windows result in longer latency and degraded user experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW DIAGRAM */}
        <section className="bg-secondary/20 border-t border-b border-border py-20">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-16">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">How SmartQuery Works</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                A seamless middle layer that instantly optimizes your AI communications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Step 1 */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm relative z-10">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Step 1</span>
                <h3 className="text-xs font-bold text-foreground">User enters prompt</h3>
                <p className="text-[10px] text-muted-foreground leading-normal">Natural language input, no prompt engineering skills required.</p>
              </div>
              {/* Step 2 */}
              <div className="rounded-2xl border border-brand-violet/30 bg-gradient-to-tr from-brand-indigo/5 to-brand-violet/5 p-6 space-y-3 shadow-md relative z-10 scale-105 border-2">
                <span className="text-[10px] font-bold text-brand-violet uppercase tracking-wider">Step 2</span>
                <h3 className="text-xs font-bold text-foreground">SmartQuery optimizes</h3>
                <p className="text-[10px] text-muted-foreground leading-normal">Instantly compresses content, clarifies intent, and structures for the specific LLM.</p>
              </div>
              {/* Step 3 */}
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm relative z-10">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Step 3</span>
                <h3 className="text-xs font-bold text-foreground">AI generates response</h3>
                <p className="text-[10px] text-muted-foreground leading-normal">Faster, cheaper, and more accurate outputs returned to the user.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-20 md:py-24 max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Powerful Features</h2>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Everything you need to manage, monitor, and optimize your AI usage at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
              <Zap className="h-5 w-5 text-brand-violet" />
              <h3 className="text-xs font-bold text-foreground">Intelligent Prompt Optimization</h3>
              <p className="text-[10px] text-muted-foreground leading-normal">Automatically rewrite queries for clarity and token efficiency without losing intent.</p>
            </div>
            {/* Feature 2 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
              <Cpu className="h-5 w-5 text-brand-indigo" />
              <h3 className="text-xs font-bold text-foreground">Context Compression</h3>
              <p className="text-[10px] text-muted-foreground leading-normal">Dynamically summarize historical context to fit within strict window limits.</p>
            </div>
            {/* Feature 3 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
              <LayoutDashboard className="h-5 w-5 text-brand-rose" />
              <h3 className="text-xs font-bold text-foreground">Token Savings Analytics</h3>
              <p className="text-[10px] text-muted-foreground leading-normal">Real-time dashboards showing exactly how much you're saving on API costs.</p>
            </div>
            {/* Feature 4 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
              <Sparkles className="h-5 w-5 text-brand-violet" />
              <h3 className="text-xs font-bold text-foreground">Explainable Optimization</h3>
              <p className="text-[10px] text-muted-foreground leading-normal">See exactly what was changed in your prompt and why, maintaining full transparency.</p>
            </div>
            {/* Feature 5 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
              <Users2 className="h-5 w-5 text-brand-indigo" />
              <h3 className="text-xs font-bold text-foreground">Human-AI Collaboration</h3>
              <p className="text-[10px] text-muted-foreground leading-normal">Approve or reject optimizations before sending to fine-tune the system to your needs.</p>
            </div>
            {/* Feature 6 */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-brand-rose" />
              <h3 className="text-xs font-bold text-foreground">Enterprise Ready</h3>
              <p className="text-[10px] text-muted-foreground leading-normal">SSO, role-based access control, and dedicated deployment options for strict security.</p>
            </div>
          </div>
        </section>

        {/* RE-ARCHITECTED REAL-TIME SAVINGS FOOTER PANEL */}
        <section className="bg-gradient-to-r from-zinc-900 to-black py-16 text-white border-t border-zinc-800">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold tracking-tight">See Your Savings in Real-Time</h2>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Comprehensive analytics track every token optimized and every dollar saved.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="bg-zinc-950/60 rounded-xl border border-zinc-800 p-6 text-center">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Total Tokens Saved</p>
                <p className="text-3xl font-extrabold text-brand-violet mt-2">1.2M</p>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ +15% last month</p>
              </div>
              <div className="bg-zinc-950/60 rounded-xl border border-zinc-800 p-6 text-center">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Cost Reduction</p>
                <p className="text-3xl font-extrabold text-brand-indigo mt-2">$4,520</p>
                <p className="text-[10px] text-emerald-500 font-bold mt-1">↑ +22% last month</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-semibold text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-violet" />
            <span>© 2026 SmartQuery AI. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
            <a href="#" className="hover:text-foreground">Contact</a>
            <a href="#" className="hover:text-foreground">Status</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
