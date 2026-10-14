/**
 * Markdown 渲染。
 * 只被 PostDetail / MarkdownView 依赖 —— 因此 marked + highlight.js + dompurify
 * 会全部落在博客的异步 chunk 里，不会进入首屏。
 *
 * 语言包按需注册，共 8 种（原 15 种）。未注册的语言自动降级为纯文本，不会报错。
 */
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import DOMPurify from 'dompurify'
import { escapeHtml } from './utils/text'

const LANGUAGES = { bash, javascript, json, plaintext, python, sql, typescript, xml, yaml }
for (const [name, lang] of Object.entries(LANGUAGES)) hljs.registerLanguage(name, lang)

hljs.registerAliases(['js', 'jsx', 'mjs', 'cjs'], { languageName: 'javascript' })
hljs.registerAliases(['ts', 'tsx'], { languageName: 'typescript' })
hljs.registerAliases(['html', 'svg'], { languageName: 'xml' })
hljs.registerAliases(['sh', 'shell', 'zsh', 'console'], { languageName: 'bash' })
hljs.registerAliases(['yml'], { languageName: 'yaml' })
hljs.registerAliases(['py'], { languageName: 'python' })
hljs.registerAliases(['text', 'txt'], { languageName: 'plaintext' })

const renderer = new marked.Renderer()

renderer.code = function code(source, infostring) {
  const lang = String(infostring || '').match(/\S*/)?.[0] || ''
  let body
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
  const src = String(href || '')
  return `<figure class="md-figure"><img src="${src}" alt="${escapeHtml(text || '')}" loading="lazy"${
    title ? ` title="${escapeHtml(title)}"` : ''
  } />${text ? `<figcaption>${escapeHtml(text)}</figcaption>` : ''}</figure>`
}

renderer.link = function link(href, title, text) {
  const external = /^https?:\/\//i.test(String(href || ''))
  return `<a href="${href}"${title ? ` title="${escapeHtml(title)}"` : ''}${
    external ? ' target="_blank" rel="noopener noreferrer"' : ''
  }>${text}</a>`
}

marked.setOptions({ renderer, gfm: true, breaks: false })

export function renderMarkdown(markdown) {
  const html = marked.parse(markdown || '')
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'loading'],
    ADD_TAGS: ['figure', 'figcaption'],
  })
}
