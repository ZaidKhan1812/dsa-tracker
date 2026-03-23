import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { 
  Trophy, 
  CheckCircle2, 
  Clock, 
  BarChart2,
  Calendar,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  // In a real app, we'd look up the user by a 'username' field. 
  // For this demo, we'll assume the email prefix is the username.
  // We'll search for the user who has this 'username'.
  // This is a bit tricky with Supabase Auth alone, usually you'd have a 'profiles' table.
  // Let's assume there is a profiles table or just mock it if it doesn't exist.
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  // If no profile, we can't show much. Let's try to get problems for this user id if we found one.
  if (!profile) {
    // Fallback: If no profiles table, maybe we can't show public profiles yet.
    // For now, let's create a beautiful "User not found" or "Coming soon" if the table is missing.
    return (
      <main className="min-h-screen bg-[#050510] flex items-center justify-center p-6 text-center">
        <div className="glass p-12 rounded-[40px] max-w-md glow-indigo">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Public Profiles</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            The public profile for <span className="text-indigo-400 font-bold">@{username}</span> is coming soon. 
            Stay tuned as we roll out social features!
          </p>
          <a href="/" className="px-8 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm">
            Go back home
          </a>
        </div>
      </main>
    )
  }

  const { data: problems } = await supabase
    .from('problems')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  const stats = {
    total: problems?.length ?? 0,
    easy: problems?.filter(p => p.difficulty === 'easy').length ?? 0,
    medium: problems?.filter(p => p.difficulty === 'medium').length ?? 0,
    hard: problems?.filter(p => p.difficulty === 'hard').length ?? 0,
  }

  return (
    <main className="min-h-screen bg-gradient-animated text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-[38px] bg-[#050510] flex items-center justify-center text-4xl font-black">
              {username[0].toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">@{username}</h1>
            <p className="text-gray-500 font-medium">Solving their way to mastery.</p>
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-bold">Level 12 Solvers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-white', icon: BarChart2 },
            { label: 'Easy', value: stats.easy, color: 'text-green-400', icon: CheckCircle2 },
            { label: 'Medium', value: stats.medium, color: 'text-yellow-400', icon: Clock },
            { label: 'Hard', value: stats.hard, color: 'text-red-400', icon: Trophy },
          ].map((s, i) => (
            <div key={i} className="glass rounded-[32px] p-6 hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-4">
                 <s.icon className={cn("w-5 h-5", s.color)} />
                 <span className="text-[10px] items-center uppercase font-black tracking-widest text-gray-600">{s.label}</span>
              </div>
              <p className={cn("text-4xl font-black", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Solves */}
        <div className="glass rounded-[40px] p-8 md:p-12">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <span className="w-2 h-8 rounded-full bg-indigo-500" />
            Recent Successes
          </h3>
          <div className="flex flex-col gap-4">
            {problems?.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    p.difficulty === 'easy' ? "bg-green-500" :
                    p.difficulty === 'medium' ? "bg-yellow-500" : "bg-red-500"
                  )} />
                  <span className="font-bold group-hover:text-indigo-400 transition-colors">{p.title}</span>
                </div>
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{p.topic}</span>
              </div>
            ))}
            {(!problems || problems.length === 0) && (
              <p className="text-gray-600 text-center py-12 italic">No problems publicly loggged yet.</p>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
