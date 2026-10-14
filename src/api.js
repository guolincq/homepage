import { cloud, unwrap } from './cloud'

const POST_LIST_COLUMNS =
  'id, owner_id, title, slug, summary, cover, category, tags, status, views, published_at, updated_at'

/** 兜底清理：or() 的语法里逗号、括号是分隔符，搜索词要去掉它们。 */
function sanitizeKeyword(keyword) {
  return String(keyword || '').replace(/[,().*%\\]/g, ' ').trim().slice(0, 40)
}

/**
 * 文章列表：分页 + 标签/分类筛选 + 排序 + 关键字。
 * 访客只能读到 status='published' 的行（RLS 保证），登录后在后台可传 status 查看全部。
 */
export async function listPosts({
  page = 1,
  pageSize = 10,
  tag = '',
  category = '',
  sort = 'newest',
  keyword = '',
  status = 'published',
} = {}) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = cloud.database
    .from('posts')
    .select(POST_LIST_COLUMNS, { count: 'exact' })

  if (status && status !== 'all') query = query.eq('status', status)
  if (tag) query = query.contains('tags', [tag])
  if (category) query = query.eq('category', category)

  const kw = sanitizeKeyword(keyword)
  if (kw) {
    const pattern = `%${kw}%`
    query = query.or(`title.ilike.${pattern},summary.ilike.${pattern}`)
  }

  const ascending = sort === 'oldest'
  query = query.order('published_at', { ascending }).range(from, to)

  const { data, error, count } = await query
  if (error) throw error
  return { rows: data || [], total: count || 0 }
}

export async function getPost(id) {
  const { data, error } = await cloud.database
    .from('posts')
    .select('*')
    .eq('id', Number(id))
    .maybeSingle()
  if (error) throw error
  return data
}

export async function createPost(values) {
  const payload = normalizePost(values)
  const { data, error } = await cloud.database
    .from('posts')
    .insert(payload)
    .select('id')
    .single()
  if (error) throw error
  return unwrap({ data })
}

export async function updatePost(id, values) {
  const payload = normalizePost(values)
  payload.updated_at = new Date().toISOString()
  const { data, error } = await cloud.database
    .from('posts')
    .update(payload)
    .eq('id', Number(id))
    .select('id')
  if (error) throw error
  // 空数组 = RLS 拦下了（不是本人文章），不是成功
  if (!Array.isArray(data) || data.length === 0) {
    throw { code: '42501', message: '没有权限修改该文章' }
  }
  return data[0]
}

export async function deletePost(id) {
  const { data, error } = await cloud.database
    .from('posts')
    .delete()
    .eq('id', Number(id))
    .select('id')
  if (error) throw error
  if (!Array.isArray(data) || data.length === 0) {
    throw { code: '42501', message: '没有权限删除该文章' }
  }
  return true
}

function normalizePost(values) {
  const tags = (values.tags || [])
    .map((t) => String(t).trim())
    .filter(Boolean)
    .slice(0, 12)
  return {
    title: String(values.title || '').trim() || '未命名文章',
    slug: String(values.slug || '').trim() || null,
    summary: String(values.summary || '').trim(),
    content_md: values.content_md || '',
    cover: String(values.cover || '').trim() || null,
    category: String(values.category || '').trim() || '未分类',
    tags: Array.from(new Set(tags)),
    status: values.status === 'draft' ? 'draft' : 'published',
    published_at: values.published_at || new Date().toISOString(),
  }
}

/** 标签云 / 分类列表：从已发布文章聚合（个人博客量级下比额外建表更轻）。 */
export async function fetchFacets() {
  const { data, error } = await cloud.database
    .from('posts')
    .select('tags, category')
    .eq('status', 'published')
  if (error) throw error

  const tagMap = new Map()
  const catMap = new Map()
  for (const row of data || []) {
    for (const tag of row.tags || []) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    }
    const cat = row.category || '未分类'
    catMap.set(cat, (catMap.get(cat) || 0) + 1)
  }
  return {
    tags: [...tagMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh')),
    categories: [...catMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh')),
  }
}

/* ------------------------------ 关于页 / 站点资料 ------------------------------ */

export async function fetchProfile() {
  const { data, error } = await cloud.database
    .from('site_profile')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
  if (error) throw error
  return (data && data[0]) || null
}

export async function fetchMyProfile() {
  const { data: session } = await cloud.auth.getSession()
  if (!session) return null
  const { data, error } = await cloud.database
    .from('site_profile')
    .select('*')
    .eq('owner_id', session.user.id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function saveProfile(values) {
  const payload = {
    display_name: String(values.display_name || '').trim(),
    tagline: String(values.tagline || '').trim(),
    avatar: String(values.avatar || '').trim() || null,
    content_md: values.content_md || '',
    links: Array.isArray(values.links) ? values.links : [],
    updated_at: new Date().toISOString(),
  }
  const mine = await fetchMyProfile()
  if (mine && mine.id) {
    const { data, error } = await cloud.database
      .from('site_profile')
      .update(payload)
      .eq('id', mine.id)
      .select('id')
    if (error) throw error
    if (!Array.isArray(data) || data.length === 0) {
      throw { code: '42501', message: '没有权限修改该资料' }
    }
    return mine.id
  }
  const { data, error } = await cloud.database
    .from('site_profile')
    .insert(payload)
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

/* --------------------------------- 图片 / 附件 --------------------------------- */

const MAX_IMAGE_EDGE = 1600
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/** 图片压缩到最长边 1600px 的 WebP，控制体积以便长期展示。 */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      const dataUrl = canvas.toDataURL('image/webp', 0.82)
      resolve(dataUrl)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片解析失败'))
    }
    img.src = url
  })
}

/**
 * 上传静态资源：
 * 1) 原件存入云端对象存储（shared 路径，登录用户可读）；
 * 2) 同时在 assets 表留一份可供匿名访客直接渲染的内容副本。
 * 返回 asset id，文章正文里以 asset:<id> 引用。
 */
export async function uploadAsset(file) {
  const { data: session } = await cloud.auth.getSession()
  if (!session) throw { kind: 'unauthenticated', message: '请先登录后再上传图片' }
  if (file.size > MAX_ATTACHMENT_SIZE) {
    throw { kind: 'invalid', message: '单个文件请控制在 5MB 以内' }
  }

  const isImage = /^image\//.test(file.type)
  const dataUrl = isImage ? await compressImage(file) : await readAsDataUrl(file)
  const mime = isImage ? 'image/webp' : file.type || 'application/octet-stream'
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
  const key = `posts/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  let storagePath = ''
  try {
    const sharedPath = cloud.storage.sharedPath(session.user.id, key)
    await cloud.storage.upload(sharedPath, file, {
      contentType: file.type || mime,
      upsert: false,
    })
    storagePath = sharedPath
  } catch (storageError) {
    console.warn('[blog] 对象存储上传未成功，仅保留数据库副本', storageError?.message)
  }

  const { data, error } = await cloud.database
    .from('assets')
    .insert({
      name: file.name,
      mime,
      size: file.size,
      storage_path: storagePath,
      data: dataUrl,
    })
    .select('id')
    .single()
  if (error) throw error
  return { id: data.id, dataUrl, name: file.name, mime, storagePath }
}

const assetCache = new Map()

/** 渲染正文时把 asset:<id> 换成可显示的 data URL。 */
export async function resolveAssets(ids) {
  const unique = [...new Set(ids.map(Number).filter(Boolean))]
  const missing = unique.filter((id) => !assetCache.has(id))
  if (missing.length > 0) {
    const { data, error } = await cloud.database
      .from('assets')
      .select('id, data, mime, name')
      .in('id', missing)
    if (!error) {
      for (const row of data || []) assetCache.set(row.id, row)
    }
  }
  const map = {}
  for (const id of unique) {
    const hit = assetCache.get(id)
    if (hit && hit.data) map[id] = hit.data
  }
  return map
}

export function peekAsset(id) {
  const hit = assetCache.get(Number(id))
  return hit && hit.data ? hit.data : null
}
