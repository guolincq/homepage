import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createPost, getPost, updatePost, uploadAsset } from '../api'
import { errorMessage } from '../cloud'
import { MarkdownView, Spinner, useToast } from '../components'
import { plainText } from '../markdown'

const TAG_SPLIT = /[,，\s]+/

export default function PostEditor() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()
  const textareaRef = useRef(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: '',
    tags: '',
    summary: '',
    cover: '',
    status: 'published',
    published_at: new Date().toISOString().slice(0, 16),
    content_md: '# 新文章\n\n在这里开始写作…\n',
  })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    let alive = true
    getPost(id)
      .then((row) => {
        if (!alive || !row) return
        setForm({
          title: row.title || '',
          slug: row.slug || '',
          category: row.category || '',
          tags: (row.tags || []).join(', '),
          summary: row.summary || '',
          cover: row.cover || '',
          status: row.status || 'published',
          published_at: (row.published_at || new Date().toISOString()).slice(0, 16),
          content_md: row.content_md || '',
        })
      })
      .catch((e) => toast.error(errorMessage(e, '文章加载失败')))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [id, isEdit, toast])

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const insertAtCursor = (snippet) => {
    const el = textareaRef.current
    if (!el) {
      setForm((prev) => ({ ...prev, content_md: prev.content_md + snippet }))
      return
    }
    const start = el.selectionStart ?? form.content_md.length
    const end = el.selectionEnd ?? start
    const next = form.content_md.slice(0, start) + snippet + form.content_md.slice(end)
    setForm((prev) => ({ ...prev, content_md: next }))
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = start + snippet.length
    })
  }

  const onUploadImage = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const asset = await uploadAsset(file)
      insertAtCursor(`\n![${asset.name || '图片'}](asset:${asset.id})\n`)
      toast.success('图片已上传')
    } catch (e) {
      toast.error(errorMessage(e, '图片上传失败'))
    } finally {
      setUploading(false)
    }
  }

  const onSave = async (event) => {
    event?.preventDefault()
    if (!form.title.trim()) return toast.error('请填写标题')
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug,
      category: form.category,
      tags: form.tags.split(TAG_SPLIT).filter(Boolean),
      summary: form.summary || plainText(form.content_md, 110),
      cover: form.cover,
      status: form.status,
      published_at: new Date(form.published_at).toISOString(),
      content_md: form.content_md,
    }
    try {
      if (isEdit) {
        await updatePost(id, payload)
        toast.success('已保存')
      } else {
        const created = await createPost(payload)
        toast.success('已发布')
        if (created?.id) navigate(`/admin/edit/${created.id}`, { replace: true })
        else navigate('/admin')
        return
      }
    } catch (e) {
      toast.error(errorMessage(e, '保存失败'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">{isEdit ? '编辑文章' : '写新文章'}</h1>
        <div className="btn-row">
          <Link to="/admin" className="btn sm">
            返回列表
          </Link>
          <button className="btn sm primary" onClick={onSave} disabled={saving}>
            {saving ? '保存中…' : '保存'}
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="field">
          <label>标题</label>
          <input className="input" value={form.title} onChange={setField('title')} placeholder="文章标题" />
        </div>
        <div className="field">
          <label>别名 slug（可选，用于友好链接）</label>
          <input className="input" value={form.slug} onChange={setField('slug')} placeholder="my-first-post" />
        </div>
        <div className="field">
          <label>分类</label>
          <input className="input" value={form.category} onChange={setField('category')} placeholder="如：技术笔记" />
        </div>
        <div className="field">
          <label>标签（逗号或空格分隔，可多个）</label>
          <input className="input" value={form.tags} onChange={setField('tags')} placeholder="React, 随笔" />
        </div>
        <div className="field">
          <label>封面图地址（可选，留空用渐变占位）</label>
          <input className="input" value={form.cover} onChange={setField('cover')} placeholder="https://… 或 asset 图片地址" />
        </div>
        <div className="field">
          <label>发布状态</label>
          <select className="select" value={form.status} onChange={setField('status')} style={{ borderRadius: 10 }}>
            <option value="published">已发布（所有人可见）</option>
            <option value="draft">草稿（仅自己可见）</option>
          </select>
        </div>
      </div>

      <div className="field" style={{ maxWidth: 320 }}>
        <label>发布时间</label>
        <input
          className="input"
          type="datetime-local"
          value={form.published_at}
          onChange={setField('published_at')}
        />
      </div>

      <div className="field">
        <label>摘要（留空自动截取正文）</label>
        <textarea className="textarea" value={form.summary} onChange={setField('summary')} />
      </div>

      <div className="editor-shell">
        <div className="editor-pane">
          <div className="editor-pane-head">
            <span>Markdown 编辑</span>
            <div className="btn-row">
              <button className="btn sm" onClick={() => insertAtCursor('**粗体**')}>
                粗体
              </button>
              <button className="btn sm" onClick={() => insertAtCursor('\n## 小标题\n')}>
                标题
              </button>
              <button className="btn sm" onClick={() => insertAtCursor('\n> 引用\n')}>
                引用
              </button>
              <button className="btn sm" onClick={() => insertAtCursor('\n```js\nconsole.log(1)\n```\n')}>
                代码块
              </button>
              <button className="btn sm" onClick={() => insertAtCursor('[链接](https://)')}>
                链接
              </button>
              <label className="btn sm" style={{ marginBottom: 0 }}>
                {uploading ? '上传中…' : '插入图片'}
                <input type="file" accept="image/*" hidden onChange={onUploadImage} />
              </label>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            className="editor-md"
            value={form.content_md}
            onChange={setField('content_md')}
            spellCheck={false}
          />
        </div>

        <div className="editor-pane">
          <div className="editor-pane-head">
            <span>实时预览</span>
            <span>{form.content_md.length} 字</span>
          </div>
          <div className="preview">
            <MarkdownView markdown={form.content_md} />
          </div>
        </div>
      </div>
    </div>
  )
}
