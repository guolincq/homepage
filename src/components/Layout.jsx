import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { SITE } from '../content/profile'

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  useEffect(() => {
    if (!SITE.enableDarkMode) return
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const [theme, toggleTheme] = useTheme()

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">{SITE.brandMark}</span>
            <span className="brand-text">
              <span className="brand-name">{SITE.shortName}</span>
              <span className="brand-sub">{SITE.tagline}</span>
            </span>
          </Link>

          <div className="header-right">
            {SITE.enableDarkMode ? (
              <button className="icon-btn" onClick={toggleTheme} aria-label="切换主题">
                {theme === 'dark' ? '☀' : '☾'}
              </button>
            ) : null}
            <button
              className="btn sm ghost nav-toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="菜单"
            >
              ☰
            </button>
          </div>

          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            {SITE.nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <span>
            © {new Date().getFullYear()} {SITE.author} · {SITE.footerNote}
          </span>
          <span>静态站点 · 无追踪</span>
        </div>
      </footer>
    </div>
  )
}
