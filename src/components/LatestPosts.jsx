import { Link } from 'react-router-dom'
import { posts } from '../content'
import PostCard from './PostCard'

export default function LatestPosts({ limit = 3 }) {
  const latest = posts.slice(0, limit)
  if (latest.length === 0) return null
  return (
    <>
      <div className="post-grid">
        {latest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="section-more">
        <Link to="/blog" className="btn primary">
          查看全部 {posts.length} 篇文章 →
        </Link>
      </div>
    </>
  )
}
