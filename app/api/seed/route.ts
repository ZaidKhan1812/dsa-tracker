import { createClient } from '@/lib/supabase/server'
import { curriculum } from '@/lib/curriculum'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  try {
    for (let i = 0; i < curriculum.length; i++) {
      const mod = curriculum[i]
      
      // 1. Insert Module
      const { error: modErr } = await supabase.from('curriculum_modules').upsert({
        id: mod.id,
        title: mod.title,
        description: mod.description,
        icon: mod.icon,
        order_index: i
      })

      if (modErr) throw new Error(`Module Error (${mod.id}): ${modErr.message}`)

      for (let j = 0; j < mod.topics.length; j++) {
        const topic = mod.topics[j]

        // 2. Insert Topic
        const { error: topErr } = await supabase.from('curriculum_topics').upsert({
          id: topic.id,
          module_id: mod.id,
          title: topic.title,
          description: topic.description,
          difficulty: topic.difficulty,
          order_index: j
        })

        if (topErr) throw new Error(`Topic Error (${topic.id}): ${topErr.message}`)

        // 3. Insert Resources (Delete existing to avoid duplicates on re-run)
        await supabase.from('curriculum_resources').delete().eq('topic_id', topic.id)
        if (topic.resources.length > 0) {
          const { error: resErr } = await supabase.from('curriculum_resources').insert(
            topic.resources.map(r => ({
              topic_id: topic.id,
              type: r.type,
              title: r.title,
              url: r.url
            }))
          )
          if (resErr) throw new Error(`Resource Error (${topic.id}): ${resErr.message}`)
        }

        // 4. Insert Problems
        await supabase.from('curriculum_problems').delete().eq('topic_id', topic.id)
        if (topic.practiceProblems.length > 0) {
          const { error: probErr } = await supabase.from('curriculum_problems').insert(
            topic.practiceProblems.map(p => ({
              topic_id: topic.id,
              title: p.title,
              difficulty: p.difficulty,
              url: p.url
            }))
          )
          if (probErr) throw new Error(`Problem Error (${topic.id}): ${probErr.message}`)
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Seeded successfully' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
