// Shared nav initialization — call initNav(supabase) on every page that has #nav-user-btn
// Injects profile dropdown and handles sign out.

export async function initNav(supabase) {
  const btn = document.getElementById('nav-user-btn')
  if (!btn) return

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    btn.textContent = '?'
    btn.onclick = () => window.location.href = 'login.html'
    return
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, is_admin')
    .eq('id', session.user.id)
    .maybeSingle()

  const name = profile?.full_name || ''
  const email = session.user.email || ''
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : email[0]?.toUpperCase() ?? '?'

  btn.textContent = initials

  // Inject dropdown styles once
  if (!document.getElementById('nav-dropdown-style')) {
    const style = document.createElement('style')
    style.id = 'nav-dropdown-style'
    style.textContent = `
      .nav-user-wrap { position: relative; }

      .nav-dropdown {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        background: var(--pv-surface);
        border: 1px solid var(--pv-border);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        min-width: 220px;
        z-index: 200;
        overflow: hidden;
        opacity: 0;
        transform: translateY(-6px);
        pointer-events: none;
        transition: opacity 0.15s, transform 0.15s;
      }

      .nav-dropdown.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
      }

      .nav-dropdown-header {
        padding: 14px 16px 12px;
        border-bottom: 1px solid var(--pv-border);
      }

      .nav-dropdown-name {
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--pv-ink);
        margin-bottom: 2px;
      }

      .nav-dropdown-email {
        font-size: 0.8125rem;
        color: var(--pv-text-tertiary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .nav-dropdown-items { padding: 6px 0; }

      .nav-dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--pv-text-secondary);
        text-decoration: none;
        cursor: pointer;
        background: none;
        border: none;
        width: 100%;
        text-align: left;
        font-family: var(--font-sans);
        transition: background 0.1s, color 0.1s;
      }

      .nav-dropdown-item:hover {
        background: var(--pv-bg);
        color: var(--pv-ink);
        text-decoration: none;
      }

      .nav-dropdown-item svg { flex-shrink: 0; opacity: 0.6; }

      .nav-dropdown-divider {
        height: 1px;
        background: var(--pv-border);
        margin: 4px 0;
      }

      .nav-dropdown-item.danger { color: #DC2626; }
      .nav-dropdown-item.danger:hover { background: #FEF2F2; color: #DC2626; }
    `
    document.head.appendChild(style)
  }

  // Wrap button in a relative-positioned container
  const wrap = document.createElement('div')
  wrap.className = 'nav-user-wrap'
  btn.parentNode.insertBefore(wrap, btn)
  wrap.appendChild(btn)

  // Build dropdown
  const dropdown = document.createElement('div')
  dropdown.className = 'nav-dropdown'
  dropdown.innerHTML = `
    <div class="nav-dropdown-header">
      <div class="nav-dropdown-name">${name || 'My Account'}</div>
      <div class="nav-dropdown-email">${email}</div>
    </div>
    <div class="nav-dropdown-items">
      <a class="nav-dropdown-item" href="account.html">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="4" y="1.5" width="7" height="7" rx="3.5" stroke="currentColor" stroke-width="1.4"/><path d="M1.5 13.5c0-2.5 2.686-4.5 6-4.5s6 2 6 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        My Listings
      </a>
      <a class="nav-dropdown-item" href="watchlist.html">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 13S2 9.5 2 5.5a4 4 0 015.5-3.7A4 4 0 0113 5.5C13 9.5 7.5 13 7.5 13z" stroke="currentColor" stroke-width="1.4"/></svg>
        Watchlist
      </a>
      <a class="nav-dropdown-item" href="account.html#edit-profile">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M10.5 2.5l2 2-7 7H3.5v-2l7-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
        Edit Profile
      </a>
      ${profile?.is_admin ? `
      <div class="nav-dropdown-divider"></div>
      <a class="nav-dropdown-item" href="admin.html">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="8.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="1.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="8.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.4"/></svg>
        Admin Portal
      </a>` : ''}
      <div class="nav-dropdown-divider"></div>
      <button class="nav-dropdown-item danger" id="nav-signout-btn">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M6 2H2.5a1 1 0 00-1 1v9a1 1 0 001 1H6M10 10.5l3-3-3-3M13 7.5H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Sign out
      </button>
    </div>
  `
  wrap.appendChild(dropdown)

  // Toggle on button click
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    dropdown.classList.toggle('open')
  })

  // Close on outside click
  document.addEventListener('click', () => dropdown.classList.remove('open'))
  dropdown.addEventListener('click', (e) => e.stopPropagation())

  // Sign out
  document.getElementById('nav-signout-btn').addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = 'browse.html'
  })

  return { session, profile }
}
