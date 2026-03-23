'use client'

import { useState } from 'react'
import { addModule } from '@/app/actions/admin'
import { Plus, Loader2 } from 'lucide-react'

export default function ModuleForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
      order_index: parseInt(formData.get('order_index') as string || '0')
    }

    const result = await addModule(data)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      (e.target as HTMLFormElement).reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl border border-white/5 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Module ID (e.g., arrays)</label>
        <input 
          name="id" 
          required 
          className="glass border-white/5 p-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 bg-white/5" 
          placeholder="lowercasewithoutspaces"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
        <input 
          name="title" 
          required 
          className="glass border-white/5 p-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 bg-white/5" 
          placeholder="Arrays & Hashing"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Icon (Emoji or Icon Name)</label>
        <input 
          name="icon" 
          className="glass border-white/5 p-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 bg-white/5" 
          placeholder="📦"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Order Index</label>
        <input 
          name="order_index" 
          type="number" 
          className="glass border-white/5 p-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 bg-white/5" 
          placeholder="0, 1, 2..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
        <textarea 
          name="description" 
          className="glass border-white/5 p-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 bg-white/5 h-32 resize-none" 
          placeholder="Summarize this module..."
        />
      </div>

      {error && <p className="text-red-400 text-xs font-bold px-2">{error}</p>}

      <button 
        disabled={loading}
        className="w-full p-5 rounded-2xl bg-indigo-500 font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />}
        Create Module
      </button>
    </form>
  )
}
