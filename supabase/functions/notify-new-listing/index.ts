// Triggered via DB trigger on listings INSERT where status = 'under_review'.
// Sends an email to all admin users notifying them of a new listing pending review.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM_EMAIL = 'notifications@getparvalue.com'
const ADMIN_URL = 'https://getparvalue.com/admin.html'

Deno.serve(async (req) => {
  const payload = await req.json()
  const listing = payload.record

  if (!listing || listing.status !== 'under_review') {
    return new Response('Not under review', { status: 200 })
  }

  // Get all admin users
  const { data: adminProfiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('is_admin', true)

  if (!adminProfiles?.length) return new Response('No admins', { status: 200 })

  const adminIds = adminProfiles.map(p => p.id)
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const admins = (users || []).filter(u => adminIds.includes(u.id) && u.email)

  if (!admins.length) return new Response('No admin emails', { status: 200 })

  // Get seller name
  const { data: seller } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', listing.user_id)
    .maybeSingle()

  const sellerName = seller?.full_name || 'Unknown seller'
  const listingTitle = `${listing.brand} ${listing.model}`
  const listingNumber = listing.listing_number || ''
  const price = listing.price ? `$${Number(listing.price).toLocaleString()}` : ''

  const sends = admins.map(admin =>
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Par Value <${FROM_EMAIL}>`,
        to: admin.email,
        subject: `New listing pending review: ${listingTitle}`,
        html: `
          <p>A new listing has been submitted and is waiting for your approval.</p>
          <table style="border:1px solid #eee;border-radius:8px;padding:16px 20px;margin:16px 0;width:100%">
            <tr><td style="font-weight:700;font-size:18px;padding-bottom:8px">${listingTitle}</td></tr>
            ${listingNumber ? `<tr><td style="font-size:13px;color:#666;padding-bottom:4px">${listingNumber}</td></tr>` : ''}
            ${price ? `<tr><td style="font-size:15px;font-weight:600;padding-bottom:4px">${price}</td></tr>` : ''}
            <tr><td style="font-size:14px;color:#666">Submitted by: ${sellerName}</td></tr>
          </table>
          <a href="${ADMIN_URL}" style="display:inline-block;padding:10px 20px;background:#1A7F5A;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Review in Admin Portal</a>
          <p style="margin-top:24px;font-size:13px;color:#999">You're receiving this because you are a Par Value admin.</p>
        `,
      }),
    })
  )

  await Promise.all(sends)

  return new Response(JSON.stringify({ notified: admins.length }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
