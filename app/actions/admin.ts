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
export async function restoreCurriculum() {
  if (!await isAdmin()) return { error: 'Unauthorized' }
  const supabase = await createClient()

  try {
    const { curriculum } = await import('@/lib/curriculum')
    for (const mod of curriculum) {
      // Upsert Module
      await supabase.from('curriculum_modules').upsert({
        id: mod.id,
        title: mod.title,
        description: mod.description,
        icon: mod.icon,
        order_index: curriculum.indexOf(mod)
      })

      // Upsert Topics
      for (const [tIdx, topic] of mod.topics.entries()) {
        await supabase.from('curriculum_topics').upsert({
          id: topic.id,
          module_id: mod.id,
          title: topic.title,
          description: topic.description,
          difficulty: topic.difficulty,
          order_index: tIdx
        })

        // Upsert Resources & Problems
        if (topic.resources.length > 0) {
          await supabase.from('curriculum_resources').upsert(
            topic.resources.map(r => ({ topic_id: topic.id, type: r.type, title: r.title, url: r.url }))
          )
        }
        if (topic.practiceProblems.length > 0) {
          await supabase.from('curriculum_problems').upsert(
            topic.practiceProblems.map(p => ({ topic_id: topic.id, title: p.title, difficulty: p.difficulty, url: p.url }))
          )
        }
      }
    }
    revalidatePath('/dashboard/learn')
    revalidatePath('/dashboard/admin')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
