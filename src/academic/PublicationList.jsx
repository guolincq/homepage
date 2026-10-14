import { useMemo, useState } from 'react'
import { PROFILE, PUBLICATIONS } from '../content/profile'
import { SectionTitle } from '../components/ui'

const TYPE_LABEL = { conference: '会议', journal: '期刊', preprint: '预印本' }

function isSelf(author) {
  return author === PROFILE.name.cn || author === PROFILE.name.en
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
    const c = { all: PUBLICATIONS.length, conference: 0, journal: 0, preprint: 0 }
    for (const p of PUBLICATIONS) c[p.type] = (c[p.type] || 0) + 1
    return c
  }, [])

  return (
    <section className="section" id="publications">
      <SectionTitle
        id="publications-title"
        title="论文发表"
        sub="Publications"
        action={
          <div className="filter-bar">
            {[
              ['all', '全部'],
              ['conference', '会议'],
              ['journal', '期刊'],
              ['preprint', '预印本'],
            ].map(([key, label]) => (
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
                  <span className="badge">{TYPE_LABEL[p.type] || p.type}</span>
                  {p.venueShort ? <em>{p.venueShort}</em> : null}
                  {p.venue ? <span className="pub-venue-full">{p.venue}</span> : null}
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
