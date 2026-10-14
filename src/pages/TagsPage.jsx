import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFacets } from '../api'
import { Empty, Spinner } from '../components'

export default function TagsPage() {
  const [facets, setFacets] = useState({ tags: [], categories: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetchFacets()
      .then((data) => alive && setFacets(data))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  if (loading) return <Spinner />

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">标签与分类</h1>
      </div>

      <section style={{ marginBottom: 30 }}>
        <h2 style={{ fontSize: 17, margin: '0 0 12px' }}>分类</h2>
        {facets.categories.length === 0 ? (
          <Empty title="还没有分类" />
        ) : (
          <div className="chips">
            {facets.categories.map((c) => (
              <Link key={c.name} to={`/category/${encodeURIComponent(c.name)}`} className="chip">
                {c.name} <span className="count">{c.count}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 17, margin: '0 0 12px' }}>标签</h2>
        {facets.tags.length === 0 ? (
          <Empty title="还没有标签" />
        ) : (
          <div className="chips">
            {facets.tags.map((t) => (
              <Link
                key={t.name}
                to={`/tag/${encodeURIComponent(t.name)}`}
                className="chip"
                style={{ fontSize: `${Math.min(18, 13 + Math.min(t.count, 8) * 0.5)}px` }}
              >
                #{t.name} <span className="count">{t.count}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
