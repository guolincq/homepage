import { PROFILE, SITE } from '../content/profile'
import { initialsOf } from '../utils/gradient'

export default function Hero() {
  const avatarStyle = PROFILE.avatar
    ? { backgroundImage: `url(${PROFILE.avatar})` }
    : {}

  return (
    <section className="hero-academic" id="top">
      <div className="profile-card">
        <div className="avatar" style={avatarStyle}>
          {PROFILE.avatar ? null : <span>{initialsOf(PROFILE.name.cn)}</span>}
        </div>

        <div className="profile-info">
          <h1 className="profile-name">
            {PROFILE.name.cn}
            <span className="profile-name-en">{PROFILE.name.en}</span>
          </h1>
          <p className="profile-role">{PROFILE.role}</p>
          {PROFILE.affiliation?.cn ? (
            <p className="profile-affil">
              {PROFILE.affiliation.cn}
              {PROFILE.affiliation.en ? (
                <span className="profile-affil-en">{PROFILE.affiliation.en}</span>
              ) : null}
            </p>
          ) : null}
          {PROFILE.lab?.cn || PROFILE.office ? (
            <p className="profile-lab">
              {[PROFILE.lab?.cn, PROFILE.office].filter(Boolean).join(' · ')}
            </p>
          ) : null}

          <div className="profile-actions">
            <a className="btn primary sm" href={`mailto:${PROFILE.email}`}>
              ✉ {PROFILE.email}
            </a>
            {PROFILE.cvUrl ? (
              <a className="btn sm" href={PROFILE.cvUrl} target="_blank" rel="noopener noreferrer">
                简历 (CV)
              </a>
            ) : null}
          </div>

          <div className="social-chips">
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
        </div>
      </div>

      <p className="hero-tagline">{SITE.tagline}</p>
    </section>
  )
}
