import { EDUCATION } from '../content/profile'
import { SectionTitle } from '../components/ui'

export default function Timeline() {
  return (
    <section className="section" id="education">
      <SectionTitle id="education-title" title="教育与工作经历" sub="Education & Positions" />
      <ol className="timeline">
        {EDUCATION.map((item) => (
          <li className="timeline-item" key={`${item.period}-${item.title}`}>
            <span className="timeline-period">{item.period}</span>
            <h3 className="timeline-title">{item.title}</h3>
            <p className="timeline-org">{item.org}</p>
            {item.note ? <p className="timeline-note">{item.note}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
