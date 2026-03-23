'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProblemForm({ onProblemLogged }: { onProblemLogged?: () => void }) {
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('Arrays')
  const [difficulty, setDifficulty] = useState('easy')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { error } = await supabase.from('problems').insert({
      user_id: user.id, title, topic, difficulty
    })
    
    if (error) {
      alert('Error logging problem: ' + error.message)
      setLoading(false)
      return
    }

    setTitle('')
    setLoading(false)
    router.refresh()
    if (onProblemLogged) onProblemLogged()
  }

  const difficultyConfig = {
    easy:   { active: 'bg-green-500/15 ring-green-500/40 text-green-400 shadow-green-500/10', glow: 'shadow-green-500/20' },
    medium: { active: 'bg-yellow-500/15 ring-yellow-500/40 text-yellow-400 shadow-yellow-500/10', glow: 'shadow-yellow-500/20' },
    hard:   { active: 'bg-red-500/15 ring-red-500/40 text-red-400 shadow-red-500/10', glow: 'shadow-red-500/20' },
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Problem name e.g. Two Sum"
        className="input-glass w-full"
        required
      />

      <select
        value={topic}
        onChange={e => setTopic(e.target.value)}
        className="input-glass w-full cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236366f1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center'
        }}
      >
        {['Arrays','Strings','Linked List','Trees','Graphs','DP','Binary Search'].map(t => (
          <option key={t} className="bg-gray-900">{t}</option>
        ))}
      </select>

      <div className="flex gap-2">
        {(['easy', 'medium', 'hard'] as const).map(d => {
          const isActive = difficulty === d
          const config = difficultyConfig[d]
          return (
            <button
              type="button"
              key={d}
              onClick={() => setDifficulty(d)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize
                          ring-1 transition-all duration-300 cursor-pointer
                          ${isActive
                            ? `${config.active} shadow-lg ${config.glow}`
                            : 'ring-white/8 text-gray-500 hover:ring-white/15 hover:text-gray-300 hover:bg-white/[0.02]'
                          }
                          active:scale-[0.97]`}
            >
              {d}
            </button>
          )
        })}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="relative bg-gradient-to-r from-indigo-600 to-purple-600
                   hover:from-indigo-500 hover:to-purple-500
                   text-white rounded-xl py-3 text-sm font-semibold
                   transition-all duration-300
                   shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                   hover:scale-[1.02] active:scale-[0.98]
                   disabled:opacity-50 disabled:hover:scale-100
                   cursor-pointer btn-shimmer"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Logging...
            </>
          ) : (
            'Log problem'
          )}
        </span>
      </button>
    </form>
  )
}