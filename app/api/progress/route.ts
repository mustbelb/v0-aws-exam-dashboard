// app/api/progress/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get progress for all services
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('last_practiced_at', { ascending: false })

    if (progressError) {
      console.error('Progress fetch error:', progressError)
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      )
    }

    // Calculate overall stats
    const totalAttempted = progress?.reduce((sum, p) => sum + p.questions_attempted, 0) || 0
    const totalCorrect = progress?.reduce((sum, p) => sum + p.questions_correct, 0) || 0
    const overallAccuracy = totalAttempted > 0 
      ? Math.round((totalCorrect / totalAttempted) * 100)
      : 0

    // Format per-service progress
    const serviceProgress = progress?.map(row => ({
      service: row.service,
      attempted: row.questions_attempted,
      correct: row.questions_correct,
      accuracy: row.questions_attempted > 0 
        ? Math.round((row.questions_correct / row.questions_attempted) * 100)
        : 0,
      lastPracticed: row.last_practiced_at
    })) || []

    // Get streak (simplified - just check consecutive days)
    const { data: streakData } = await supabase
      .from('user_question_history')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    let streak = 0
    if (streakData && streakData.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let checkDate = new Date(today)
      const practiceDays = new Set(
        streakData.map(d => {
          const date = new Date(d.created_at)
          date.setHours(0, 0, 0, 0)
          return date.toISOString()
        })
      )

      // Check if practiced today or yesterday to start counting
      const todayStr = today.toISOString()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString()

      if (practiceDays.has(todayStr) || practiceDays.has(yesterdayStr)) {
        // Start from today or yesterday
        if (!practiceDays.has(todayStr)) {
          checkDate = yesterday
        }
        
        // Count consecutive days
        while (practiceDays.has(checkDate.toISOString())) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        }
      }
    }

    return NextResponse.json({
      totalQuestions: totalAttempted,
      totalCorrect,
      overallAccuracy,
      streak,
      serviceProgress
    })

  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
