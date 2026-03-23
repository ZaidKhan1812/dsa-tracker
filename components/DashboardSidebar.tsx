'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Code2, LogOut, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/' // hard redirect to clear all state
  }

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'LeetCode Sync', href: '/dashboard/leetcode', icon: Code2 },
    { name: 'Learn DSA', href: '/dashboard/learn', icon: BookOpen },
  ]

  return (
    <aside className="w-full md:w-64 glass-strong border-r border-white/5 flex flex-col justify-between shrink-0">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">D</div>
          <span className="font-bold tracking-tight text-xl">DSA Tracker</span>
        </div>

        <nav className="px-4 flex flex-col gap-2 mt-4">
          <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase px-2 mb-2">Menu</div>
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm",
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
