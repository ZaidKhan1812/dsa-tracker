'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getLearningProgress() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('learning_progress')
    .select('topic_id')
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { completedTopics: data.map(row => row.topic_id) as string[] }
}

export async function toggleTopicCompletion(topicId: string, isCompleted: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  if (isCompleted) {
    // Add to progress
    const { error } = await supabase
      .from('learning_progress')
      .insert({ user_id: user.id, topic_id: topicId })
    
    // Ignore 409 conflict if already completed
    if (error && error.code !== '23505') {
      return { error: error.message }
    }
  } else {
    // Remove from progress
    const { error } = await supabase
      .from('learning_progress')
      .delete()
      .match({ user_id: user.id, topic_id: topicId })

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/dashboard/learn')
  revalidatePath(`/dashboard/learn/${topicId}`)
  return { success: true }
}
