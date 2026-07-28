// Scheduled Edge Function — run daily via Supabase Cron.
// In Supabase dashboard: Edge Functions → notify-interest-spike → Schedule → "0 9 * * *" (9am UTC daily)
//
// Finds listings with 10+ views in the last 24h and notifies their watchers once per day.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const FROM_EMAIL = 'notifications@getparvalue.com'
const SPIKE_THRESHOLD = 10

Deno.serve(async () => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  // Count views per listing in the last 24h
  const { data: viewCounts } = await supabase
    .from('listing_views')
    .select('listing_id')
    .gte('viewed_at', since)

  if (!viewCounts?.length) return new Response('No views', { status: 200 })

  // Aggregate counts
  const counts: Record<string, number> = {}
  for (const row of viewCounts) {
    counts[row.listing_id] = (counts[row.listing_id] || 0) + 1
  }

  const spikingIds = Object.entries(counts)
    .filter(([, count]) => count >= SPIKE_THRESHOLD)
    .map(([id]) => id)

  if (!spikingIds.length) return new Response('No spikes', { status: 200 })

  // Load listing details
  const { data: listings } = await supabase
    .from('listings')
    .select('id, brand, model, price')
    .in('id', spikingIds)
    .eq('status', 'active')

  if (!listings?.length) return new Response('No active spiking listings', { status: 200 })

  // Load watchers for all spiking listings
  const { data: watchers } = await supabase
    .from('watchlist')
    .select('user_id, listing_id')
    .in('listing_id', spikingIds)

  if (!watchers?.length) return new Response('No watchers', { status: 200 })

  // Get emails for all watcher user IDs
  const watcherIds = [...new Set(watchers.map(w => w.user_id))]
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const emailMap = Object.fromEntries(
    (users || []).filter(u => watcherIds.includes(u.id)).map(u => [u.id, { email: u.email, name: u.user_metadata?.full_name }])
  )

  const listingMap = Object.fromEntries(listings.map(l => [l.id, l]))

  // Group listings per watcher
  const perUser: Record<string, string[]> = {}
  for (const w of watchers) {
    if (!perUser[w.user_id]) perUser[w.user_id] = []
    perUser[w.user_id].push(w.listing_id)
  }

  let notified = 0
  const sends = Object.entries(perUser).map(async ([userId, listingIds]) => {
    const user = emailMap[userId]
    if (!user?.email) return

    const items = listingIds
      .map(id => listingMap[id])
      .filter(Boolean)
      .map(l => {
        const views = counts[l.id]
        const url = `https://getparvalue.com/listing.html?id=${l.id}`
        return `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #eee">
              <a href="${url}" style="font-weight:600;color:#1A1A18;text-decoration:none">${l.brand} ${l.model}</a>
              <span style="display:block;font-size:13px;color:#666;margin-top:2px">$${Number(l.price).toLocaleString()} &mdash; ${views} views in the last 24 hours</span>
            </td>
          </tr>`
      }).join('')

    if (!items) return

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Par Value <${FROM_EMAIL}>`,
        to: user.email,
        subject: items.length === 1
          ? `Interest is picking up on a club you're watching`
          : `Interest is picking up on ${items.length} clubs you're watching`,
        html: `
          <p>Hi${user.name ? ` ${user.name.split(' ')[0]}` : ''},</p>
          <p>Clubs on your Par Value watchlist are getting attention:</p>
          <table style="width:100%;border-top:1px solid #eee;margin:16px 0">${items}</table>
          <p style="margin-top:24px;font-size:13px;color:#999">
            You're receiving this because you saved these clubs to your watchlist.
            <a href="https://getparvalue.com/watchlist.html" style="color:#1A7F5A">Manage watchlist</a>
          </p>
        `,
      }),
    })
    notified++
  })

  await Promise.all(sends)

  return new Response(JSON.stringify({ spikingListings: spikingIds.length, notified }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
