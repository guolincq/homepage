import { AWARDS, SERVICES, TEACHING } from '../content/profile'
import { SectionTitle } from '../components/ui'

export default function AwardList() {
  const hasAwards = AWARDS.length > 0
  const hasTeaching = TEACHING.length > 0
  const hasServices = SERVICES.length > 0
  // 三项都为空时整段不渲染（简历未提供这些内容）
  if (!hasAwards && !hasTeaching && !hasServices) return null

  return (
    <section className="section" id="awards">
      <SectionTitle id="awards-title" title="荣誉与学术服务" sub="Awards & Service" />

      {hasAwards ? (
        <ul className="award-list">
          {AWARDS.map((a) => (
            <li className="award-item" key={`${a.year}-${a.name}`}>
              <span className="award-year">{a.year}</span>
              <span className="award-name">{a.name}</span>
              <span className="award-org">{a.org}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="sub-blocks">
        {hasTeaching ? (
          <div className="sub-block">
            <h4 className="sub-block-title">教学工作</h4>
            <ul className="plain-list">
              {TEACHING.map((t) => (
                <li key={t.course}>
                  <strong>{t.term}</strong> · {t.course}
                  {t.note ? <span className="muted">（{t.note}）</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {hasServices ? (
          <div className="sub-block">
            <h4 className="sub-block-title">学术服务</h4>
            <ul className="plain-list">
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
