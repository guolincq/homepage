import { useMemo, useState } from 'react'
import { PROFILE, PUBLICATIONS, SELF_ALIASES } from '../content/profile'
import { SectionTitle } from '../components/ui'

const TYPE_LABEL = {
  journal: '期刊',
  conference: '会议',
  preprint: '预印本',
  patent: '专利',
}

const FILTERS = [
  ['all', '全部'],
  ['journal', '期刊'],
  ['conference', '会议'],
  ['patent', '专利'],
]

function isSelf(author) {
  const a = String(author || '').trim()
  return SELF_ALIASES.some((alias) => a === alias || a.includes(alias))
}

function Authors({ authors }) {
  return (
    <p className="pub-authors">
      {authors.map((a, i) => (
        <span key={`${a}-${i}`} className={isSelf(a) ? 'self' : ''}>
          {a}
          {i < authors.length - 1 ? ', ' : ''}
        </span>
      ))}
    </p>
  )
}

function Links({ links }) {
  const items = [
    ['PDF', links.pdf],
    ['Code', links.code],
    ['BibTeX', links.bib],
    ['DOI', links.doi],
  ].filter(([, url]) => Boolean(url))
  if (items.length === 0) return null
  return (
    <div className="pub-links">
      {items.map(([label, url]) => (
        <a
          key={label}
          className="pub-link"
          href={url}
          target={/^https?:/i.test(url) ? '_blank' : undefined}
          rel={/^https?:/i.test(url) ? 'noopener noreferrer' : undefined}
        >
          {label}
        </a>
      ))}
    </div>
  )
}

export default function PublicationList() {
  const [filter, setFilter] = useState('all')

  const grouped = useMemo(() => {
    const rows = PUBLICATIONS.filter((p) => filter === 'all' || p.type === filter).sort(
      (a, b) => b.year - a.year,
    )
    const map = new Map()
    for (const p of rows) {
      if (!map.has(p.year)) map.set(p.year, [])
      map.get(p.year).push(p)
    }
    return [...map.entries()]
  }, [filter])

  const counts = useMemo(() => {
    const c = { all: PUBLICATIONS.length }
    for (const p of PUBLICATIONS) c[p.type] = (c[p.type] || 0) + 1
    return c
  }, [])

  // 放在所有 hook 之后，避免条件调用 hook
  if (PUBLICATIONS.length === 0) return null

  return (
    <section className="section" id="publications">
      <SectionTitle
        id="publications-title"
        title="论文与专利"
        sub="Publications & Patents"
        action={
          <div className="filter-bar">
            {FILTERS.map(([key, label]) => (
              <button
                key={key}
                className={`chip ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label} <span className="count">{counts[key] || 0}</span>
              </button>
            ))}
          </div>
        }
      />

      {grouped.map(([year, rows]) => (
        <div className="pub-year-group" key={year}>
          <div className="pub-year">{year}</div>
          <ul className="pub-list">
            {rows.map((p) => (
              <li className="pub-item" key={p.id}>
                <h3 className="pub-title">{p.title}</h3>
                <Authors authors={p.authors} />
                <p className="pub-venue">
                  <span className={`badge type-${p.type}`}>{TYPE_LABEL[p.type] || p.type}</span>
                  {p.venueShort ? <em>{p.venueShort}</em> : null}
                  {p.venue ? <span className="pub-venue-full">{p.venue}</span> : null}
                  {p.position ? <span className="pub-position">第 {p.position}</span> : null}
                  {p.zone ? <span className="pub-zone">{p.zone}</span> : null}
                  {p.award ? <span className="pub-award">🏅 {p.award}</span> : null}
                </p>
                {p.note ? <p className="pub-note">{p.note}</p> : null}
                <Links links={p.links || {}} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
