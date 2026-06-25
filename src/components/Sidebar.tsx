'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Zap, 
  BarChart3, 
  History, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon, 
  Sparkles,
  Menu,
  X
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Sidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (val: boolean) => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
      } else {
        // Fallback for development if Supabase isn't configured/connected
        setUserEmail('satya@nclipse.com')
      }
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    {
      name: 'Workspace',
      href: '/dashboard/workspace',
      icon: Zap,
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      name: 'History',
      href: '/dashboard/history',
      icon: History,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card p-6 transition-transform duration-300 md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-violet to-brand-rose text-white shadow-md shadow-brand-violet/20 animate-pulse-subtle">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="gradient-text font-extrabold">SmartQuery AI</span>
        </Link>
        
        {/* Mobile close button */}
        {setIsOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 hover:bg-muted md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Nav Section */}
      <nav className="mt-10 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen && setIsOpen(false)}
              className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active 
                  ? 'bg-gradient-to-r from-brand-violet/10 to-brand-indigo/10 text-brand-violet border-l-4 border-brand-violet shadow-sm shadow-brand-violet/5' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-brand-violet' : 'text-muted-foreground'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Lower Sidebar Actions */}
      <div className="mt-auto pt-6 border-t border-border space-y-4">
        {/* Theme Switcher Card */}
        <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-2 border border-border/50">
          <span className="text-xs font-semibold text-muted-foreground px-2">Theme</span>
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-background text-foreground transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border border-border bg-secondary/30 p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-sm shadow-brand-violet/20">
              {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'SQ'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-foreground leading-none mb-1">
                Project Alpha
              </p>
              <p className="text-[10px] text-muted-foreground truncate leading-none">
                {userEmail || 'satya@nclipse.com'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[10px] bg-brand-violet/10 text-brand-violet font-semibold rounded-lg px-2.5 py-1.5 mt-1 border border-brand-violet/20">
            <span>Enterprise Plan</span>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
          </div>

          <button 
            className="w-full text-center text-xs font-bold bg-foreground text-background hover:opacity-90 rounded-lg py-2 mt-1.5 transition-all duration-200"
          >
            Upgrade Now
          </button>
        </div>

        {/* Help & Logout */}
        <div className="space-y-1">
          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen && setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
          >
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
