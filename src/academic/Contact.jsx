import { PROFILE } from '../content/profile'
import { SectionTitle } from '../components/ui'

export default function Contact() {
  const items = [
    { icon: '✉', label: '邮箱', value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { icon: '🏢', label: '办公室', value: `${PROFILE.office}，${PROFILE.affiliation.cn}`, href: null },
    { icon: '📍', label: '所在地', value: PROFILE.location, href: null },
  ]

  return (
    <section className="section" id="contact">
      <SectionTitle id="contact-title" title="联系方式" sub="Contact" />
      <div className="contact-grid">
        {items.map((it) => (
          <div className="contact-item" key={it.label}>
            <span className="contact-icon" aria-hidden="true">
              {it.icon}
            </span>
            <span className="contact-label">{it.label}</span>
            {it.href ? (
              <a className="contact-value" href={it.href}>
                {it.value}
              </a>
            ) : (
              <span className="contact-value">{it.value}</span>
            )}
          </div>
        ))}
      </div>

      <div className="social-chips" style={{ marginTop: 18 }}>
        {PROFILE.social.map((s) => (
          <a
            key={s.label}
            className="social-chip"
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true">{s.icon}</span>
            {s.label}
          </a>
        ))}
      </div>
    </section>
  )
}
