import { getCurriculum } from '@/app/actions/learn'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Trash2, Plus, PlayCircle, BookOpen, ExternalLink, Activity } from 'lucide-react'
import TopicForm from '@/components/admin/TopicForm'
import ResourceForm from '@/components/admin/ResourceForm'
import ProblemForm from '@/components/admin/ProblemForm'
import { deleteTopic } from '@/app/actions/admin'

export default async function ModuleAdminPage({ params }: { params: { moduleId: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminEmails = ['zaidkhan1812s@gmail.com'] // Example
  if (!adminEmails.includes(user.email || '')) redirect('/dashboard')

  const curriculum = await getCurriculum()
  const currentModule = curriculum.find((m: any) => m.id === params.moduleId)

  if (!currentModule) notFound()

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto py-12 px-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/admin"
          className="text-gray-500 hover:text-white flex items-center gap-2 font-bold text-sm w-fit transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight">{currentModule.title}</h1>
            <p className="text-gray-400 mt-2">Manage topics, resources, and problems for this module.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ── Topics List ── */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <h2 className="text-xl font-bold">Module Topics</h2>
          
          <div className="flex flex-col gap-6">
            {currentModule.topics?.map((topic: any) => (
              <div key={topic.id} className="glass p-8 rounded-[40px] border border-white/5 flex flex-col gap-8 group relative overflow-hidden">
                
                {/* Topic Header */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                        {topic.difficulty}
                      </span>
                      <h3 className="text-2xl font-black tracking-tight">{topic.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">{topic.description}</p>
                  </div>
                  
                  <form action={async () => {
                    'use server'
                    await deleteTopic(topic.id, currentModule.id)
                  }}>
                    <button className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                  
                  {/* Resources Section */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <PlayCircle className="w-3 h-3" />
                      Resources
                    </h4>
                    <div className="flex flex-col gap-2">
                      {topic.resources?.map((res: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-xs">
                          <span className="font-bold text-gray-300 truncate max-w-[150px]">{res.title}</span>
                          <ExternalLink className="w-3 h-3 text-gray-600" />
                        </div>
                      ))}
                      <ResourceForm topicId={topic.id} />
                    </div>
                  </div>

                  {/* Problems Section */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      Problems
                    </h4>
                    <div className="flex flex-col gap-2">
                      {topic.practiceProblems?.map((prob: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-xs">
                          <span className="font-bold text-gray-300 truncate max-w-[150px]">{prob.title}</span>
                          <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{prob.difficulty}</span>
                        </div>
                      ))}
                      <ProblemForm topicId={topic.id} />
                    </div>
                  </div>

                </div>

                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                  <Activity className="w-48 h-48" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Add New Topic ── */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">New Topic</h2>
          <TopicForm moduleId={currentModule.id} />
        </div>

      </div>

    </div>
  )
}
