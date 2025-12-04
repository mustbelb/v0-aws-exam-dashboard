// app/api/question/submit/route.ts
import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      questionId,
      service, 
      certification = 'DVA-C02',
      topic, 
      questionText, 
      correctAnswer, 
      userAnswer, 
      timeTakenSeconds 
    } = body

    if (!service || !questionText || !correctAnswer || !userAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const questionHash = crypto
      .createHash('sha256')
      .update(questionText)
      .digest('hex')
      .substring(0, 32)

    const answeredCorrectly = userAnswer.toUpperCase() === correctAnswer.toUpperCase()

    const { error: insertError } = await supabase
      .from('user_question_history')
      .insert({
        user_id: user.id,
        question_id: questionId || questionHash,
        service,
        certification,
        topic: topic || null,
        question_hash: questionHash,
        question_text: questionText,
        correct_answer: correctAnswer,
        user_answer: userAnswer,
        answered_correctly: answeredCorrectly,
        time_taken_seconds: timeTakenSeconds || null
      })

    if (insertError) {
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

    const { error: progressError } = await supabase.rpc('increment_progress', {
      p_user_id: user.id,
      p_service: service,
      p_certification: certification,
      p_correct: answeredCorrectly
    })

    if (progressError) {
      console.error('Progress update error:', progressError)
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
