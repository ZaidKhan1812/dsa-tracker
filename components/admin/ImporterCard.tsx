'use client'

import { useState } from 'react'
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { importFCCBlock } from '@/app/actions/admin'

interface ImporterCardProps {
  title: string
  description: string
  blocks: { id: string, name: string }[]
}

export default function ImporterCard({ title, description, blocks }: ImporterCardProps) {
  const [selectedBlock, setSelectedBlock] = useState(blocks[0]?.id || '')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleImport() {
    if (!selectedBlock) return
    
    setStatus('loading')
    setError(null)
    
    try {
      const result = await importFCCBlock(selectedBlock)
      if (result.error) {
        throw new Error(result.error)
      }
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="glass p-8 rounded-[40px] border border-white/5 flex flex-col gap-6 relative overflow-hidden group">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
            <Download className="w-5 h-5 text-indigo-400" />
            {title}
          </h3>
          <p className="text-gray-400 text-sm max-w-xs">{description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Select Block</label>
          <select 
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            disabled={status === 'loading'}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
          >
            {blocks.map(block => (
              <option key={block.id} value={block.id} className="bg-slate-900">{block.name}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleImport}
          disabled={status === 'loading'}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-black text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Importing Challenges...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Import Complete!
            </>
          ) : status === 'error' ? (
            <>
              <AlertCircle className="w-4 h-4" />
              Retry Import
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Start Import
            </>
          )}
        </button>

        {error && (
          <p className="text-red-400 text-xs text-center font-bold">{error}</p>
        )}
      </div>

      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <Download className="w-32 h-32" />
      </div>
    </div>
  )
}
