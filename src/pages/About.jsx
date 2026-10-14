import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProfile } from '../api'
import { useAuth } from '../auth'
import { MarkdownView, Spinner } from '../components'
import { SITE } from '../siteConfig'

const DEFAULT_MD = `## 关于我

这里是 **${SITE.author}** 的个人博客——${SITE.tagline}。

### 技术栈

- 前端：React + Vite
- 后端：云数据库 / 对象存储 / 用户认证（托管服务）
- 写作：Markdown

> 登录后可在「后台 → 站点资料」里编辑这段内容。`

export default function About() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isAuthed } = useAuth()

  useEffect(() => {
    let alive = true
    fetchProfile()
      .then((row) => alive && setProfile(row))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const name = profile?.display_name || SITE.author
  const tagline = profile?.tagline || SITE.tagline
  const links = Array.isArray(profile?.links) ? profile.links : []

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">关于</h1>
        {isAuthed ? (
          <Link to="/admin/profile" className="btn sm primary">
            编辑资料
          </Link>
        ) : null}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="article">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: profile?.avatar
                  ? `url(${profile.avatar}) center/cover`
                  : 'linear-gradient(135deg,#6366f1,#a855f7)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {!profile?.avatar ? name?.[0] || 'B' : null}
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 700 }}>{name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>{tagline}</div>
            </div>
          </div>

          {links.length ? (
            <div className="chips" style={{ marginBottom: 20 }}>
              {links.map((link, i) => (
                <a
                  key={`${link.url}-${i}`}
                  className="chip"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label || link.url}
                </a>
              ))}
            </div>
          ) : null}

          <MarkdownView markdown={profile?.content_md || DEFAULT_MD} />
        </div>
      )}
    </div>
  )
}
