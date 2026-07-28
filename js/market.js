// Par Value — Market pricing analytics + par-meter
import { supabase } from './supabase.js'

// Fetch market data for a brand + model combination (all conditions)
export async function getMarketData(brand, model) {
  const { data, error } = await supabase
    .from('market_averages')
    .select('condition, avg_price, low_price, high_price, sample_count')
    .eq('brand', brand)
    .eq('model', model)
  if (error || !data) return null
  // Index by condition for easy lookup
  return Object.fromEntries(data.map(row => [row.condition, row]))
}

// Fetch market data for a specific brand + model + condition
export async function getMarketAverage(brand, model, condition) {
  const { data } = await supabase
    .from('market_averages')
    .select('avg_price, low_price, high_price, sample_count')
    .eq('brand', brand)
    .eq('model', model)
    .eq('condition', condition)
    .maybeSingle()
  return data
}

// Fetch price history for a brand + model (for sparkline / price chart)
export async function getPriceHistory(brand, model, limitDays = 90) {
  const since = new Date()
  since.setDate(since.getDate() - limitDays)

  const { data } = await supabase
    .from('price_history')
    .select('price, condition, event, recorded_at')
    .eq('brand', brand)
    .eq('model', model)
    .gte('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: true })
  return data || []
}

// Compute par score: how far is this listing's price from market average?
// Returns null if no market data. Otherwise:
// { deviation (%), tier ('below'|'par'|'above'), label }
export function computeParScore(listingPrice, avgPrice) {
  if (!avgPrice || avgPrice <= 0) return null
  const deviation = ((listingPrice / avgPrice) - 1) * 100
  let tier, label
  if (deviation < -1) {
    tier = 'below'; label = 'Below Par'
  } else if (deviation > 1) {
    tier = 'above'; label = 'Above Par'
  } else {
    tier = 'par'; label = 'At Par'
  }
  return { deviation, tier, label }
}

// Render a par-meter into a container element.
// container: HTMLElement
// listingPrice: number
// marketRow: { avg_price, low_price, high_price, sample_count } from market_averages
export function renderParMeter(container, listingPrice, marketRow) {
  if (!marketRow || !marketRow.avg_price || marketRow.sample_count < 2) {
    container.innerHTML = `<p class="par-no-data">Insufficient market data</p>`
    return
  }

  const score = computeParScore(listingPrice, marketRow.avg_price)
  if (!score) {
    container.innerHTML = `<p class="par-no-data">Insufficient market data</p>`
    return
  }

  const RANGE = 30 // % shown on each side of center
  const clamped = Math.max(-RANGE, Math.min(RANGE, score.deviation))
  const pct = ((clamped + RANGE) / (RANGE * 2)) * 100

  const COLOR = {
    below: '#1A7F5A',
    par:   '#6B6A64',
    above: '#B4532E',
  }
  const color = COLOR[score.tier]
  const sign = score.deviation > 0 ? '+' : ''
  const avg = formatPrice(marketRow.avg_price)
  const n = marketRow.sample_count

  container.innerHTML = `
    <div class="par-meter" data-tier="${score.tier}">
      <div class="par-meter-top">
        <span class="par-label" style="color:${color}">${score.label}</span>
        <span class="par-deviation" style="color:${color}">${sign}${score.deviation.toFixed(1)}% vs. avg ${avg}</span>
      </div>
      <div class="par-track">
        <div class="par-fill-below" style="width:33.3%"></div>
        <div class="par-fill-par"   style="width:33.4%"></div>
        <div class="par-fill-above" style="width:33.3%"></div>
        <div class="par-center-tick"></div>
        <div class="par-marker" style="left:${pct}%">
          <div class="par-dot" style="background:${color};box-shadow:0 0 0 3px ${color}22"></div>
        </div>
      </div>
      <div class="par-track-labels">
        <span>Below Par</span>
        <span>Par</span>
        <span>Above Par</span>
      </div>
      <p class="par-sample">Based on ${n} listing${n !== 1 ? 's' : ''}</p>
    </div>
  `
}

// Render buyer condition rating widget
// onRate: (condition) => void
export function renderConditionRater(container, onRate) {
  const options = [
    { id: 'new',      label: 'New',              sub: 'Unused, as described' },
    { id: 'like_new', label: 'Used – Like New',  sub: 'No visible wear' },
    { id: 'good',     label: 'Used – Good',      sub: 'Minor wear only' },
    { id: 'fair',     label: 'Used – Fair',      sub: 'Visible wear, functional' },
  ]

  container.innerHTML = `
    <div class="condition-rater">
      <p class="condition-rater-prompt">How did the actual condition match the listing?</p>
      <div class="condition-rater-options">
        ${options.map(o => `
          <button class="cond-rate-btn" data-cond="${o.id}" onclick="__pvRate('${o.id}')">
            <strong>${o.label}</strong>
            <span>${o.sub}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `

  window.__pvRate = (cond) => {
    container.querySelectorAll('.cond-rate-btn').forEach(b => b.classList.remove('selected'))
    container.querySelector(`[data-cond="${cond}"]`).classList.add('selected')
    if (onRate) onRate(cond)
  }
}

function formatPrice(n) {
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
}
