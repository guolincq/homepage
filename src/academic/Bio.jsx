import { PROFILE } from '../content/profile'
import { SectionTitle } from '../components/ui'

export default function Bio() {
  return (
    <section className="section" id="about">
      <SectionTitle id="about-title" title="个人简介" sub="About Me" />
      <div className="prose">
        {PROFILE.bio.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </section>
  )
}
