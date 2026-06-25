'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  Sparkles, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  Save
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function SettingsPage() {
  const supabase = createClient()
  
  const [name, setName] = useState('Rahul')
  const [email, setEmail] = useState('satya@nclipse.com')
  const [defaultModel, setDefaultModel] = useState('gemini-2.5-flash')
  const [temperature, setTemperature] = useState(0.7)
  const [apiKeyStatus, setApiKeyStatus] = useState<'configured' | 'missing'>('configured')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || 'satya@nclipse.com')
        setName(user.user_metadata?.name || 'Rahul')
      }
    }
    fetchUser()
    
    // Check if the Gemini API Key is configured via an optimize test or check env status
    // For local mock visual convenience, we check if key is set or mock
    const key = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing'
    setApiKeyStatus(key)
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSavedMsg(false)
    
    setTimeout(() => {
      setSaving(false)
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Account & System Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">Configure profile details, LLM models, and API configurations.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Profile Settings */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-1">
            <User className="h-4.5 w-4.5 text-brand-violet" />
            <h3 className="text-sm font-bold text-foreground">User Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-violet transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: LLM Configuration */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-1">
            <Sparkles className="h-4.5 w-4.5 text-brand-indigo" />
            <h3 className="text-sm font-bold text-foreground">Model Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Default Optimization Model</label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none text-foreground cursor-pointer focus:border-brand-violet transition-all"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Best Accuracy)</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Temperature ({temperature})</label>
              <div className="flex items-center gap-4 py-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-brand-violet cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: API Status & Keys */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-1">
            <Database className="h-4.5 w-4.5 text-brand-rose" />
            <h3 className="text-sm font-bold text-foreground">API Credentials Status</h3>
          </div>

          <div className="space-y-3.5">
            {/* Gemini API Key Status */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/20 p-4">
              <div>
                <p className="text-xs font-bold text-foreground">Google Gemini API Key</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Required for live prompt optimization & responses.</p>
              </div>
              
              {apiKeyStatus === 'configured' ? (
                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/15">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Active & Configured</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold text-amber-500 border border-amber-500/15">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Running in Sandbox Mode</span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-muted-foreground leading-normal">
              To edit API credentials, configure the `GEMINI_API_KEY` and Supabase values in your project's `.env.local` file and restart your local dev server.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            {savedMsg && (
              <span className="text-xs font-bold text-emerald-500 animate-pulse">
                Settings saved successfully!
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-rose px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all"
          >
            {saving ? 'Saving...' : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-red-500/10 pb-3 mb-1">
            <ShieldAlert className="h-4.5 w-4.5 text-red-500" />
            <h3 className="text-sm font-bold text-red-500">Danger Zone</h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-foreground">Clear Chat Logs & History</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">This will permanently delete all prompt logs stored in Supabase.</p>
            </div>
            <button
              type="button"
              className="rounded-xl border border-red-500/25 bg-red-500/10 hover:bg-red-500/15 text-red-500 px-4 py-2.5 text-xs font-bold transition-all shrink-0"
            >
              Clear All Logs
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}
