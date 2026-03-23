import { getLearningProgress, getCurriculum } from '@/app/actions/learn'
import Link from 'next/link'
import { BookOpen, CheckCircle2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function LearnOverviewPage() {
  const [progressResult, curriculum] = await Promise.all([
    getLearningProgress(),
    getCurriculum()
  ])
  const completedTopics = (progressResult as any).completedTopics || []

  // Calculate overall progress
  const totalTopics = (curriculum as any[]).reduce((acc, mod) => acc + (mod.topics?.length || 0), 0)
  const completedCount = completedTopics.length
  const progressPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto py-8">
      
      {/* ── Header ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Learn DSA</h1>
            <p className="text-gray-400 mt-1 font-medium">Master Data Structures and Algorithms from scratch.</p>
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="mt-6 glass p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-bold text-sm tracking-widest text-gray-500 uppercase">Overall Progress</h3>
            <span className="text-3xl font-black text-indigo-400">{progressPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 font-bold mt-3 text-right">
            {completedCount} of {totalTopics} topics completed
          </p>
        </div>
      </div>

      {/* ── Curriculum Modules ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {curriculum.map((mod: any, idx: number) => {
          const modTotal = mod.topics?.length || 0
          const modCompleted = mod.topics?.filter((t: any) => completedTopics.includes(t.id)).length || 0
          const modProgress = modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0
          const isFullyCompleted = modCompleted === modTotal && modTotal > 0

          return (
            <div key={mod.id} className="glass p-8 rounded-[32px] border border-white/5 flex flex-col hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-black">{mod.title}</h2>
                {isFullyCompleted && <CheckCircle2 className="w-6 h-6 text-green-400" />}
              </div>
              <p className="text-sm text-gray-400 mb-8 flex-1 leading-relaxed">
                {mod.description}
              </p>
              
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{modCompleted}/{modTotal}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      isFullyCompleted ? "bg-green-400" : "bg-indigo-500"
                    )}
                    style={{ width: `${modProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {mod.topics?.map((topic: any) => {
                  const isTopicCompleted = completedTopics.includes(topic.id)
                  return (
                    <Link 
                      key={topic.id}
                      href={`/dashboard/learn/${topic.id}`}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        {isTopicCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-white/10 shrink-0" />
                        )}
                        <span className={cn("font-bold text-sm", isTopicCompleted ? "text-gray-300" : "text-white")}>
                          {topic.title}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
