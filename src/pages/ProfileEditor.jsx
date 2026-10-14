import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyProfile, saveProfile, uploadAsset } from '../api'
import { errorMessage } from '../cloud'
import { MarkdownView, Spinner, useToast } from '../components'

const LINKS_PLACEHOLDER = JSON.stringify(
  [
    { label: 'GitHub', url: 'https://github.com/' },
    { label: '邮箱', url: 'mailto:you@example.com' },
  ],
  null,
  2,
)

export default function ProfileEditor() {
  const toast = useToast()
  const [form, setForm] = useState({
    display_name: '',
    tagline: '',
    avatar: '',
    content_md: '',
    linksText: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let alive = true
    fetchMyProfile()
      .then((row) => {
        if (!alive) return
        setForm({
          display_name: row?.display_name || '',
          tagline: row?.tagline || '',
          avatar: row?.avatar || '',
          content_md: row?.content_md || '',
          linksText: row?.links?.length ? JSON.stringify(row.links, null, 2) : '',
        })
      })
      .catch((e) => toast.error(errorMessage(e, '资料加载失败')))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [toast])

  const setField = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const onAvatar = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const asset = await uploadAsset(file)
      setForm((prev) => ({ ...prev, avatar: asset.dataUrl }))
      toast.success('头像已上传')
    } catch (e) {
      toast.error(errorMessage(e, '头像上传失败'))
    }
  }

  const onSave = async (event) => {
    event.preventDefault()
    let links = []
    if (form.linksText.trim()) {
      try {
        const parsed = JSON.parse(form.linksText)
        if (!Array.isArray(parsed)) throw new Error('格式应为数组')
        links = parsed
          .filter((l) => l && l.url)
          .map((l) => ({ label: String(l.label || l.url), url: String(l.url) }))
      } catch {
        return toast.error('联系方式需为合法 JSON 数组，例如 [{"label":"GitHub","url":"https://"}]')
      }
    }
    setSaving(true)
    try {
      await saveProfile({ ...form, links })
      toast.success('资料已保存')
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
        <h1 className="page-title">站点资料</h1>
        <div className="btn-row">
          <Link to="/about" className="btn sm">
            查看关于页
          </Link>
          <button className="btn sm primary" onClick={onSave} disabled={saving}>
            {saving ? '保存中…' : '保存'}
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label>博主昵称</label>
          <input className="input" value={form.display_name} onChange={setField('display_name')} />
        </div>
        <div className="field">
          <label>一句话签名</label>
          <input className="input" value={form.tagline} onChange={setField('tagline')} />
        </div>
      </div>

      <div className="field">
        <label>头像</label>
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <label className="btn sm" style={{ marginBottom: 0 }}>
            上传图片
            <input type="file" accept="image/*" hidden onChange={onAvatar} />
          </label>
          {form.avatar ? (
            <img src={form.avatar} alt="头像预览" style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover' }} />
          ) : null}
          <span className="hint">也可直接粘贴图片地址</span>
        </div>
        <input className="input" style={{ marginTop: 8 }} value={form.avatar} onChange={setField('avatar')} placeholder="https://…" />
      </div>

      <div className="field">
        <label>关于页正文（Markdown）</label>
        <textarea
          className="textarea"
          style={{ minHeight: 200 }}
          value={form.content_md}
          onChange={setField('content_md')}
        />
      </div>

      <div className="field">
        <label>联系方式（JSON 数组）</label>
        <textarea
          className="textarea"
          style={{ minHeight: 110, fontFamily: 'Consolas, monospace' }}
          value={form.linksText}
          onChange={setField('linksText')}
          placeholder={LINKS_PLACEHOLDER}
        />
      </div>

      <div className="editor-pane">
        <div className="editor-pane-head">
          <span>预览</span>
        </div>
        <div className="preview">
          <MarkdownView markdown={form.content_md || '（还没有内容）'} />
        </div>
      </div>
    </div>
  )
}
