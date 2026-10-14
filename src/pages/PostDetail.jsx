import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPost } from '../api'
import { errorMessage } from '../cloud'
import { useAuth } from '../auth'
import { Empty, MarkdownView, Spinner, formatDate, useToast } from '../components'
import { readingTime } from '../markdown'

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const toast = useToast()

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')
    getPost(id)
      .then((row) => {
        if (!alive) return
        setPost(row)
        if (row?.title) document.title = `${row.title} · 博客`
      })
      .catch((e) => {
        if (!alive) return
        const msg = errorMessage(e, '文章加载失败')
        setError(msg)
        toast.error(msg)
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
      document.title = '个人博客'
    }
  }, [id, toast])

  if (loading) return <Spinner />
  if (error || !post) return <Empty title={error || '文章不存在或已删除'} />

  const isOwner = Boolean(user && post.owner_id === user.id)

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <Link to="/" className="btn sm ghost">
          ← 返回列表
        </Link>
        {isOwner ? (
          <Link to={`/admin/edit/${post.id}`} className="btn sm primary" style={{ marginLeft: 8 }}>
            编辑
          </Link>
        ) : null}
      </div>

      <article className="article">
        <div className="article-head">
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            <span>{formatDate(post.published_at)}</span>
            <span>·</span>
            <span>{post.category || '未分类'}</span>
            <span>·</span>
            <span>约 {readingTime(post.content_md)} 分钟</span>
            {post.status === 'draft' ? <span className="badge draft">草稿（仅自己可见）</span> : null}
          </div>
          {post.tags?.length ? (
            <div className="post-tags" style={{ marginTop: 12 }}>
              {post.tags.map((tag) => (
                <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`} className="tag-pill">
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {post.cover ? (
          <div style={{ marginBottom: 20 }}>
            <img src={post.cover} alt={post.title} style={{ borderRadius: 12, width: '100%' }} />
          </div>
        ) : null}

        <MarkdownView markdown={post.content_md} />
      </article>
    </div>
  )
}
