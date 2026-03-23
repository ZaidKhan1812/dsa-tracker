'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { redirect, useRouter } from 'next/navigation'
import ProblemForm from '@/components/ProblemForm'
import { 
  LineChart, 
  BarChart2, 
  Calendar, 
  Trophy, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)

      const { data } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: false })
      
      setProblems(data ?? [])
      setLoading(false)
    }
    getData()
  }, [supabase, router])

  async function refreshData() {
    const { data } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false })
    setProblems(data ?? [])
    setFilterDifficulty(null)
    setSearchQuery('')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const stats = {
    total: problems.length,
    easy: problems.filter(p => p.difficulty === 'easy').length,
    medium: problems.filter(p => p.difficulty === 'medium').length,
    hard: problems.filter(p => p.difficulty === 'hard').length,
  }

  const topics = problems.reduce((acc: Record<string, number>, p) => {
    acc[p.topic] = (acc[p.topic] ?? 0) + 1
    return acc
  }, {})

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = !filterDifficulty || p.difficulty === filterDifficulty
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* ── Sidebar / Stats ── */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-6 glow-indigo"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                Overview
              </h2>
              <Trophy className="w-5 h-5 text-yellow-500/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total', value: stats.total, color: 'text-white', icon: BarChart2 },
                { label: 'Easy', value: stats.easy, color: 'text-green-400', icon: CheckCircle2 },
                { label: 'Medium', value: stats.medium, color: 'text-yellow-400', icon: Clock },
                { label: 'Hard', value: stats.hard, color: 'text-red-400', icon: Trophy },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <s.icon className={cn("w-3.5 h-3.5 opacity-50", s.color)} />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{s.label}</span>
                  </div>
                  <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6"
          >
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-gray-400 uppercase tracking-widest">
              Add New Problem
            </h3>
            <ProblemForm onProblemLogged={refreshData} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6"
          >
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-gray-400 uppercase tracking-widest">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(topics).map(([topic, count]) => (
                <div key={topic} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium flex items-center gap-2">
                  <span className="text-gray-400">{topic}</span>
                  <span className="text-indigo-400 font-bold">{count as number}</span>
                </div>
              ))}
            </div>
          </motion.div>
      </aside>

      {/* ── Main Content ── */}
      <section className="flex-1 flex flex-col gap-6 w-full">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search problems..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-glass w-full !pl-12 py-3"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              {['easy', 'medium', 'hard'].map(d => (
                <button 
                  key={d}
                  onClick={() => setFilterDifficulty(filterDifficulty === d ? null : d)}
                  className={cn(
                    "flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border",
                    filterDifficulty === d 
                      ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" 
                      : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence mode='popLayout'>
              {filteredProblems.length > 0 ? (
                filteredProblems.map((p, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    key={p.id}
                    className="glass p-5 rounded-2xl flex items-center justify-between hover:glow-indigo group cursor-pointer"
                    onClick={() => router.push(`/problems/${p.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg",
                        p.difficulty === 'easy' ? "bg-green-500/10 text-green-400" :
                        p.difficulty === 'medium' ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
                      )}>
                        {p.title[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors">
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-600">{p.topic}</span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="text-[10px] text-gray-500 font-medium">Solved on {new Date(p.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-600 hover:text-indigo-400 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
                  <p className="text-gray-500 font-medium">No problems found match your criteria.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
    </div>
  )
}