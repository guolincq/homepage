import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="empty" style={{ paddingTop: 40 }}>
      <div style={{ fontSize: 44, fontWeight: 700, color: 'var(--primary)' }}>404</div>
      <div style={{ fontSize: 15, marginTop: 8 }}>这个页面不存在</div>
      <div style={{ marginTop: 18 }}>
        <Link to="/" className="btn primary">
          返回首页
        </Link>
      </div>
    </div>
  )
}
