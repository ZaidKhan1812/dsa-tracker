import { getLearningProgress, getCurriculum } from '@/app/actions/learn'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, PlayCircle, BookOpen, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import TopicCompletionButton from './TopicCompletionButton'

export default async function TopicDetailPage({ params }: { params: { topic: string } }) {
  // Fetch curriculum from DB
  const curriculum = await getCurriculum()

  // Find the topic in the curriculum
  let currentTopic: any = null
  let currentModule: any = null

  for (const mod of curriculum) {
    const topic = mod.topics?.find((t: any) => t.id === params.topic)
    if (topic) {
      currentTopic = topic
      currentModule = mod
      break
    }
  }

  if (!currentTopic || !currentModule) {
    notFound()
  }

  // Get user progress
  const progressResult = await getLearningProgress()
  const completedTopics = (progressResult as any).completedTopics || []
  const isCompleted = completedTopics.includes(currentTopic.id)

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
      
      {/* ── Navigation ── */}
      <Link 
        href="/dashboard/learn"
        className="text-gray-500 hover:text-white flex items-center gap-2 font-bold text-sm w-fit transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Learn DSA Roadmap
      </Link>

      {/* ── Header ── */}
      <div className="glass p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BookOpen className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-4">
          <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">
            {currentModule.title}
          </span>
          <h1 className="text-4xl font-black tracking-tight">{currentTopic.title}</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            {currentTopic.description}
          </p>
          
          <div className="flex items-center gap-3 mt-4">
            <span className={cn(
              "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider",
              currentTopic.difficulty === 'easy' ? "bg-green-500/10 text-green-400" :
              currentTopic.difficulty === 'medium' ? "bg-yellow-500/10 text-yellow-400" : "bg-red-500/10 text-red-400"
            )}>
              {currentTopic.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* ── Main Content (Resources) ── */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <PlayCircle className="w-4 h-4" />
            </div>
            Learning Resources
          </h2>
          
          <div className="flex flex-col gap-4">
            {currentTopic.resources?.map((res: any, idx: number) => (
              <a 
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-6 rounded-3xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/5 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{res.title}</span>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Sidebar (Practice & Completion) ── */}
        <div className="flex flex-col gap-6">
          <div className="glass p-6 rounded-[32px] border border-white/5">
            <h3 className="font-black mb-6 uppercase tracking-widest text-xs text-gray-500">Practice Problems</h3>
            
            <div className="flex flex-col gap-3">
              {currentTopic.practiceProblems?.map((prob: any, idx: number) => (
                <a 
                  key={idx}
                  href={prob.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="font-bold text-sm text-gray-300">{prob.title}</span>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] uppercase font-black tracking-wider",
                      prob.difficulty === 'easy' ? "text-green-500" :
                      prob.difficulty === 'medium' ? "text-yellow-500" : "text-red-500"
                    )}>
                      {prob.difficulty}
                    </span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Completion Toggle */}
          <TopicCompletionButton 
            topicId={currentTopic.id} 
            isCompleted={isCompleted} 
          />
        </div>

      </div>
    </div>
  )
}
