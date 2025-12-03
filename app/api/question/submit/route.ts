// app/api/question/submit/route.ts
import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { 
      service, 
      topic, 
      questionText, 
      correctAnswer, 
      userAnswer, 
      timeTakenSeconds 
    } = body

    // Validate required fields
    if (!service || !questionText || !correctAnswer || !userAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create hash of question for deduplication
    const questionHash = crypto
      .createHash('sha256')
      .update(questionText)
      .digest('hex')
      .substring(0, 32)

    const answeredCorrectly = userAnswer === correctAnswer

    // Insert into user_question_history
    const { error: insertError } = await supabase
      .from('user_question_history')
      .insert({
        user_id: user.id,
        service,
        topic: topic || null,
        question_hash: questionHash,
        question_text: questionText,
        correct_answer: correctAnswer,
        user_answer: userAnswer,
        answered_correctly: answeredCorrectly,
        time_taken_seconds: timeTakenSeconds || null
      })

    if (insertError) {
      // If duplicate question, that's okay - just log it
      if (insertError.code === '23505') {
        console.log('User already answered this question')
      } else {
        console.error('Insert error:', insertError)
        return NextResponse.json(
          { error: 'Failed to save answer' },
          { status: 500 }
        )
      }
    }

    // Update progress using RPC function
    const { error: progressError } = await supabase.rpc('increment_progress', {
      p_user_id: user.id,
      p_service: service,
      p_correct: answeredCorrectly
    })

    if (progressError) {
      console.error('Progress update error:', progressError)
      // Don't fail the request - answer was still saved
    }

    return NextResponse.json({
      success: true,
      answeredCorrectly,
      questionHash
    })

  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
