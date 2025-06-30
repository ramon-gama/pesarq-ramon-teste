
import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { WelcomeEmail } from './_templates/welcome-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeEmailRequest {
  userName: string
  userEmail: string
  resetPasswordUrl: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    })
  }

  try {
    const { userName, userEmail, resetPasswordUrl }: WelcomeEmailRequest = await req.json()

    console.log('Enviando email de boas-vindas para:', userEmail)
    console.log('Link de configuração de senha:', resetPasswordUrl)

    const platformUrl = Deno.env.get('SUPABASE_URL') || 'https://cestnycgnhgoraefojke.supabase.co'

    const html = await renderAsync(
      React.createElement(WelcomeEmail, {
        userName,
        userEmail,
        resetPasswordUrl,
        platformUrl,
      })
    )

    const { data, error } = await resend.emails.send({
      from: 'PESARQ <noreply@resend.dev>',
      to: [userEmail],
      subject: '🎉 Bem-vindo à Plataforma PESARQ! Configure sua conta',
      html,
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      throw error
    }

    console.log('Email enviado com sucesso:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email de boas-vindas enviado com sucesso',
        emailId: data?.id 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error: any) {
    console.error('Erro na função send-welcome-email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})
