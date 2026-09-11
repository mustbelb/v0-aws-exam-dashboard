import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let body
    try { body = await request.json() } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid answer' }, { status: 400 })
    const { issuanceId, userAnswer, timeTakenSeconds } = body
    if (Object.keys(body).some(key => !['issuanceId','userAnswer','timeTakenSeconds'].includes(key))
      || typeof issuanceId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(issuanceId)
      || typeof userAnswer !== 'string' || !/^[A-D]$/i.test(userAnswer)
      || (timeTakenSeconds != null && (!Number.isInteger(timeTakenSeconds) || timeTakenSeconds < 0 || timeTakenSeconds > 86400))) {
      return NextResponse.json({ error: 'Invalid answer parameters' }, { status: 400 })
    }
    const { data, error } = await supabase.rpc('submit_issued_answer', {
      p_issuance_id: issuanceId, p_user_answer: userAnswer.toUpperCase(),
      p_time_taken_seconds: timeTakenSeconds ?? null
    })
    if (error) {
      if (error.code === 'P0002') return NextResponse.json({error:'Question not found. Please load a new question.'},{status:404})
      if (error.code === '22023') return NextResponse.json({error:'This question has expired or the answer is invalid. Please load a new question.'},{status:400})
      console.error('Answer transaction failed:', error.code)
      return NextResponse.json({ error: 'Your answer could not be saved. Please try again.' }, { status: 500 })
    }
    if (!data?.success || !Array.isArray(data.serviceProgress)) throw new Error('Invalid save response')
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Your answer could not be saved. Please try again.' }, { status: 500 })
  }
}
