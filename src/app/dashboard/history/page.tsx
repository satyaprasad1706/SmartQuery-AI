'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Trash2, 
  Sparkles, 
  Calendar, 
  TrendingDown, 
  ArrowRight,
  Loader2
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface ChatItem {
  id: string
  created_at: string
  original_prompt: string
  optimized_prompt: string
  ai_response: string
  original_tokens: number
  optimized_tokens: number
  tokens_saved: number
  savings_percentage: number
}

export default function HistoryPage() {
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [chats, setChats] = useState<ChatItem[]>([])

  const fetchChats = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) {
          setChats(data)
          setLoading(false)
          return
        }
      }
      
      // Fallback mock history if database is empty
      setChats([
        {
          id: '1',
          created_at: new Date(Date.now() - 120000).toISOString(), // 2 mins ago
          original_prompt: 'Can you please explain how to debug a react hook that is causing infinite render cycles in detail?',
          optimized_prompt: 'Act as an expert Software Engineer. Explain how to debug a React hook infinite render loop. Structure response with headings, bullet points, and a concise summary.',
          ai_response: 'Mock React hooks debugging response.',
          original_tokens: 28,
          optimized_tokens: 25,
          tokens_saved: 3,
          savings_percentage: 10.7
        },
        {
          id: '2',
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          original_prompt: 'Please write a blog post explaining why artificial intelligence should not cost more than it needs to. Detail context window costs and high token pricing in great detail.',
          optimized_prompt: 'Act as an expert digital marketing copywriter. Write a blog post about optimizing LLM costs, focused on context windows and token pricing. Structure response with headings, bullet points, and a concise summary.',
          ai_response: 'Mock copywriting response.',
          original_tokens: 38,
          optimized_tokens: 29,
          tokens_saved: 9,
          savings_percentage: 23.7
        }
      ])
    } catch (err) {
      console.error('Error fetching chat history:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChats()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase
          .from('chats')
          .delete()
          .eq('id', id)
        if (error) throw error
      }
      
      // Update state locally
      setChats(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error deleting chat:', err)
    }
  }

  const filteredChats = chats.filter(chat => 
    chat.original_prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.optimized_prompt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Optimization History</h1>
        <p className="text-xs text-muted-foreground mt-1">View, search, and manage your past prompt optimizations.</p>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center border border-border rounded-xl bg-card px-3.5 focus-within:border-brand-violet focus-within:ring-1 focus-within:ring-brand-violet transition-all shadow-sm">
        <Search className="h-4.5 w-4.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search prompts or rules..."
          className="w-full bg-transparent px-3 py-3 text-sm outline-none text-foreground"
        />
      </div>

      {/* History List */}
      {loading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-xs font-semibold">Loading history...</span>
        </div>
      ) : filteredChats.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <Trash2 className="h-10 w-10 text-border mx-auto mb-4" />
          <h3 className="text-sm font-bold text-foreground">No logs found</h3>
          <p className="text-xs text-muted-foreground mt-1">Try updating your search query or run a new optimization.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChats.map((chat) => (
            <div 
              key={chat.id} 
              className="rounded-2xl border border-border bg-card p-5 hover:border-brand-violet/20 hover:shadow-sm transition-all duration-200"
            >
              {/* Header stats */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 mb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(chat.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 rounded-lg px-2 py-1 text-[10px] font-bold">
                    <TrendingDown className="h-3 w-3" />
                    <span>-{chat.savings_percentage}% saved</span>
                  </div>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    className="text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-secondary transition-all"
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Comparison Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Original */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Original Prompt</p>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{chat.original_prompt}</p>
                </div>

                {/* Right: Optimized */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-brand-violet uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Optimized Prompt
                  </p>
                  <p className="text-xs text-foreground font-medium line-clamp-3 leading-relaxed">{chat.optimized_prompt}</p>
                </div>
              </div>

              {/* Expand Chat Option */}
              <div className="mt-4 pt-3.5 border-t border-border/50 flex justify-end">
                <button
                  onClick={() => {
                    // Navigate to workspace with this prompt preloaded
                    window.location.href = `/dashboard/workspace`
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-brand-violet hover:underline"
                >
                  <span>Launch in Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
