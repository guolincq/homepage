/** 文章无封面时的渐变占位色池 */

export const COVER_GRADIENTS = [
  'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
  'linear-gradient(135deg,#0ea5e9 0%,#22d3ee 100%)',
  'linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)',
  'linear-gradient(135deg,#10b981 0%,#14b8a6 100%)',
  'linear-gradient(135deg,#ec4899 0%,#f43f5e 100%)',
  'linear-gradient(135deg,#64748b 0%,#334155 100%)',
]

/** 按标题字符码取稳定渐变（同一标题每次渲染颜色一致） */
export function gradientFor(seed) {
  const key = String(seed || '')
  let sum = 0
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i)
  return COVER_GRADIENTS[sum % COVER_GRADIENTS.length]
}

/** 头像占位：取姓名首字，配品牌渐变 */
export function initialsOf(name) {
  const s = String(name || '').trim()
  if (!s) return '?'
  if (/^[\u4e00-\u9fa5]/.test(s)) return s.slice(0, 1)
  return s.slice(0, 1).toUpperCase()
}
