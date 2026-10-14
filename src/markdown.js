import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import rust from 'highlight.js/lib/languages/rust'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import DOMPurify from 'dompurify'

const LANGUAGES = {
  bash, cpp, css, go, java, javascript, json, markdown,
  plaintext, python, rust, sql, typescript, xml, yaml,
}
for (const [name, lang] of Object.entries(LANGUAGES)) {
  hljs.registerLanguage(name, lang)
}
hljs.registerAliases(['js', 'jsx'], { languageName: 'javascript' })
hljs.registerAliases(['ts', 'tsx'], { languageName: 'typescript' })
hljs.registerAliases(['html'], { languageName: 'xml' })
hljs.registerAliases(['sh', 'shell', 'zsh'], { languageName: 'bash' })
hljs.registerAliases(['yml'], { languageName: 'yaml' })
hljs.registerAliases(['py'], { languageName: 'python' })
hljs.registerAliases(['text', 'txt'], { languageName: 'plaintext' })

let assetMap = {}

const renderer = new marked.Renderer()

renderer.code = function code(source, infostring) {
  const lang = String(infostring || '').match(/\S*/)?.[0] || ''
  let body = ''
  if (lang && hljs.getLanguage(lang)) {
    try {
      body = hljs.highlight(source, { language: lang, ignoreIllegals: true }).value
    } catch {
      body = escapeHtml(source)
    }
  } else {
    body = escapeHtml(source)
  }
  return `<pre class="md-code"><div class="md-code-bar"><span class="md-code-lang">${
    lang || 'text'
  }</span><button type="button" class="md-copy" data-copy="${encodeURIComponent(source)}">复制</button></div><code class="hljs language-${
    lang || 'text'
  }">${body}</code></pre>`
}

renderer.image = function image(href, title, text) {
  const raw = String(href || '')
  const matched = raw.match(/^asset:(\d+)$/)
  const src = matched ? assetMap[matched[1]] || '' : raw
  return `<figure class="md-figure"><img src="${src}" alt="${escapeHtml(
    text || '',
  )}" loading="lazy" ${title ? `title="${escapeHtml(title)}"` : ''}/>${
    text ? `<figcaption>${escapeHtml(text)}</figcaption>` : ''
  }</figure>`
}

renderer.link = function link(href, title, text) {
  const external = /^https?:\/\//i.test(String(href || ''))
  return `<a href="${href}" ${title ? `title="${escapeHtml(title)}"` : ''}${
    external ? ' target="_blank" rel="noopener noreferrer"' : ''
  }>${text}</a>`
}

marked.setOptions({ renderer, gfm: true, breaks: false })

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** 正文里的资源引用：asset:<id> */
export function extractAssetIds(markdown) {
  const ids = []
  const re = /!\[[^\]]*\]\(asset:(\d+)\)/g
  let hit
  while ((hit = re.exec(markdown || '')) !== null) ids.push(Number(hit[1]))
  return ids
}

export function renderMarkdown(markdown, assets = {}) {
  assetMap = assets || {}
  const html = marked.parse(markdown || '')
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'loading'],
    ADD_TAGS: ['figure', 'figcaption'],
  })
}

/** 摘要：去掉 Markdown 标记后的纯文本，用于卡片与自动摘要。 */
export function plainText(markdown, limit = 120) {
  const text = String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > limit ? `${text.slice(0, limit)}…` : text
}

export function readingTime(markdown) {
  const words = String(markdown || '').replace(/\s+/g, '').length
  return Math.max(1, Math.round(words / 350))
}
