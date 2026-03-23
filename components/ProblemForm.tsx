'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProblemForm() {
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('Arrays')
  const [difficulty, setDifficulty] = useState('easy')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('problems').insert({
      user_id: user.id, title, topic, difficulty
    })
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded-xl">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Problem name e.g. Two Sum"
        className="border rounded-lg px-3 py-2 text-sm"
        required
      />
      <select
        value={topic}
        onChange={e => setTopic(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        {['Arrays','Strings','Linked List','Trees','Graphs','DP','Binary Search'].map(t => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <div className="flex gap-2">
        {['easy','medium','hard'].map(d => (
          <button
            type="button"
            key={d}
            onClick={() => setDifficulty(d)}
            className={`flex-1 py-1.5 rounded-lg text-sm border ${
              difficulty === d ? 'bg-indigo-600 text-white border-indigo-600' : ''
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white rounded-lg py-2 text-sm"
      >
        Log problem
      </button>
    </form>
  )
}