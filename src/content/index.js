import { parseFrontMatter } from './frontmatter'
// 只依赖纯字符串工具，绝不 import ../markdown（否则 highlight.js 会被拉回首屏）
import { plainText, readingTime } from '../utils/text'

const modules = import.meta.glob('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, body } = parseFrontMatter(raw)
    const file = path.split('/').pop().replace(/\.md$/, '')
    return {
      slug: data.slug || file.replace(/^\d{4}-\d{2}-\d{2}-/, ''),
      title: data.title || file,
      date: data.date || '',
      category: data.category || '未分类',
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover || '',
      draft: data.draft === true,
      summary: data.summary || plainText(body, 110),
      minutes: readingTime(body),
      body,
    }
  })
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

export const getPost = (slug) => posts.find((p) => p.slug === slug)

function facet(key) {
  const counter = new Map()
  for (const p of posts) {
    const values = Array.isArray(p[key]) ? p[key] : [p[key]]
    for (const v of values) {
      if (!v) continue
      counter.set(v, (counter.get(v) || 0) + 1)
    }
  }
  return [...counter.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export const allTags = facet('tags')
export const allCategories = facet('category')

export function filterPosts({ tag = '', category = '', q = '', page = 1, pageSize = 8, sort = 'newest' } = {}) {
  const kw = q.trim().toLowerCase()
  let rows = posts.filter((p) => {
    if (tag && !p.tags.includes(tag)) return false
    if (category && p.category !== category) return false
    if (kw) {
      const hay = `${p.title} ${p.summary} ${p.tags.join(' ')} ${p.category}`.toLowerCase()
      if (!hay.includes(kw)) return false
    }
    return true
  })
  if (sort === 'oldest') rows = [...rows].reverse()
  const total = rows.length
  const start = (page - 1) * pageSize
  return { rows: rows.slice(start, start + pageSize), total }
}
