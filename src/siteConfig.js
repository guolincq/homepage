/**
 * 站点级配置：改这里即可改博客名字、博主署名、导航与首页标语。
 */
export const SITE = {
  name: '拾光笔记',
  shortName: '拾光',
  tagline: '记录技术、阅读与生活里的光',
  author: '林',
  description: '一个关于技术实践、阅读思考与生活随感的个人博客。',
  nav: [
    { to: '/', label: '首页' },
    { to: '/tags', label: '标签' },
    { to: '/about', label: '关于' },
  ],
  pageSize: 8,
}

/** 文章默认封面（无图时的渐变占位色） */
export const COVER_GRADIENTS = [
  'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
  'linear-gradient(135deg,#0ea5e9 0%,#22d3ee 100%)',
  'linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)',
  'linear-gradient(135deg,#10b981 0%,#14b8a6 100%)',
  'linear-gradient(135deg,#ec4899 0%,#f43f5e 100%)',
  'linear-gradient(135deg,#64748b 0%,#334155 100%)',
]

export function gradientFor(seed) {
  const s = String(seed ?? '')
  let sum = 0
  for (let i = 0; i < s.length; i += 1) sum += s.charCodeAt(i)
  return COVER_GRADIENTS[sum % COVER_GRADIENTS.length]
}
