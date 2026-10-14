import { PROFILE, SKILLS } from '../content/profile'
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

      {SKILLS.length > 0 ? (
        <div className="skills-block">
          <h4 className="sub-block-title">专业技能</h4>
          <div className="interest-keywords">
            {SKILLS.map((s) => (
              <span className="kw-pill" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
