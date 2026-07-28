// Triggered via Supabase Database Webhook on messages INSERT.
// Webhook URL: https://<project-ref>.supabase.co/functions/v1/notify-new-message
// Headers: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM_EMAIL = 'notifications@getparvalue.com'
const SITE_URL = 'https://getparvalue.com'

Deno.serve(async (req) => {
  const payload = await req.json()
  const message = payload.record

  if (!message) return new Response('No record', { status: 400 })

  const { recipient_id, sender_id, listing_id, body } = message

  // Don't email if sender and recipient are the same (system messages to self)
  if (recipient_id === sender_id) return new Response('Same user', { status: 200 })

  // Get recipient email
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const recipient = users?.find(u => u.id === recipient_id)
  if (!recipient?.email) return new Response('No recipient email', { status: 200 })

  // Get sender profile name
  const { data: sender } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', sender_id)
    .maybeSingle()

  // Get listing info for context
  const { data: listing } = await supabase
    .from('listings')
    .select('brand, model')
    .eq('id', listing_id)
    .maybeSingle()

  const senderName = sender?.full_name || 'Someone'
  const listingName = listing ? `${listing.brand} ${listing.model}` : 'a listing'
  const recipientName = recipient.user_metadata?.full_name?.split(' ')[0] || ''
  const messageUrl = `${SITE_URL}/messages.html?listing=${listing_id}&with=${sender_id}`
  const preview = body.length > 120 ? body.slice(0, 120) + '…' : body

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Par Value <${FROM_EMAIL}>`,
      to: recipient.email,
      subject: `${senderName} sent you a message about ${listingName}`,
      html: `
        <p>Hi${recipientName ? ` ${recipientName}` : ''},</p>
        <p><strong>${senderName}</strong> sent you a message about <strong>${listingName}</strong>:</p>
        <blockquote style="border-left:3px solid #1A7F5A;margin:16px 0;padding:12px 16px;background:#F9FAFB;border-radius:0 8px 8px 0;font-style:italic;color:#444">
          ${preview.replace(/\n/g, '<br>')}
        </blockquote>
        <a href="${messageUrl}" style="display:inline-block;padding:10px 20px;background:#1A7F5A;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">View message</a>
        <p style="margin-top:24px;font-size:13px;color:#999">
          You're receiving this because you have an account on Par Value.
        </p>
      `,
    }),
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
