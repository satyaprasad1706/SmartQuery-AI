'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function AuthPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      if (isLogin) {
        // Sign In
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        router.push('/dashboard/workspace')
      } else {
        // Sign Up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (signUpError) throw signUpError
        setSuccessMsg('Registration successful! Please check your email for the verification link.')
        setIsLogin(true)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  // Developer Bypass to directly navigate to workspace when Supabase is not connected
  const handleBypass = () => {
    router.push('/dashboard/workspace')
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-indigo/10 via-background to-background p-4 relative overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-brand-violet/10 blur-[100px] animate-pulse-subtle"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-brand-rose/10 blur-[100px] animate-pulse-subtle"></div>

      <div className="w-full max-w-md rounded-2xl border border-border bg-card/60 p-8 shadow-xl backdrop-blur-md glass">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-violet to-brand-rose text-white shadow-md shadow-brand-violet/20 animate-pulse-subtle">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="gradient-text font-extrabold">SmartQuery AI</span>
          </Link>
          <h2 className="text-xl font-bold text-foreground">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
            {isLogin 
              ? 'Optimize your natural language queries for LLM token savings.' 
              : 'Sign up to start monitoring your LLM prompt performance.'
            }
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-normal">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-500">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
            <p className="leading-normal">{successMsg}</p>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="mt-6 space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Name</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all duration-200"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-muted-foreground">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm outline-none focus:border-brand-violet focus:ring-1 focus:ring-brand-violet transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-rose py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50 transition-all duration-200 mt-2"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle link */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            className="font-bold text-brand-violet hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        {/* Sandbox Bypass Footer */}
        <div className="mt-8 pt-4 border-t border-border/50 text-center">
          <p className="text-[10px] text-muted-foreground mb-2">Testing locally without Supabase credentials?</p>
          <button
            onClick={handleBypass}
            type="button"
            className="text-[10px] px-3.5 py-1.5 rounded-lg border border-brand-violet/20 bg-brand-violet/5 hover:bg-brand-violet/10 text-brand-violet font-bold transition-all duration-200"
          >
            Bypass Authentication (Sandbox Mode)
          </button>
        </div>
      </div>
    </div>
  )
}
