import { Link } from 'react-router-dom'
import { gradientFor } from '../utils/gradient'
import { formatDate } from '../utils/text'

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/blog/${encodeURIComponent(post.slug)}`} className="post-cover-link">
        <div
          className="post-cover"
          style={post.cover ? { background: '#eef1f5' } : { background: gradientFor(post.title) }}
        >
          {post.cover ? (
            <img src={post.cover} alt={post.title} loading="lazy" />
          ) : (
            <span>{post.category}</span>
          )}
        </div>
      </Link>
      <div className="post-body">
        <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
          <h3 className="post-title">{post.title}</h3>
        </Link>
        <p className="post-summary">{post.summary}</p>
        <div className="post-tags">
          {post.tags.slice(0, 4).map((tag) => (
            <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="tag-pill">
              #{tag}
            </Link>
          ))}
        </div>
        <div className="post-meta">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.category}</span>
          <span>·</span>
          <span>约 {post.minutes} 分钟</span>
        </div>
      </div>
    </article>
  )
}
