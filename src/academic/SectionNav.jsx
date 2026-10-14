import { useLocation, useNavigate } from 'react-router-dom'

export const SECTIONS = [
  { id: 'about', label: '简介' },
  { id: 'research', label: '研究' },
  { id: 'education', label: '经历' },
  { id: 'publications', label: '论文' },
  { id: 'projects', label: '项目' },
  { id: 'awards', label: '荣誉' },
  { id: 'contact', label: '联系' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function SectionNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const go = (id) => {
    if (location.pathname !== '/') {
      navigate('/')
      // 等首页挂载后再滚动
      setTimeout(() => scrollTo(id), 80)
    } else {
      scrollTo(id)
    }
  }

  return (
    <div className="section-nav">
      {SECTIONS.map((s) => (
        <button key={s.id} className="section-nav-item" onClick={() => go(s.id)}>
          {s.label}
        </button>
      ))}
    </div>
  )
}
