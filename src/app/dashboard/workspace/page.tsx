'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  BookOpen, 
  CheckCircle, 
  Copy, 
  RotateCcw, 
  TrendingDown, 
  Target,
  ArrowRight,
  User,
  Bot
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import confetti from 'canvas-confetti'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface OptimizationData {
  originalPrompt: string
  optimizedPrompt: string
  originalTokens: number
  optimizedTokens: number
  tokensSaved: number
  savingsPercentage: number
  appliedRules: { name: string; description: string }[]
  removedPhrases: string[]
}

export default function WorkspacePage() {
  const supabase = createClient()
  
  const [model, setModel] = useState('gemini-2.5-flash')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [autoOptimize, setAutoOptimize] = useState(true)
  const [loading, setLoading] = useState(false)
  
  // Optimization Stats
  const [optimization, setOptimization] = useState<OptimizationData | null>(null)
  const [activeTab, setActiveTab] = useState<'chat' | 'intelligence'>('chat')

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return

    const rawPrompt = inputValue.trim()
    setLoading(true)
    setInputValue('')
    
    // Add raw user prompt to chat thread
    setMessages(prev => [...prev, { role: 'user', content: rawPrompt }])

    try {
      let finalPromptToSend = rawPrompt
      let optData: OptimizationData | null = null

      if (autoOptimize) {
        // 1. Optimize raw prompt via API
        const optimizeRes = await fetch('/api/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: rawPrompt }),
        })

        if (!optimizeRes.ok) {
          throw new Error('Prompt optimization failed')
        }

        const data: OptimizationData = await optimizeRes.json()
        optData = data
        setOptimization(data)
        finalPromptToSend = data.optimizedPrompt

        // Celebrate positive savings!
        if (data.savingsPercentage > 20) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
          })
        }
      }

      // 2. Generate final AI response
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optimizedPrompt: finalPromptToSend }),
      })

      if (!chatRes.ok) {
        throw new Error('AI response generation failed')
      }

      const chatData = await chatRes.json()
      
      // Add AI response to chat thread
      setMessages(prev => [...prev, { role: 'assistant', content: chatData.response }])

      // 3. Persist to Supabase if session exists
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('chats').insert({
          user_id: user.id,
          original_prompt: rawPrompt,
          optimized_prompt: finalPromptToSend,
          ai_response: chatData.response,
          original_tokens: optData?.originalTokens || Math.ceil(rawPrompt.length / 4),
          optimized_tokens: optData?.optimizedTokens || Math.ceil(finalPromptToSend.length / 4),
          tokens_saved: optData?.tokensSaved || 0,
          savings_percentage: optData?.savingsPercentage || 0,
          applied_rules: optData?.appliedRules || [],
          removed_phrases: optData?.removedPhrases || []
        })
      }

    } catch (error: any) {
      console.error(error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'An error occurred during query generation.'}` 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleChipClick = (text: string) => {
    setInputValue(text)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const promptChips = [
    'Debug a React hook that causes infinite re-renders',
    'Draft a product spec document for a prompt engine',
    'Write a blog post about artificial intelligence in digital marketing'
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] w-full gap-6 overflow-hidden">
      
      {/* LEFT PANE: Chat Interface */}
      <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card/50">
          <div className="flex items-center gap-2">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold outline-none text-foreground cursor-pointer focus:border-brand-violet"
            >
              <option value="gemini-2.5-flash">Model: Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">Model: Gemini 2.5 Pro</option>
            </select>
          </div>
          <button 
            onClick={() => {
              setMessages([])
              setOptimization(null)
            }}
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl border border-border bg-background hover:bg-secondary transition-all"
          >
            New Chat
          </button>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            /* Welcome state */
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-violet/10 text-brand-violet border border-brand-violet/20 animate-float mb-6">
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                How can I optimize your <span className="gradient-text">prompt</span> today?
              </h2>
              <p className="text-sm text-muted-foreground mt-3 max-w-md leading-relaxed">
                Enter your initial thought below. SmartQuery AI will analyze intent, inject expert personas, and structure it for maximum token efficiency.
              </p>

              {/* Template Chips */}
              <div className="mt-8 flex flex-col gap-2.5 max-w-lg w-full px-4">
                {promptChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(chip)}
                    className="flex items-center justify-between gap-3 text-left text-xs text-muted-foreground rounded-xl border border-border bg-secondary/30 px-4 py-3 hover:bg-secondary hover:text-foreground transition-all duration-200"
                  >
                    <span className="truncate">{chip}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages list */
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet text-white">
                      <Bot className="h-4.5 w-4.5" />
                    </div>
                  )}
                  <div className={`rounded-2xl p-4.5 text-sm max-w-[85%] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-brand-indigo to-brand-violet text-white font-medium shadow-md shadow-brand-violet/5'
                      : 'bg-secondary/40 border border-border text-foreground prose dark:prose-invert prose-xs'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary border border-border">
                      <User className="h-4.5 w-4.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-violet text-white animate-spin">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <div className="rounded-2xl p-4 bg-secondary/40 border border-border text-muted-foreground text-xs font-semibold animate-pulse">
                    Optimizing prompt and generating response...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar Area */}
        <div className="border-t border-border p-4 bg-card/50">
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {/* Auto-Optimize Toggle */}
            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-brand-violet" />
                Prompt Optimization Engine
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoOptimize}
                  onChange={(e) => setAutoOptimize(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-violet"></div>
                <span className="ml-2.5 font-bold text-foreground text-[10px]">Auto-Optimize</span>
              </label>
            </div>

            {/* Input Row */}
            <div className="relative flex items-end gap-2 border border-border rounded-2xl bg-background p-2.5 focus-within:border-brand-violet focus-within:ring-1 focus-within:ring-brand-violet transition-all">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Type your rough idea here..."
                rows={2}
                className="flex-1 resize-none bg-transparent px-3 py-1.5 text-sm outline-none text-foreground max-h-32"
              />
              <div className="flex items-center gap-1.5">
                <button 
                  className="rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                  title="Attach file"
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </button>
                <button 
                  className="rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                  title="Saved prompts"
                >
                  <BookOpen className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={loading || !inputValue.trim()}
                  className="rounded-xl bg-gradient-to-r from-brand-indigo to-brand-violet text-white p-2.5 hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-center text-muted-foreground">
              SmartQuery AI may produce inaccurate results. Review structural outputs before deploying.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Intelligence Panel (Shown side-by-side on desktop) */}
      <div className="hidden lg:flex w-[380px] flex-col rounded-2xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-brand-violet" />
            <h3 className="text-sm font-bold text-foreground">Intelligence Details</h3>
          </div>
        </div>

        {/* Intelligence Content */}
        {optimization ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {/* Token Delta Card */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                  <TrendingDown className="h-3.5 w-3.5 text-brand-indigo" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Token Delta</span>
                </div>
                <p className="text-2xl font-extrabold text-brand-indigo">
                  -{optimization.savingsPercentage}%
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Saved {optimization.tokensSaved} tokens
                </p>
              </div>

              {/* Confidence Score Card */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                  <Target className="h-3.5 w-3.5 text-brand-rose" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Confidence</span>
                </div>
                <p className="text-2xl font-extrabold text-brand-rose">
                  {optimization.savingsPercentage > 40 ? '98%' : '94%'}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Optimization score
                </p>
              </div>
            </div>

            {/* Original Request Box */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Original Request</h4>
              <div className="rounded-xl border border-border bg-secondary/35 p-3 text-xs leading-relaxed text-muted-foreground max-h-32 overflow-y-auto">
                {optimization.originalPrompt}
              </div>
            </div>

            {/* Optimized Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Optimized Output</h4>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => copyToClipboard(optimization.optimizedPrompt)}
                    className="rounded-lg p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                    title="Copy optimized prompt"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setInputValue(optimization.originalPrompt)}
                    className="rounded-lg p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                    title="Load original to edit"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-brand-violet/20 bg-brand-violet/5 p-4 text-xs leading-relaxed text-foreground font-medium relative group">
                {optimization.optimizedPrompt}
              </div>
            </div>

            {/* Applied Rules */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Applied Optimization Rules</h4>
              <div className="space-y-2.5">
                {optimization.appliedRules.map((rule, idx) => (
                  <div key={idx} className="flex gap-3 rounded-xl border border-border/60 bg-secondary/15 p-3">
                    <CheckCircle className="h-4.5 w-4.5 text-brand-violet shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{rule.name}</p>
                      <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Removed Phrases */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pruned Context & Fluff</h4>
              <div className="flex flex-wrap gap-1.5">
                {optimization.removedPhrases.map((phrase, idx) => (
                  <span 
                    key={idx}
                    className="text-[10px] font-medium bg-red-500/10 text-red-500 rounded-lg px-2 py-1 border border-red-500/15"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Sparkles className="h-8 w-8 text-border mb-3 animate-pulse" />
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Waiting for optimization</h4>
            <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">
              Type a prompt in the workspace and click send to analyze token optimization.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
