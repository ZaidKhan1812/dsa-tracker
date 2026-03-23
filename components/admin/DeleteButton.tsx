'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  confirmMessage?: string
  className?: string
}

export default function DeleteButton({ 
  onDelete, 
  confirmMessage = "Are you sure you want to delete this? This action cannot be undone.",
  className
}: DeleteButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAction(e: React.MouseEvent) {
    e.preventDefault()
    
    if (!isConfirming) {
      setIsConfirming(true)
      // Auto-cancel after 3 seconds if not clicked again
      setTimeout(() => setIsConfirming(false), 3000)
      return
    }

    setLoading(true)
    await onDelete()
    setLoading(false)
    setIsConfirming(false)
  }

  return (
    <button 
      onClick={handleAction}
      disabled={loading}
      className={cn(
        "p-3 rounded-xl transition-all flex items-center gap-2 font-bold text-xs shrink-0",
        isConfirming 
          ? "bg-red-500 text-white px-4 ring-4 ring-red-500/20" 
          : "bg-red-500/10 text-red-400 hover:bg-red-500/20",
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      {isConfirming && <span>Click to Confirm</span>}
    </button>
  )
}
