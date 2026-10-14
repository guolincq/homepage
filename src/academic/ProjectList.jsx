import { PROJECTS } from '../content/profile'
import { SectionTitle } from '../components/ui'

export default function ProjectList() {
  return (
    <section className="section" id="projects">
      <SectionTitle id="projects-title" title="科研项目" sub="Research Projects" />
      <div className="project-list">
        {PROJECTS.map((p) => (
          <article className="project-card" key={p.name}>
            <div className="project-head">
              <h3 className="project-name">{p.name}</h3>
              <span className={`role-badge ${p.role === '主持' ? 'lead' : ''}`}>{p.role}</span>
            </div>
            <p className="project-meta">
              {p.funder} · {p.grantNo} · {p.period}
            </p>
            <p className="project-desc">{p.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
