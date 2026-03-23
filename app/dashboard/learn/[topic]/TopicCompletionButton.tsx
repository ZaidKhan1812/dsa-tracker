'use client'

import { useState, useTransition } from 'react'
import { toggleTopicCompletion } from '@/app/actions/learn'
import { CheckCircle2, CircleDashed, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TopicCompletionButton({ 
  topicId, 
  isCompleted: initialCompleted 
}: { 
  topicId: string, 
  isCompleted: boolean 
}) {
  const [isPending, startTransition] = useTransition()
  // Optimistic UI state
  const [completed, setCompleted] = useState(initialCompleted)

  const handleToggle = () => {
    const newValue = !completed
    setCompleted(newValue) // optimistic update

    startTransition(async () => {
      const result = await toggleTopicCompletion(topicId, newValue)
      if (result.error) {
        // Revert on failure
        setCompleted(!newValue)
        alert('Failed to update progress: ' + result.error)
      }
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "w-full p-6 rounded-[32px] border flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group",
        completed 
          ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20" 
          : "bg-white/5 border-white/10 hover:border-indigo-500/30 hover:bg-white/10"
      )}
    >
      {isPending ? (
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      ) : completed ? (
        <CheckCircle2 className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
      ) : (
        <CircleDashed className="w-8 h-8 text-gray-500 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
      )}
      <span className={cn(
        "font-black tracking-widest text-sm uppercase",
        completed ? "text-green-400" : "text-gray-400 group-hover:text-white"
      )}>
        {completed ? 'Completed' : 'Mark as Complete'}
      </span>
    </button>
  )
}
