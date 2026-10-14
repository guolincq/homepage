import { Link } from 'react-router-dom'

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

/** 章节标题：左侧主色竖条 */
export function SectionTitle({ id, title, sub = '', action = null }) {
  return (
    <div className="section-head">
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {sub ? <span className="section-sub">{sub}</span> : null}
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  )
}

export function TagPill({ tag, active = false }) {
  return (
    <Link to={`/blog?tag=${encodeURIComponent(tag)}`} className={`tag-pill ${active ? 'active' : ''}`}>
      #{tag}
    </Link>
  )
}
