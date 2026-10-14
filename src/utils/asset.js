/**
 * 站点内资源路径解析。
 *
 * Vite 的 `base` 只会改写「构建产物引用」（index.html 里的 /assets/*.js、CSS 里的 url()），
 * 不会改写源码里的字符串。文章 front-matter 的 cover、正文里的 ![](/images/xxx.svg)
 * 都是普通字符串，部署到子路径（/homepage/）后不变就会 404。
 *
 * 因此统一走这里加前缀。BASE_URL 恒以 '/' 结尾（本地 '/'、线上 '/homepage/'），
 * 外链与协议相对 URL 原样放行。
 */
export function resolveAsset(url) {
  const u = String(url || '')
  if (!u) return ''
  // 外链、协议相对、锚点、data URI 不处理
  if (/^(https?:)?\/\//i.test(u) || u.startsWith('#') || u.startsWith('data:')) return u
  if (!u.startsWith('/')) return u // 相对路径交给浏览器按当前文档解析
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + u
}
