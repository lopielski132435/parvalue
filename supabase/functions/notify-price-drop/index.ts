// Triggered via Supabase Database Webhook on listings UPDATE.
// Set the webhook to fire when the `price` column changes.
// Webhook URL: https://<project-ref>.supabase.co/functions/v1/notify-price-drop
// Headers: Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM_EMAIL = 'notifications@getparvalue.com'

Deno.serve(async (req) => {
  const payload = await req.json()

  // Supabase webhook sends { type, table, record, old_record }
  const { record: newListing, old_record: oldListing } = payload

  if (!newListing || !oldListing) {
    return new Response('Missing payload', { status: 400 })
  }

  const newPrice = Number(newListing.price)
  const oldPrice = Number(oldListing.price)

  // Only notify on price drops
  if (newPrice >= oldPrice) {
    return new Response('No price drop', { status: 200 })
  }

  const listingId = newListing.id
  const drop = oldPrice - newPrice
  const dropPct = Math.round((drop / oldPrice) * 100)

  // Get all watchers for this listing
  const { data: watchers } = await supabase
    .from('watchlist')
    .select('user_id, profiles:user_id(full_name, email:id)')
    .eq('listing_id', listingId)

  if (!watchers?.length) {
    return new Response('No watchers', { status: 200 })
  }

  // Get watcher emails from auth.users via admin API
  const watcherIds = watchers.map(w => w.user_id)
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const emailMap = Object.fromEntries(
    (users || []).filter(u => watcherIds.includes(u.id)).map(u => [u.id, { email: u.email, name: u.user_metadata?.full_name }])
  )

  const title = `${newListing.brand} ${newListing.model}`
  const listingUrl = `https://getparvalue.com/listing.html?id=${listingId}`

  // Send one email per watcher
  const sends = watchers.map(async (w) => {
    const user = emailMap[w.user_id]
    if (!user?.email) return

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Par Value <${FROM_EMAIL}>`,
        to: user.email,
        subject: `Price drop: ${title} is now $${newPrice.toLocaleString()}`,
        html: `
          <p>Hi${user.name ? ` ${user.name.split(' ')[0]}` : ''},</p>
          <p>A club on your Par Value watchlist just dropped in price:</p>
          <table style="border:1px solid #eee;border-radius:8px;padding:16px 20px;margin:16px 0">
            <tr><td style="font-weight:600;font-size:18px">${title}</td></tr>
            <tr><td style="padding-top:8px">
              <span style="text-decoration:line-through;color:#999">$${oldPrice.toLocaleString()}</span>
              &nbsp;→&nbsp;
              <span style="font-weight:700;color:#1A7F5A">$${newPrice.toLocaleString()}</span>
              &nbsp;<span style="color:#666;font-size:14px">(${dropPct}% off)</span>
            </td></tr>
          </table>
          <a href="${listingUrl}" style="display:inline-block;padding:10px 20px;background:#1A7F5A;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">View listing</a>
          <p style="margin-top:24px;font-size:13px;color:#999">
            You're receiving this because you saved this club to your watchlist.
            <a href="https://getparvalue.com/watchlist.html" style="color:#1A7F5A">Manage watchlist</a>
          </p>
        `,
      }),
    })
  })

  await Promise.all(sends)

  return new Response(JSON.stringify({ notified: watchers.length }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
