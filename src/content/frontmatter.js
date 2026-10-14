/**
 * 极简 front-matter 解析（不引入 gray-matter，约 40 行够用）。
 * 支持：key: value、key: [a, b, c]、引号包裹、true/false。
 */

// 锚定文件开头，正文中间出现的 --- 不会被误判
const FM_RE = /^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function parseValue(raw) {
  const v = raw.trim()
  if (!v) return ''
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }
  if (/^(['"]).*\1$/.test(v)) return v.slice(1, -1)
  if (v === 'true') return true
  if (v === 'false') return false
  return v
}

export function parseFrontMatter(raw) {
  const src = String(raw ?? '')
  const m = src.match(FM_RE)
  if (!m) return { data: {}, body: src.trim() }

  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf(':') // 只切第一个冒号，值里允许含 ':'
    if (i < 0) continue
    data[t.slice(0, i).trim()] = parseValue(t.slice(i + 1))
  }
  return { data, body: src.slice(m[0].length).trim() }
}
