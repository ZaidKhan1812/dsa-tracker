import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProblemForm from '@/components/ProblemForm'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: problems } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-medium mb-2">Your DSA Tracker</h1>
      <p className="text-sm text-gray-500 mb-6">Logged in as {user.email}</p>

      <ProblemForm />

      <div className="mt-8 flex flex-col gap-3">
        {problems && problems.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            No problems logged yet. Add your first one above!
          </p>
        )}
        {problems?.map(p => (
          <div key={p.id} className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">{p.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.topic}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              p.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              p.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {p.difficulty}
            </span>
          </div>
        ))}
      </div>
    </main>
  )
}