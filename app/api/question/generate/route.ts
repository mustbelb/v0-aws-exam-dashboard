// app/api/question/generate/route.ts
import { type NextRequest } from "next/server"

export const runtime = 'edge'
export const maxDuration = 60

const LAMBDA_URL = process.env.QUESTION_GENERATOR_LAMBDA_URL!

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const service = searchParams.get('service')
    const topic = searchParams.get('topic')
    const userId = searchParams.get('userId')
    const certification = searchParams.get('certification') || 'SAA-C03'

    if (!service) {
      return new Response(
        JSON.stringify({ error: 'Missing service parameter' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Build query params for Lambda
    const params = new URLSearchParams()
    params.append('service', service)
    params.append('certification', certification)
    if (topic) params.append('topic', topic)
    if (userId) params.append('userId', userId)

    const lambdaResponse = await fetch(`${LAMBDA_URL}?${params.toString()}`, {
      method: 'GET',
      headers: { 'Accept': 'text/event-stream' }
    })

    if (!lambdaResponse.ok) {
      console.error(`Lambda error: ${lambdaResponse.status}`)
      return new Response(
        JSON.stringify({ error: `Lambda error: ${lambdaResponse.status}` }),
        { status: lambdaResponse.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Stream the response through
    return new Response(lambdaResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      }
    })

  } catch (error) {
    console.error('Stream error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Stream failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
