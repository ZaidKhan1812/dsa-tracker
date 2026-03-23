'use client'

import { useState } from 'react'
import { addProblem } from '@/app/actions/admin'
import { Plus, Loader2 } from 'lucide-react'

export default function ProblemForm({ topicId }: { topicId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      topic_id: topicId,
      title: formData.get('title') as string,
      difficulty: formData.get('difficulty') as 'easy' | 'medium' | 'hard',
      url: formData.get('url') as string
    }

    await addProblem(data)
    setLoading(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
      <div className="flex gap-2">
        <select 
          name="difficulty" 
          required 
          className="bg-black/20 border border-white/5 rounded-lg text-xs p-2 focus:outline-none"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input 
          name="title" 
          required 
          placeholder="Problem Title" 
          className="flex-1 bg-black/20 border border-white/5 rounded-lg text-xs p-2 focus:outline-none" 
        />
      </div>
      <div className="flex gap-2">
        <input 
          name="url" 
          required 
          placeholder="LeetCode URL" 
          className="flex-1 bg-black/20 border border-white/5 rounded-lg text-xs p-2 focus:outline-none" 
        />
        <button 
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 p-2 rounded-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
        </button>
      </div>
    </form>
  )
}
