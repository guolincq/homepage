import { INTERESTS } from '../content/profile'
import { SectionTitle } from '../components/ui'

export default function ResearchInterests() {
  return (
    <section className="section" id="research">
      <SectionTitle id="research-title" title="研究兴趣" sub="Research Interests" />
      <div className="interest-grid">
        {INTERESTS.map((it) => (
          <article className="interest-card" key={it.title}>
            <div className="interest-icon" aria-hidden="true">
              {it.icon}
            </div>
            <h3 className="interest-title">{it.title}</h3>
            <p className="interest-desc">{it.desc}</p>
            <div className="interest-keywords">
              {it.keywords.map((k) => (
                <span className="kw-pill" key={k}>
                  {k}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
