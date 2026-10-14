import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listPosts, deletePost, updatePost } from '../api'
import { errorMessage } from '../cloud'
import { useAuth } from '../auth'
import { Empty, Pagination, Spinner, formatDate, useToast } from '../components'

export default function Admin() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mineOnly, setMineOnly] = useState(false)
  const pageSize = 10

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { rows, total: count } = await listPosts({
        page,
        pageSize,
        status: 'all',
        sort: 'newest',
      })
      setPosts(rows)
      setTotal(count)
    } catch (e) {
      const msg = errorMessage(e, '文章加载失败')
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [page, toast])

  useEffect(() => {
    load()
  }, [load])

  const rows = mineOnly && user ? posts.filter((p) => p.owner_id === user.id) : posts

  const onDelete = async (post) => {
    if (!window.confirm(`确定删除《${post.title}》？该操作不可恢复。`)) return
    try {
      await deletePost(post.id)
      toast.success('已删除')
      load()
    } catch (e) {
      toast.error(errorMessage(e, '删除失败'))
    }
  }

  const toggleStatus = async (post) => {
    try {
      await updatePost(post.id, {
        ...post,
        status: post.status === 'published' ? 'draft' : 'published',
      })
      toast.success(post.status === 'published' ? '已转为草稿' : '已发布')
      load()
    } catch (e) {
      toast.error(errorMessage(e, '状态更新失败'))
    }
  }

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">后台管理</h1>
        <div className="btn-row">
          <label className="chip" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={mineOnly}
              onChange={(e) => setMineOnly(e.target.checked)}
              style={{ marginRight: 4 }}
            />
            只看我的
          </label>
          <Link to="/admin/profile" className="btn sm">
            站点资料
          </Link>
          <Link to="/admin/new" className="btn sm primary">
            写新文章
          </Link>
          <button
            className="btn sm"
            onClick={async () => {
              await signOut()
              navigate('/')
            }}
          >
            退出登录
          </button>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <Empty
          title="还没有文章"
          extra={
            <Link to="/admin/new" className="btn primary">
              写第一篇
            </Link>
          }
        />
      ) : (
        <>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>分类</th>
                  <th>标签</th>
                  <th>状态</th>
                  <th>更新时间</th>
                  <th style={{ textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((post) => {
                  const isOwner = Boolean(user && post.owner_id === user.id)
                  return (
                    <tr key={post.id}>
                      <td>
                        <Link to={`/post/${post.id}`} style={{ fontWeight: 600 }}>
                          {post.title}
                        </Link>
                      </td>
                      <td>{post.category || '未分类'}</td>
                      <td>
                        <div className="post-tags">
                          {(post.tags || []).map((t) => (
                            <span key={t} className="tag-pill">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${post.status === 'draft' ? 'draft' : ''}`}>
                          {post.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td>{formatDate(post.updated_at || post.published_at)}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {isOwner ? (
                          <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
                            <Link to={`/admin/edit/${post.id}`} className="btn sm">
                              编辑
                            </Link>
                            <button className="btn sm" onClick={() => toggleStatus(post)}>
                              {post.status === 'published' ? '转草稿' : '发布'}
                            </button>
                            <button className="btn sm danger" onClick={() => onDelete(post)}>
                              删除
                            </button>
                          </div>
                        ) : (
                          <span className="hint">他人文章</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
        </>
      )}
    </div>
  )
}
