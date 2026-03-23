import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // Robust Server-Side Auth Verification
  // This reads cookies on the server, before any HTML is sent, preventing UI flicker.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Ensure Profile Exists (moved from client page to server layout)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    const defaultUsername = user.user_metadata?.full_name?.toLowerCase().replace(/\s/g, '_') ?? user.email?.split('@')[0] ?? `user_${user.id.slice(0, 5)}`
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ id: user.id, username: defaultUsername })

    if (insertError?.code === '23505') {
       await supabase.from('profiles').insert({ id: user.id, username: `${defaultUsername}_${user.id.slice(0, 4)}` })
    }
  }

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User'
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-animated text-white overflow-hidden">
      <DashboardSidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Simple Header for Mobile + Profile info */}
        <header className="sticky top-0 z-40 bg-transparent px-6 py-4 flex justify-between md:justify-end items-center pointer-events-none">
           <div className="md:hidden glass px-4 py-2 rounded-xl pointer-events-auto font-bold tracking-tight">
             DSA Tracker
           </div>
           
           <div className="glass px-3 py-1.5 rounded-xl flex items-center gap-3 pointer-events-auto shadow-[0_0_15px_rgba(99,102,241,0.1)]">
             {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-200 hidden sm:block">{displayName}</span>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 pt-0">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
