import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SITE, gradientFor } from './siteConfig'
import { useAuth } from './auth'
import { renderMarkdown, extractAssetIds } from './markdown'
import { resolveAssets } from './api'

/* ------------------------------- Toast ------------------------------- */

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const push = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((list) => [...list, { id, message, type }])
    const timer = setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id))
      timers.current.delete(id)
    }, 2800)
    timers.current.set(id, timer)
  }, [])

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), [])

  const value = useMemo(
    () => ({
      info: (m) => push(m, 'info'),
      error: (m) => push(m, 'error'),
      success: (m) => push(m, 'success'),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext) ?? { info: () => {}, error: () => {}, success: () => {} }
}

/* ------------------------------- 基础件 ------------------------------- */

export function Spinner({ text = '加载中…' }) {
  return (
    <div className="loading">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="spinner" />
        <span>{text}</span>
      </div>
    </div>
  )
}

export function Empty({ title = '暂无内容', extra = null }) {
  return (
    <div className="empty">
      <div style={{ fontSize: 15 }}>{title}</div>
      {extra ? <div style={{ marginTop: 12 }}>{extra}</div> : null}
    </div>
  )
}

export function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (pages <= 1) return null
  const nums = []
  for (let i = 1; i <= pages; i += 1) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i)
    else if (nums[nums.length - 1] !== '…') nums.push('…')
  }
  return (
    <div className="pagination">
      <button className="page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        上一页
      </button>
      {nums.map((n, i) =>
        n === '…' ? (
          <span key={`gap-${i}`} style={{ color: 'var(--muted)' }}>
            …
          </span>
        ) : (
          <button
            key={n}
            className={`page-btn ${n === page ? 'active' : ''}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ),
      )}
      <button className="page-btn" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        下一页
      </button>
    </div>
  )
}

export function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

/* ------------------------------- Markdown ------------------------------- */

export function MarkdownView({ markdown, className = 'md-body' }) {
  const [html, setHtml] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const ids = extractAssetIds(markdown)
      const assets = ids.length ? await resolveAssets(ids) : {}
      if (!alive) return
      setHtml(renderMarkdown(markdown, assets))
    })()
    return () => {
      alive = false
    }
  }, [markdown])

  const onCopy = useCallback((event) => {
    const btn = event.target.closest('.md-copy')
    if (!btn) return
    const code = decodeURIComponent(btn.dataset.copy || '')
    navigator.clipboard?.writeText(code).then(
      () => {
        btn.textContent = '已复制'
        setTimeout(() => {
          btn.textContent = '复制'
        }, 1500)
      },
      () => {},
    )
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      onClick={onCopy}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/* ------------------------------- 文章卡片 ------------------------------- */

export function PostCard({ post, actions = null }) {
  const cover = post.cover
  return (
    <article className="post-card">
      <Link to={`/post/${post.id}`}>
        <div className="post-cover" style={cover ? { background: '#f1f2f4' } : { background: gradientFor(post.title) }}>
          {cover ? (
            <img src={cover} alt={post.title} loading="lazy" />
          ) : (
            <span style={{ opacity: 0.9 }}>{post.category || '随笔'}</span>
          )}
        </div>
      </Link>
      <div className="post-body">
        <Link to={`/post/${post.id}`}>
          <h3 className="post-title">{post.title}</h3>
        </Link>
        <p className="post-summary">{post.summary || '（暂无摘要）'}</p>
        <div className="post-tags">
          {(post.tags || []).slice(0, 4).map((tag) => (
            <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`} className="tag-pill">
              #{tag}
            </Link>
          ))}
          {post.status === 'draft' ? <span className="badge draft">草稿</span> : null}
        </div>
        <div className="post-meta">
          <span>{formatDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.category || '未分类'}</span>
        </div>
        {actions ? <div className="btn-row" style={{ marginTop: 6 }}>{actions}</div> : null}
      </div>
    </article>
  )
}

/* --------------------------------- 布局 --------------------------------- */

export function Layout() {
  const { isAuthed, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">{SITE.shortName?.[0] || 'B'}</span>
            <span>
              {SITE.name}
              <span className="brand-sub" style={{ marginLeft: 8 }}>
                {SITE.tagline}
              </span>
            </span>
          </Link>
          <button
            className="btn sm ghost nav-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="菜单"
          >
            ☰
          </button>
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
            {isAuthed ? (
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
                后台
              </NavLink>
            ) : (
              <button
                className="btn sm primary"
                style={{ marginLeft: 6 }}
                onClick={() => navigate('/login')}
              >
                登录
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <span>
            © {new Date().getFullYear()} {SITE.name} · {SITE.author}
          </span>
          <span>{isAuthed ? `已登录：${user?.email || user?.phone || '博主'}` : '访客浏览'}</span>
        </div>
      </footer>
    </div>
  )
}

/* ------------------------------- 路由守卫 ------------------------------- */

export function RequireAuth({ children }) {
  const { isAuthed, ready } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (ready && !isAuthed) {
      navigate('/login', { replace: true, state: { from: location.pathname } })
    }
  }, [ready, isAuthed, navigate, location.pathname])

  if (!ready) return <Spinner text="正在校验登录状态…" />
  if (!isAuthed) return null
  return children
}
