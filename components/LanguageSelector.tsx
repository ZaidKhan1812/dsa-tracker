'use client'

import { useState, useTransition } from 'react'
import { updatePreferredLanguage } from '@/app/actions/learn'
import { Code2, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  { id: 'python', name: 'Python', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { id: 'java', name: 'Java', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'cpp', name: 'C++', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'c', name: 'C', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
]

export default function LanguageSelector() {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (langId: string) => {
    setSelected(langId)
    startTransition(async () => {
      const result = await updatePreferredLanguage(langId)
      if (result.error) {
        alert('Failed to save language: ' + result.error)
        setSelected(null)
      }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto py-12 px-4 text-center">
      
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
        <Code2 className="w-8 h-8" />
      </div>

      <h1 className="text-4xl font-black tracking-tight mb-4">Choose Your Weapon</h1>
      <p className="text-gray-400 text-lg mb-12 max-w-lg">
        Before you dive into the DSA curriculum, let us know which programming language you prefer to learn and practice in.
      </p>

      <div className="grid grid-cols-2 gap-4 w-full">
        {languages.map((lang) => {
          const isSelected = selected === lang.id
          
          return (
            <button
              key={lang.id}
              disabled={isPending}
              onClick={() => handleSelect(lang.id)}
              className={cn(
                "relative group flex flex-col items-center justify-center p-8 rounded-3xl border transition-all active:scale-95 overflow-hidden",
                isSelected ? lang.bg + " " + lang.border : "glass border-white/5 hover:border-white/20 hover:bg-white/5",
                isPending && !isSelected && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  )}
                </div>
              )}
              
              <span className={cn("text-3xl font-black tracking-tight transition-colors", isSelected ? "text-white" : lang.color)}>
                {lang.name}
              </span>
            </button>
          )
        })}
      </div>
      
    </div>
  )
}
