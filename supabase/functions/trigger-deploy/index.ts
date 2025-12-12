// Supabase Edge Function para disparar deploy quando post é publicado
// Para usar: copie este arquivo para Supabase Dashboard > Edge Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const EASYPANEL_WEBHOOK_URL = Deno.env.get('EASYPANEL_WEBHOOK_URL') || 
  'http://3.22.177.77:3000/api/deploy/39afd64789632715720dd3009dc3f6b1ac22cffade6c57e8'

serve(async (req) => {
  try {
    const { record } = await req.json()
    
    // Verificar se o post está publicado
    if (record.published === true) {
      console.log(`📝 Post publicado: ${record.slug}`)
      
      // Chamar webhook do Easypanel
      const response = await fetch(EASYPANEL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: 'ghcr.io/[seu-usuario]/aerion-elevate-hub:latest',
          tag: 'latest'
        })
      })
      
      if (response.ok) {
        console.log('✅ Webhook chamado com sucesso')
        return new Response(
          JSON.stringify({ success: true, message: 'Deploy triggered' }),
          { headers: { 'Content-Type': 'application/json' }, status: 200 }
        )
      } else {
        const errorText = await response.text()
        throw new Error(`Webhook failed: ${response.status} - ${errorText}`)
      }
    }
    
    return new Response(
      JSON.stringify({ success: false, message: 'Post not published' }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('❌ Erro:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

