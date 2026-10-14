import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPost, posts } from '../content'
import { SITE } from '../content/profile'
import MarkdownView from '../components/MarkdownView'
import { Empty } from '../components/ui'
import { formatDate } from '../utils/text'

export default function PostDetail() {
  const { slug } = useParams()
  const post = getPost(slug)

  useEffect(() => {
    document.title = post ? `${post.title} · ${SITE.shortName}` : SITE.name
    window.scrollTo({ top: 0 })
    return () => {
      document.title = SITE.name
    }
  }, [post])

  if (!post) {
    return (
      <Empty
        title="没有找到这篇文章"
        extra={
          <Link to="/blog" className="btn primary">
            返回博客列表
          </Link>
        }
      />
    )
  }

  const index = posts.findIndex((p) => p.slug === post.slug)
  const prev = posts[index - 1] // posts 按日期倒序，index-1 是更新的
  const next = posts[index + 1]

  return (
    <article className="article">
      <div className="article-head">
        <Link to="/blog" className="back-link">
          ← 返回列表
        </Link>
        <h1 className="article-title">{post.title}</h1>
        <p className="article-meta">
          {formatDate(post.date)} · {post.category} · 约 {post.minutes} 分钟
        </p>
        {post.tags.length > 0 ? (
          <div className="post-tags">
            {post.tags.map((t) => (
              <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`} className="tag-pill">
                #{t}
              </Link>
            ))}
          </div>
        ) : null}
        {post.cover ? (
          <div className="article-cover">
            <img src={post.cover} alt={post.title} />
          </div>
        ) : null}
      </div>

      <MarkdownView markdown={post.body} />

      <nav className="article-nav">
        {next ? (
          <Link className="article-nav-item" to={`/blog/${encodeURIComponent(next.slug)}`}>
            <span className="muted">← 上一篇</span>
            <span>{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {prev ? (
          <Link className="article-nav-item right" to={`/blog/${encodeURIComponent(prev.slug)}`}>
            <span className="muted">下一篇 →</span>
            <span>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
