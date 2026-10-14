import { useCallback, useMemo } from 'react'
import { renderMarkdown } from '../markdown'

export default function MarkdownView({ markdown, className = 'md-body' }) {
  const html = useMemo(() => renderMarkdown(markdown), [markdown])

  const onCopy = useCallback((event) => {
    const btn = event.target.closest('.md-copy')
    if (!btn) return
    const code = decodeURIComponent(btn.dataset.copy || '')
    navigator.clipboard?.writeText(code).then(
      () => {
        btn.textContent = '已复制'
        setTimeout(() => {
          btn.textContent = '复制'
        }, 1500)
      },
      () => {},
    )
  }, [])

  return <div className={className} onClick={onCopy} dangerouslySetInnerHTML={{ __html: html }} />
}
