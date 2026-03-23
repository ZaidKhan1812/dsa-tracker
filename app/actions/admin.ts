'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Checks if the current user is an admin.
 * For this MVP, we can check for a specific email or a role in the profile.
 */
async function isAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // You can customize this email to your own
  const adminEmails = ['zaidkhan18122007@gmail.com'] // Example
  return adminEmails.includes(user?.email || '')
}

export async function addModule(data: { id: string, title: string, description: string, icon: string, order_index: number }) {
  if (!await isAdmin()) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase.from('curriculum_modules').insert(data)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/learn')
  revalidatePath('/dashboard/admin')
  return { success: true }
}

export async function deleteModule(moduleId: string) {
  if (!await isAdmin()) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase.from('curriculum_modules').delete().eq('id', moduleId)
  if (error) return { error: error.message }

  revalidatePath('/dashboard/learn')
  revalidatePath('/dashboard/admin')
  return { success: true }
}

export async function addTopic(data: { id: string, module_id: string, title: string, description: string, difficulty: string, order_index: number }) {
  if (!await isAdmin()) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase.from('curriculum_topics').insert(data)
  if (error) {
    console.error("Error adding topic:", error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/learn')
  revalidatePath(`/dashboard/learn/${data.id}`)
  revalidatePath(`/dashboard/admin/${data.module_id}`)
  return { success: true }
}

export async function deleteTopic(topicId: string, moduleId: string) {
  if (!await isAdmin()) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase.from('curriculum_topics').delete().eq('id', topicId)
  if (error) {
    console.error("Error deleting topic:", error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/learn')
  revalidatePath(`/dashboard/admin/${moduleId}`)
  return { success: true }
}

export async function addResource(data: { topic_id: string, type: 'video' | 'article', title: string, url: string }) {
  if (!await isAdmin()) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase.from('curriculum_resources').insert(data)
  if (error) return { error: error.message }

  revalidatePath(`/dashboard/learn/${data.topic_id}`)
  return { success: true }
}

export async function addProblem(data: { topic_id: string, title: string, difficulty: 'easy' | 'medium' | 'hard', url: string }) {
  if (!await isAdmin()) return { error: 'Unauthorized' }
  const supabase = await createClient()

  const { error } = await supabase.from('curriculum_problems').insert(data)
  if (error) return { error: error.message }

  revalidatePath(`/dashboard/learn/${data.topic_id}`)
  return { success: true }
}
