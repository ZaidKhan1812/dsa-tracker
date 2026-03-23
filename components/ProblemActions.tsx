'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function ProblemActions({ problem }: { problem: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Edit State
  const [title, setTitle] = useState(problem.title)
  const [topic, setTopic] = useState(problem.topic)
  const [difficulty, setDifficulty] = useState(problem.difficulty)

  const supabase = createClient()
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this problem?')) return

    setLoading(true)
    const { error } = await supabase
      .from('problems')
      .delete()
      .eq('id', problem.id)

    if (error) {
      alert('Error deleting problem: ' + error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  async function handleSave() {
    setLoading(true)
    const { error } = await supabase
      .from('problems')
      .update({ title, topic, difficulty })
      .eq('id', problem.id)

    if (error) {
      alert('Error updating problem: ' + error.message)
      setLoading(false)
    } else {
      setIsEditing(false)
      setLoading(false)
      router.refresh()
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10">
        <h4 className="font-bold mb-4">Edit Problem</h4>
        <input 
          type="text" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="input-glass w-full"
          placeholder="Problem Name"
        />
        <div className="flex gap-4">
          <select 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="input-glass flex-1"
          >
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Linked Lists">Linked Lists</option>
            <option value="Trees">Trees</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
            <option value="Graphs">Graphs</option>
            <option value="Math">Math</option>
            <option value="Other">Other</option>
          </select>
          <select 
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="input-glass flex-1"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex gap-4 pt-4">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <button 
        onClick={() => setIsEditing(true)}
        disabled={loading}
        className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
      >
        Edit Problem
      </button>
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 text-red-400 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Delete
      </button>
    </div>
  )
}
