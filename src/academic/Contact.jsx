import { PROFILE } from '../content/profile'
import { SectionTitle } from '../components/ui'

export default function Contact() {
  // 只渲染有值的项：单位/办公室/所在地留空时不会出现（隐私考虑）
  const items = [
    { icon: '✉', label: '邮箱', value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    PROFILE.office
      ? { icon: '🏢', label: '办公室', value: PROFILE.office, href: null }
      : null,
    PROFILE.location ? { icon: '📍', label: '所在地', value: PROFILE.location, href: null } : null,
  ].filter(Boolean)

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
