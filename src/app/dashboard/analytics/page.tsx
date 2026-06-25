'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Cpu, 
  Percent, 
  DollarSign, 
  Calendar,
  MoreVertical,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { createClient } from '@/utils/supabase/client'

interface ChatLog {
  id: string
  created_at: string
  original_tokens: number
  tokens_saved: number
  savings_percentage: number
}

export default function AnalyticsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('Last 30 Days')
  
  // KPI Metrics State
  const [metrics, setMetrics] = useState({
    totalQueries: 1248,
    totalTokensSaved: 45800000, // 45.8M
    avgReduction: 34.2,
    costSavings: 4520
  })

  // Table Log State
  const [logs, setLogs] = useState<any[]>([])

  // Load from Supabase or generate fallback data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase
            .from('chats')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

          if (error) throw error

          if (data && data.length > 0) {
            // Aggregate values from real data
            const totalQ = data.length
            let totalSaved = 0
            let totalOrig = 0
            data.forEach(item => {
              totalSaved += item.tokens_saved || 0
              totalOrig += item.original_tokens || 0
            })
            const avgRed = totalOrig > 0 ? (totalSaved / totalOrig) * 100 : 0
            const costSav = parseFloat((totalSaved * 0.000015).toFixed(2)) // $0.000015 per token

            setMetrics({
              totalQueries: totalQ,
              totalTokensSaved: totalSaved,
              avgReduction: parseFloat(avgRed.toFixed(1)),
              costSavings: costSav
            })

            // Format logs for table
            const formattedLogs = data.map((item, idx) => ({
              id: item.id.substring(0, 8),
              timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              originalTokens: item.original_tokens,
              reduction: item.savings_percentage,
              efficiencyScore: ((item.savings_percentage / 10).toFixed(1))
            }))
            setLogs(formattedLogs)
            setLoading(false)
            return
          }
        }
        
        // Fallback mock logs if database is empty or not logged in
        setLogs([
          { id: 'pr-8f92a1b', timestamp: '2 mins ago', originalTokens: 4096, reduction: 42, efficiencyScore: '9.5' },
          { id: 'pr-3c44e9f', timestamp: '15 mins ago', originalTokens: 2048, reduction: 28, efficiencyScore: '7.8' },
          { id: 'pr-1a2b3c4', timestamp: '1 hour ago', originalTokens: 8192, reduction: 61, efficiencyScore: '9.8' },
          { id: 'pr-9d8e7f6', timestamp: '3 hours ago', originalTokens: 512, reduction: 5, efficiencyScore: '4.0' }
        ])
      } catch (err) {
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Mock Recharts chart data
  const chartData = [
    { name: 'Oct 1', tokens: 600000 },
    { name: 'Oct 8', tokens: 800000 },
    { name: 'Oct 15', tokens: 1200000 },
    { name: 'Oct 22', tokens: 1500000 },
    { name: 'Oct 31', tokens: 1800000 }
  ]

  // Formatting large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics Overview</h1>
          <p className="text-xs text-muted-foreground mt-1">Real-time optimization metrics and usage data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Oct 1 - Oct 31</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Queries</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Cpu className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-foreground">
              {formatNumber(metrics.totalQueries)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5%</span>
              <span className="text-muted-foreground font-semibold">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tokens Saved</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
              <Cpu className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-foreground">
              {formatNumber(metrics.totalTokensSaved)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-brand-violet">
              <TrendingUp className="h-3 w-3" />
              <span>+8.2%</span>
              <span className="text-muted-foreground font-semibold">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average Reduction</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <Percent className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-foreground">
              {metrics.avgReduction}%
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-muted-foreground">
              <span>0.0% stable</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Est. Cost Savings</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-foreground">
              ${metrics.costSavings.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              <span>+21.4%</span>
              <span className="text-muted-foreground font-semibold">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Project Usage Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Token Savings Trend Card */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Token Savings Trend</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Cumulative tokens saved over the last 30 days.</p>
            </div>
            <div className="flex rounded-xl bg-secondary/50 p-1 border border-border/50">
              <button className="rounded-lg px-3 py-1 text-[10px] font-bold bg-background text-foreground shadow-sm">Daily</button>
              <button className="rounded-lg px-3 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground">Weekly</button>
            </div>
          </div>

          <div className="flex-1 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand-violet)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--color-brand-violet)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000000 ? (val/1000000) + 'M' : val} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    fontSize: 11
                  }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="tokens" stroke="var(--color-brand-violet)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Usage Progress Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-[400px]">
          <div>
            <h3 className="text-sm font-bold text-foreground">Usage by Project</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Top prompt consumers.</p>
          </div>

          <div className="flex-1 mt-6 space-y-5 overflow-y-auto">
            {/* Backend API */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Backend API</span>
                <span className="font-bold text-muted-foreground">85%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div className="h-full rounded-full bg-brand-indigo" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Customer Portal */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Customer Portal</span>
                <span className="font-bold text-muted-foreground">62%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div className="h-full rounded-full bg-brand-violet" style={{ width: '62%' }}></div>
              </div>
            </div>

            {/* Data Pipeline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Data Pipeline</span>
                <span className="font-bold text-muted-foreground">45%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div className="h-full rounded-full bg-brand-rose" style={{ width: '45%' }}></div>
              </div>
            </div>

            {/* Internal Tools */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Internal Tools</span>
                <span className="font-bold text-muted-foreground">20%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div className="h-full rounded-full bg-muted-foreground/30" style={{ width: '20%' }}></div>
              </div>
            </div>

            {/* Experimental */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Experimental</span>
                <span className="font-bold text-muted-foreground">8%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div className="h-full rounded-full bg-muted-foreground/20" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Logs Table Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-sm font-bold text-foreground">Recent Optimization Logs</h3>
          <button className="text-xs font-bold text-brand-violet hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-xs font-semibold">Loading logs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/20 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-3.5">Prompt ID</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Original Tokens</th>
                  <th className="px-6 py-3.5">Reduction %</th>
                  <th className="px-6 py-3.5">Efficiency Score</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-secondary/15 transition-all text-foreground font-medium">
                    <td className="px-6 py-4 font-mono font-bold text-brand-indigo">{log.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{log.timestamp}</td>
                    <td className="px-6 py-4">{log.originalTokens}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500">
                        ↓ {log.reduction}%
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2 mt-1 bg-transparent">
                      <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-brand-violet" 
                          style={{ width: `${parseFloat(log.efficiencyScore) * 10}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-[10px]">{log.efficiencyScore}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
