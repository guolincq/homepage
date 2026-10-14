import { Link } from 'react-router-dom'
import { allTags, allCategories } from '../content'

export default function TagsPage() {
  const max = Math.max(1, ...allTags.map((t) => t.count))

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">标签与分类</h1>
      </div>

      <h2 className="sub-head">标签</h2>
      {allTags.length === 0 ? (
        <p className="muted">还没有标签。</p>
      ) : (
        <div className="tag-cloud">
          {allTags.map((t) => (
            <Link
              key={t.name}
              to={`/blog?tag=${encodeURIComponent(t.name)}`}
              className="cloud-tag"
              style={{ fontSize: `${13 + (t.count / max) * 8}px` }}
            >
              #{t.name}
              <span className="count">{t.count}</span>
            </Link>
          ))}
        </div>
      )}

      <h2 className="sub-head">分类</h2>
      {allCategories.length === 0 ? (
        <p className="muted">还没有分类。</p>
      ) : (
        <div className="chips">
          {allCategories.map((c) => (
            <Link
              key={c.name}
              to={`/blog?category=${encodeURIComponent(c.name)}`}
              className="chip"
            >
              {c.name} <span className="count">{c.count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
