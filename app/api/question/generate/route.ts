export const dynamic = 'force-dynamic'
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServiceById } from '@/lib/services'
export const runtime='nodejs'

// Amplify only serves configuration. The browser streams directly from the authenticated Lambda.
export async function GET(request: NextRequest) {
  try {
    const supabase=await createClient()
    const {data:{user},error}=await supabase.auth.getUser()
    if(error || !user)return Response.json({error:'Unauthorized'},{status:401})
    const service=request.nextUrl.searchParams.get('service')
    const certification=request.nextUrl.searchParams.get('certification') || 'DVA-C02'
    const definition=service ? getServiceById(service) : undefined
    if(!definition || !definition.certifications.some(cert=>cert===certification))return Response.json({error:'Invalid service or certification'},{status:400})
    if(process.env.APP_ENVIRONMENT === 'staging')return Response.json({error:'Generation is disabled in staging.'},{status:503})
    const endpoint=process.env.AUTHENTICATED_GENERATOR_URL
    if(!endpoint || !/^https:\/\/[a-z0-9]+\.lambda-url\.[a-z0-9-]+\.on\.aws\/$/.test(endpoint))return Response.json({error:'Generated questions are not available yet.'},{status:503})
    return Response.json({endpoint},{headers:{'Cache-Control':'no-store'}})
  } catch {return Response.json({error:'Generation is temporarily unavailable'},{status:503})}
}
