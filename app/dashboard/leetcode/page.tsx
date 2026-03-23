'use client'

import { useState, useEffect } from 'react'
import { Code2, Search, Zap, CheckCircle2, RotateCw, Trophy, Loader2, Link2 } from 'lucide-react'
import { fetchLeetCodeStats, syncLeetCodeSubmissions } from '@/app/actions/leetcode'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export default function LeetCodeSyncPage() {
  const [username, setUsername] = useState('')
  const [isLinked, setIsLinked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [syncResult, setSyncResult] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('leetcode_username')
          .eq('id', user.id)
          .single()
        
        if (profile?.leetcode_username) {
          setUsername(profile.leetcode_username)
          setIsLinked(true)
          // Auto fetch stats if linked
          setLoading(true)
          const result = await fetchLeetCodeStats(profile.leetcode_username)
          if (!('error' in result)) {
            setStats(result)
          }
          setLoading(false)
        }
      }
    }
    loadProfile()
  }, [supabase])

  async function handleLink() {
    if (!username.trim()) return
    setLoading(true)
    setError(null)
    setSyncResult(null)
    
    // 1. Verify username works first
    const result = await fetchLeetCodeStats(username.trim())
    if ('error' in result) {
      setError(result.error as string)
      setStats(null)
      setLoading(false)
      return
    }

    // 2. Save to Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ leetcode_username: username.trim() })
        .eq('id', user.id)
      
      if (updateError) {
        setError("Could not save to profile. Ensure 'leetcode_username' column exists.")
        setLoading(false)
        return
      }
    }

    setStats(result)
    setIsLinked(true)
    setLoading(false)
  }

  async function handleUnlink() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ leetcode_username: null })
        .eq('id', user.id)
    }
    setUsername('')
    setIsLinked(false)
    setStats(null)
    setSyncResult(null)
    setLoading(false)
  }

  async function handleSync() {
    setSyncing(true)
    setError(null)
    const result = await syncLeetCodeSubmissions(username.trim())
    if ('error' in result) {
      setError(result.error as string)
    } else {
      setSyncResult(result.count || 0)
      // AUTO REFRESH STATS
      const newStats = await fetchLeetCodeStats(username.trim())
      if (!('error' in newStats)) {
        setStats(newStats)
      }
    }
    setSyncing(false)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto py-8">
      
      {/* ── Header Section ── */}
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-[24px] bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <Code2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">LeetCode Sync</h1>
        <p className="text-gray-500 max-w-lg">
          Sync your LeetCode progress. Enter your username to fetch your stats and push your latest solved problems to your dashboard.
        </p>
      </div>

      {/* ── Search Input ── */}
      <div className="glass p-8 rounded-[40px] glow-indigo border border-indigo-500/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Your LeetCode username" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isLinked}
              className="input-glass w-full !pl-12 !py-4 disabled:opacity-50"
              onKeyDown={e => e.key === 'Enter' && !isLinked && handleLink()}
            />
          </div>
          {isLinked ? (
            <button 
              onClick={handleUnlink}
              disabled={loading}
              className="px-8 py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl font-black hover:bg-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Unlink Account
            </button>
          ) : (
            <button 
              onClick={handleLink}
              disabled={loading || !username.trim()}
              className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Link2 className="w-5 h-5" />}
              Link Account
            </button>
          )}
        </div>
        {error && <p className="text-red-400 text-sm mt-4 font-bold flex items-center gap-2">⚠️ {error}</p>}
      </div>

      {/* ── Stats & Sync ── */}
      {stats && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Solved', value: stats.total, color: 'text-white', icon: Zap },
              { label: 'Easy', value: stats.easy, color: 'text-green-400', icon: CheckCircle2 },
              { label: 'Medium', value: stats.medium, color: 'text-yellow-400', icon: RotateCw },
              { label: 'Hard', value: stats.hard, color: 'text-red-400', icon: Trophy },
            ].map((s, i) => (
              <div key={i} className="glass p-6 rounded-[32px] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <s.icon className={cn("w-4 h-4", s.color)} />
                  <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase">{s.label}</span>
                </div>
                <p className={cn("text-3xl font-black", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="glass p-10 rounded-[48px] border border-indigo-500/10 text-center flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold">Account Linked Successfully</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              We found your profile! Click below to sync your **last 20 successful submissions** directly into your dashboard.
            </p>
            
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="w-full sm:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95"
            >
              {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {syncing ? 'Syncing Problems...' : 'Sync Recent Solves'}
            </button>

            {syncResult !== null && (
              <div className="mt-4 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm">
                Success! Synced {syncResult} new problems to your dashboard.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FAQ ── */}
      {!stats && (
        <div className="grid md:grid-cols-2 gap-6 opacity-60">
          <div className="glass p-6 rounded-3xl border border-white/5">
            <h4 className="font-bold text-sm mb-2">Is this data safe?</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Yes. We only fetch public data using your username. We don't require your password or access to your private LeetCode account.
            </p>
          </div>
          <div className="glass p-6 rounded-3xl border border-white/5">
            <h4 className="font-bold text-sm mb-2">What data is synced?</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              We sync your total counts and the titles of your latest Accepted (AC) submissions to help you track your streaks.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
