import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { filterPosts, allTags, allCategories, posts } from '../content'
import { SITE } from '../content/profile'
import PostCard from '../components/PostCard'
import { Empty, Pagination } from '../components/ui'

export default function BlogList() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page') || 1))
  const sort = params.get('sort') || 'newest'
  const q = params.get('q') || ''
  const tag = params.get('tag') || ''
  const category = params.get('category') || ''

  const [keywordInput, setKeywordInput] = useState(q)

  useEffect(() => setKeywordInput(q), [q])

  // 搜索防抖
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

  const { rows, total } = useMemo(
    () => filterPosts({ tag, category, q, page, pageSize: SITE.pageSize, sort }),
    [tag, category, q, page, sort],
  )

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

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">{tag ? `# ${tag}` : category ? `分类：${category}` : '博客'}</h1>
        <span className="muted">共 {posts.length} 篇</span>
        {tag || category || q ? (
          <Link to="/blog" className="btn sm">
            清除筛选
          </Link>
        ) : null}
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="muted" aria-hidden="true">
            🔍
          </span>
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

      {allCategories.length > 0 ? (
        <div className="chips">
          <button
            className={`chip ${!category ? 'active' : ''}`}
            onClick={() => updateParam('category', '')}
          >
            全部分类
          </button>
          {allCategories.map((c) => (
            <button
              key={c.name}
              className={`chip ${category === c.name ? 'active' : ''}`}
              onClick={() => updateParam('category', c.name)}
            >
              {c.name} <span className="count">{c.count}</span>
            </button>
          ))}
        </div>
      ) : null}

      {allTags.length > 0 ? (
        <div className="chips">
          {allTags.slice(0, 14).map((t) => (
            <button
              key={t.name}
              className={`chip ${tag === t.name ? 'active' : ''}`}
              onClick={() => updateParam('tag', tag === t.name ? '' : t.name)}
            >
              #{t.name} <span className="count">{t.count}</span>
            </button>
          ))}
          {allTags.length > 14 ? (
            <Link to="/tags" className="chip">
              查看全部 →
            </Link>
          ) : null}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <Empty
          title={q ? `没有匹配「${q}」的文章` : '这里还没有文章'}
          extra={
            q ? (
              <button className="btn" onClick={() => setKeywordInput('')}>
                清空搜索
              </button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="post-grid">
            {rows.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Pagination page={page} pageSize={SITE.pageSize} total={total} onChange={goPage} />
        </>
      )}
    </div>
  )
}
