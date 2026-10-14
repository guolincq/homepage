/**
 * 纯字符串工具。
 * 独立成文件的原因：plainText / readingTime 属于纯函数，但原先住在 markdown.js 里，
 * 而 markdown.js 依赖 marked + highlight.js + dompurify。若文章索引从 markdown.js 取这两个
 * 函数，highlight.js 会被拉回首屏 chunk，路由懒加载的代码分割就失效了。
 * 因此：所有不依赖 Markdown 渲染器的文本工具都放这里。
 */

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
  const chars = String(markdown || '').replace(/\s+/g, '').length
  return Math.max(1, Math.round(chars / 350))
}

export function formatDate(value) {
  if (!value) return ''
  // date 一律保持 'YYYY-MM-DD' 字符串，避免 new Date() 的时区偏移
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[1]}年${Number(m[2])}月${Number(m[3])}日`
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
