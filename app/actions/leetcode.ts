'use server'

import { createClient } from '@/lib/supabase/server'

const LEETCODE_GQL_URL = 'https://leetcode.com/graphql'

export async function fetchLeetCodeStats(username: string) {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `

  try {
    const response = await fetch(LEETCODE_GQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }),
    })

    const result = await response.json()
    if (result.errors) {
      return { error: result.errors[0].message }
    }

    const stats = result.data.matchedUser?.submitStats?.acSubmissionNum
    if (!stats) return { error: 'User not found' }

    return {
      total: stats.find((s: any) => s.difficulty === 'All')?.count || 0,
      easy: stats.find((s: any) => s.difficulty === 'Easy')?.count || 0,
      medium: stats.find((s: any) => s.difficulty === 'Medium')?.count || 0,
      hard: stats.find((s: any) => s.difficulty === 'Hard')?.count || 0,
    }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function syncLeetCodeSubmissions(username: string) {
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `

  try {
    const response = await fetch(LEETCODE_GQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username, limit: 20 } }),
    })

    const result = await response.json()
    if (result.errors) return { error: result.errors[0].message }

    const submissions = result.data.recentAcSubmissionList || []
    if (submissions.length === 0) return { success: true, count: 0 }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Get current problems to avoid duplicates
    const { data: existingProblems } = await supabase
      .from('problems')
      .select('title')
      .eq('user_id', user.id)

    const existingTitles = new Set(existingProblems?.map(p => p.title) || [])
    
    let newCount = 0
    for (const sub of submissions) {
      if (!existingTitles.has(sub.title)) {
        // Note: LeetCode's recentAcSubmissionList doesn't return difficulty/topic directly.
        // For a true "one-click" sync, we'd need to fetch detail for each titleSlug, 
        // but that's expensive. For now, we'll mark them as 'medium' and 'Other' 
        // to encourage the user to check them.
        
        await supabase.from('problems').insert({
          user_id: user.id,
          title: sub.title,
          difficulty: 'medium', // Default
          topic: 'Other', // Default
          created_at: new Date(parseInt(sub.timestamp) * 1000).toISOString()
        })
        newCount++
      }
    }

    return { success: true, count: newCount }
  } catch (err: any) {
    return { error: err.message }
  }
}
