import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft,
  Calendar,
  Tag,
  Trophy,
  CheckCircle2,
  Clock,
  ExternalLink,
  Code2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ProblemActions from '@/components/ProblemActions'

export default async function ProblemDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: problem } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id)
    .single()

  if (!problem) notFound()

  return (
    <main className="min-h-screen bg-gradient-animated text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        
        <a href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </a>

        <div className="glass rounded-[40px] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <div className={cn(
              "px-4 py-2 rounded-2xl text-[10px] uppercase font-black tracking-widest border",
              problem.difficulty === 'easy' ? "bg-green-500/10 border-green-500/20 text-green-400" :
              problem.difficulty === 'medium' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-red-500/10 border-red-500/20 text-red-400"
            )}>
              {problem.difficulty}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 flex items-center justify-center">
              <Code2 className="w-8 h-8 text-indigo-400" />
            </div>

            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">{problem.title}</h1>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-widest">{problem.topic}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Logged on {new Date(problem.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-white/5" />

            <div className="space-y-6">
              <h3 className="text-lg font-bold">Problem Insights</h3>
              <p className="text-gray-500 leading-relaxed">
                This problem belongs to the <span className="text-white font-bold">{problem.topic}</span> module. 
                Regular practice with {problem.difficulty} problems in this category builds a strong foundation 
                for competitive programming and technical interviews.
              </p>
              
              <ProblemActions problem={problem} />
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
