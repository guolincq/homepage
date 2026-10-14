import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { listPosts, fetchFacets } from '../api'
import { errorMessage } from '../cloud'
import { SITE } from '../siteConfig'
import { Empty, Pagination, PostCard, Spinner, useToast } from '../components'

export default function Home() {
  const { tag, category } = useParams()
  const [params, setParams] = useSearchParams()
  const toast = useToast()

  const page = Math.max(1, Number(params.get('page') || 1))
  const sort = params.get('sort') || 'newest'
  const q = params.get('q') || ''

  const [keywordInput, setKeywordInput] = useState(q)
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [facets, setFacets] = useState({ tags: [], categories: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const activeTag = tag ? decodeURIComponent(tag) : ''
  const activeCategory = category ? decodeURIComponent(category) : ''

  /* 搜索防抖 */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keywordInput === q) return
      const next = new URLSearchParams(params)
      if (keywordInput.trim()) next.set('q', keywordInput.trim())
      else next.delete('q')
      next.set('page', '1')
      setParams(next, { replace: true })
    }, 400)
    return () => clearTimeout(timer)
  }, [keywordInput, q, params, setParams])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')
    listPosts({
      page,
      pageSize: SITE.pageSize,
      tag: activeTag,
      category: activeCategory,
      sort,
      keyword: q,
      status: 'published',
    })
      .then(({ rows, total: count }) => {
        if (!alive) return
        setPosts(rows)
        setTotal(count)
      })
      .catch((e) => {
        if (!alive) return
        setError(errorMessage(e, '文章加载失败'))
        toast.error(errorMessage(e, '文章加载失败'))
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [page, sort, q, activeTag, activeCategory, toast])

  useEffect(() => {
    let alive = true
    fetchFacets()
      .then((data) => alive && setFacets(data))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const updateParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(params)
      if (value) next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.set('page', '1')
      setParams(next)
    },
    [params, setParams],
  )

  const goPage = useCallback(
    (next) => {
      const copy = new URLSearchParams(params)
      copy.set('page', String(next))
      setParams(copy)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [params, setParams],
  )

  const isHome = !activeTag && !activeCategory

  return (
    <div>
      {isHome ? (
        <section className="hero">
          <h1>{SITE.name}</h1>
          <p>{SITE.tagline}</p>
          <div className="hero-stats">
            <div>
              <strong>{total}</strong>
              篇文章
            </div>
            <div>
              <strong>{facets.tags.length}</strong>
              个标签
            </div>
            <div>
              <strong>{facets.categories.length}</strong>
              个分类
            </div>
          </div>
        </section>
      ) : (
        <div className="page-head">
          <h1 className="page-title">
            {activeTag ? `# ${activeTag}` : `分类：${activeCategory}`}
          </h1>
          <Link to="/" className="btn sm">
            返回全部
          </Link>
        </div>
      )}

      <div className="toolbar">
        <div className="search-box">
          <span style={{ color: 'var(--muted)' }}>🔍</span>
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="搜索标题或摘要…"
            aria-label="搜索文章"
          />
        </div>
        <select
          className="select"
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          aria-label="排序方式"
        >
          <option value="newest">最新发布</option>
          <option value="oldest">最早发布</option>
        </select>
      </div>

      {!activeCategory && facets.categories.length > 0 ? (
        <div className="chips" style={{ marginBottom: 10 }}>
          <Link to="/" className={`chip ${!activeCategory ? 'active' : ''}`}>
            全部分类
          </Link>
          {facets.categories.map((c) => (
            <Link
              key={c.name}
              to={`/category/${encodeURIComponent(c.name)}`}
              className={`chip ${activeCategory === c.name ? 'active' : ''}`}
            >
              {c.name} <span className="count">{c.count}</span>
            </Link>
          ))}
        </div>
      ) : null}

      {!activeTag && facets.tags.length > 0 ? (
        <div className="chips" style={{ marginBottom: 18 }}>
          {facets.tags.slice(0, 14).map((t) => (
            <Link
              key={t.name}
              to={`/tag/${encodeURIComponent(t.name)}`}
              className={`chip ${activeTag === t.name ? 'active' : ''}`}
            >
              #{t.name} <span className="count">{t.count}</span>
            </Link>
          ))}
          {facets.tags.length > 14 ? (
            <Link to="/tags" className="chip">
              查看全部 →
            </Link>
          ) : null}
        </div>
      ) : null}

      {error ? <div className="alert error">{error}</div> : null}

      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <Empty
          title={q ? `没有匹配「${q}」的文章` : '这里还没有文章'}
          extra={
            q ? (
              <button className="btn" onClick={() => setKeywordInput('')}>
                清空搜索
              </button>
            ) : (
              <Link to="/login" className="btn primary">
                博主登录并发布第一篇
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination page={page} pageSize={SITE.pageSize} total={total} onChange={goPage} />
        </>
      )}
    </div>
  )
}
