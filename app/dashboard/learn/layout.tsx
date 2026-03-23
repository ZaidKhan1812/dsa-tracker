import { createClient } from '@/lib/supabase/server'
import LanguageSelector from '@/components/LanguageSelector'

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // If somehow they bypassed middleware, don't crash
    return null
  }

  // Fetch the user's preferred language from the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('preferred_language')
    .eq('id', user.id)
    .single()

  // If they haven't picked a language yet, show the onboarding screen
  if (!profile?.preferred_language) {
    return <LanguageSelector />
  }

  // If they have picked a language, render the actual curriculum module!
  return (
    <>
      {children}
    </>
  )
}
