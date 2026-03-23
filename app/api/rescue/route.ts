import { createClient } from '@/lib/supabase/server'
import { curriculum } from '@/lib/curriculum'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Find the Linked List module from the original static data
  const linkedListModule = curriculum.find(m => m.id === 'linked-lists')

  if (!linkedListModule) {
    return NextResponse.json({ error: "Module not found in static data" }, { status: 404 })
  }

  try {
    // 1. Insert Module
    const { error: modError } = await supabase
      .from('curriculum_modules')
      .upsert({
        id: linkedListModule.id,
        title: linkedListModule.title,
        description: linkedListModule.description,
        icon: linkedListModule.icon,
        order_index: 2 // Based on its original position
      })

    if (modError) throw modError

    // 2. Insert Topics, Resources, Problems
    for (const [tIdx, topic] of linkedListModule.topics.entries()) {
      const { error: topicError } = await supabase
        .from('curriculum_topics')
        .upsert({
          id: topic.id,
          module_id: linkedListModule.id,
          title: topic.title,
          description: topic.description,
          difficulty: topic.difficulty,
          order_index: tIdx
        })

      if (topicError) throw topicError

      // Resources
      if (topic.resources.length > 0) {
        const resources = topic.resources.map(r => ({
          topic_id: topic.id,
          type: r.type,
          title: r.title,
          url: r.url
        }))
        const { error: resError } = await supabase.from('curriculum_resources').upsert(resources)
        if (resError) throw resError
      }

      // Problems
      if (topic.practiceProblems.length > 0) {
        const problems = topic.practiceProblems.map(p => ({
          topic_id: topic.id,
          title: p.title,
          difficulty: p.difficulty,
          url: p.url
        }))
        const { error: probError } = await supabase.from('curriculum_problems').upsert(problems)
        if (probError) throw probError
      }
    }

    return NextResponse.json({ success: true, message: "Linked List module restored successfully!" })
  } catch (error: any) {
    console.error("Rescue failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
