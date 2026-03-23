import { getCurriculum } from '@/app/actions/learn'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Settings, Plus, Trash2, Edit3, ExternalLink, ChevronRight } from 'lucide-react'
import { redirect } from 'next/navigation'
import ModuleForm from '@/components/admin/ModuleForm'
import { deleteModule, restoreCurriculum } from '@/app/actions/admin'
import DeleteButton from '@/components/admin/DeleteButton'
import { RefreshCcw, Github } from 'lucide-react'
import ImporterCard from '@/components/admin/ImporterCard'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Double check admin (you can change this email)
  const adminEmails = ['zaidkhan18122007@gmail.com'] // Example
  if (!adminEmails.includes(user.email || '')) {
    redirect('/dashboard')
  }

  const modules = await getCurriculum()

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto py-12 px-6">
      
      {/* ── Admin Header ── */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-indigo-400" />
            Curriculum Admin
          </h1>
          <p className="text-gray-400 mt-2">Manage your DSA modules, topics, and resources.</p>
        </div>
        <div className="flex gap-4">
          <form action={async (formData: FormData) => {
            'use server'
            await restoreCurriculum()
          }}>
            <button className="glass px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all">
              <RefreshCcw className="w-4 h-4" />
              Restore Defaults
            </button>
          </form>
          <Link 
            href="/dashboard/learn"
            className="glass px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/5 transition-all"
          >
            View Live Site
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ── Module List ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-xl font-bold">Existing Modules</h2>
          <div className="grid gap-4">
            {modules.map((mod: any) => (
              <div key={mod.id} className="glass p-6 rounded-[32px] border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 font-bold">
                    {mod.icon || '📦'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{mod.title}</h3>
                    <p className="text-xs text-gray-500">{mod.topics?.length || 0} Topics</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/dashboard/admin/${mod.id}`}
                    className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <DeleteButton 
                    onDelete={async () => {
                      'use server'
                      await deleteModule(mod.id)
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Add New Module ── */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">Add Module</h2>
          <ModuleForm />
        </div>

      </div>

      {/* ── External Importers ── */}
      <div className="flex flex-col gap-8 mt-12 pb-12">
        <div className="flex items-center gap-3">
          <Github className="w-6 h-6 text-gray-500" />
          <h2 className="text-2xl font-black">External Importers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ImporterCard 
            title="freeCodeCamp JS DSA"
            description="Import algorithm scripting and data structure challenges from the official FCC English curriculum."
            blocks={[
              { id: 'basic-data-structures', name: 'Basic Data Structures' },
              { id: 'basic-algorithm-scripting', name: 'Basic Algorithm Scripting' },
              { id: 'intermediate-algorithm-scripting', name: 'Intermediate Algorithm Scripting' },
              { id: 'object-oriented-programming', name: 'Object Oriented Programming' },
              { id: 'functional-programming', name: 'Functional Programming' }
            ]}
          />
        </div>
      </div>

    </div>
  )
}
