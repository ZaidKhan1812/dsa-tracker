'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Flame, 
  Tag, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  Target,
  Users,
  Code2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Home() {
  const supabase = createClient()

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    })
  }

  useEffect(() => {
    // Check initial user state
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        window.location.href = '/dashboard'
      }
    })
    
    // Listen for auth changes (like logging in another tab)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = '/dashboard'
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-animated text-white relative overflow-hidden">
      {/* ── Ambient Background Elements ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[120px] animate-float" />
        <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px] animate-float-rev" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] animate-float" />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
        <div className="max-w-7xl w-full flex justify-between items-center glass-strong px-6 py-3 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/20">
              D
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">DSA Tracker</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={loginWithGoogle}
              className="text-sm font-medium hover:text-indigo-400 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={loginWithGoogle}
              className="bg-white text-gray-900 px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Master Consistency</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-gradient"
        >
          Your Journey to <br />
          <span className="text-white">MAANG starts here.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Stop solving blindly. Track your progress, build unshakeable streaks, and 
          visualize your growth across every data structure and algorithm topic.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
        >
          <button 
            onClick={loginWithGoogle}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-bold flex items-center gap-3 overflow-hidden shadow-2xl hover:shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
            Start Tracking for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-950 bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="pl-6 flex flex-col items-start gap-1">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-500 text-xs">★</span>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 font-medium">Joined by 1,000+ developers</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Feature Grid ── */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to <span className="text-gradient">succeed.</span></h2>
          <p className="text-gray-500 mt-4">Tools designed for problem solvers, by problem solvers.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { 
              icon: BarChart3, 
              title: "Visual Progress", 
              desc: "See your growth through beautiful analytics and topic breakdowns. Know exactly where you stand.",
              color: "text-blue-400",
              bg: "bg-blue-500/10"
            },
            { 
              icon: Flame, 
              title: "Streak Tracking", 
              desc: "Consistency is key. Build daily habits with our motivational streak system and heatmap.",
              color: "text-orange-400",
              bg: "bg-orange-500/10"
            },
            { 
              icon: Tag, 
              title: "Smart Tagging", 
              desc: "Organize problems by topic, difficulty, and complexity. Find any solution in seconds.",
              color: "text-purple-400",
              bg: "bg-purple-500/10"
            },
            { 
              icon: Target, 
              title: "Goal Setting", 
              desc: "Define your targets and track your progress towards them. Stay focused on what matters.",
              color: "text-green-400",
              bg: "bg-green-500/10"
            },
            { 
              icon: Code2, 
              title: "Algorithm Mastery", 
              desc: "Curated paths for mastering complex topics like DP, Graphs, and Advanced Trees.",
              color: "text-indigo-400",
              bg: "bg-indigo-500/10"
            },
            { 
              icon: Users, 
              title: "Community Insights", 
              desc: "Compare your progress with peers and learn from common patterns in problem solving.",
              color: "text-pink-400",
              bg: "bg-pink-500/10"
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="glass p-8 rounded-3xl hover:glow-indigo group cursor-default"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500", feature.bg)}>
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Why Tracker? ── */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] mb-8">
              Why settle for <br />
              <span className="text-gradient">average prep?</span>
            </h2>
            <div className="space-y-6">
              {[
                "Track every LeetCode, GFG, and Codeforces problem.",
                "Maintain patterns instead of memorizing solutions.",
                "Build a public portfolio of your solving journey.",
                "Identify weak spots automatically with AI-driven insights."
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                  </div>
                  <p className="text-gray-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="glass rounded-[40px] p-8 aspect-[4/3] flex items-center justify-center shadow-2xl relative overflow-hidden group">
              {/* Inner Mock UI */}
              <div className="w-full h-full bg-indigo-950/20 rounded-3xl border border-white/5 p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-white/10 rounded-full" />
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                    <div className="h-2 w-12 bg-white/10 rounded-full" />
                    <div className="h-6 w-16 bg-white/20 rounded-full" />
                  </div>
                  <div className="h-24 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                    <div className="h-2 w-12 bg-white/10 rounded-full" />
                    <div className="h-6 w-16 bg-white/20 rounded-full" />
                  </div>
                </div>
                <div className="flex-1 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2 p-4">
                   <div className="h-2 w-full bg-white/10 rounded-full" />
                   <div className="h-2 w-[80%] bg-white/10 rounded-full" />
                   <div className="h-2 w-[60%] bg-white/10 rounded-full" />
                </div>
              </div>
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 glass p-6 rounded-3xl glow-indigo shadow-2xl"
              >
                <TrendingUp className="w-8 h-8 text-indigo-400" />
              </motion.div>

              <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto glass rounded-[50px] p-12 md:p-24 text-center glow-indigo relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent" />
          <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10">
            Ready to become <br />
            <span className="text-gradient">unstoppable?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto relative z-10">
            Join thousands of developers tracking their way to top engineering roles. It's free, forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button 
              onClick={loginWithGoogle}
              className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 glass rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-bold">D</div>
          <span className="font-bold text-sm tracking-tight text-white/50">DSA Tracker</span>
        </div>
        <p className="text-gray-600 text-[11px] uppercase tracking-[0.2em] mb-8">
          Built for growth. Master consistency.
        </p>
        <div className="flex justify-center gap-8 text-gray-500 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
        <p className="mt-12 text-gray-700 text-[10px]">
          &copy; 2026 DSA Tracker. All rights reserved.
        </p>
      </footer>
    </main>
  )
}