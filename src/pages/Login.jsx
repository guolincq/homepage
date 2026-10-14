import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cloud, errorMessage } from '../cloud'
import { useAuth } from '../auth'
import { useToast } from '../components'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [tab, setTab] = useState('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [countdown, setCountdown] = useState(0)

  // OTP 流程：发送与验证是两次独立动作，challenge 必须跨事件保存
  const [pendingOtp, setPendingOtp] = useState(null)
  const [resetCtx, setResetCtx] = useState(null)

  const { isAuthed } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const from = location.state?.from || '/admin'

  useEffect(() => {
    if (isAuthed) navigate(from, { replace: true })
  }, [isAuthed, navigate, from])

  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(timer)
          return 0
        }
        return n - 1
      })
    }, 1000)
  }

  const submitPassword = async (event) => {
    event.preventDefault()
    if (!EMAIL_RE.test(email)) return toast.error('请输入有效的邮箱地址')
    if (!password) return toast.error('请输入密码')
    setBusy(true)
    setNotice('')
    const { error } = await cloud.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) return toast.error(errorMessage(error, '邮箱或密码不正确'))
    toast.success('登录成功')
    navigate(from, { replace: true })
  }

  const sendCode = async () => {
    if (!EMAIL_RE.test(email)) return toast.error('请输入有效的邮箱地址')
    setBusy(true)
    setNotice('')
    const sent = await cloud.auth.sendOtp({ email })
    setBusy(false)
    if (sent.error) return toast.error(errorMessage(sent.error, '验证码发送失败'))
    setPendingOtp({
      email,
      verificationId: sent.data.verificationId,
      isExistingUser: sent.data.isExistingUser,
    })
    startCountdown()
    setNotice('验证码已发送，请查收邮件（新用户需同时设置密码）')
  }

  const submitOtp = async (event) => {
    event.preventDefault()
    if (!pendingOtp || pendingOtp.email !== email) {
      return toast.error('请先为当前邮箱获取验证码')
    }
    if (!code.trim()) return toast.error('请输入验证码')
    if (!pendingOtp.isExistingUser && password.length < 6) {
      return toast.error('新用户需设置至少 6 位密码')
    }
    setBusy(true)
    const completed = await cloud.auth.verifyOtp({
      email: pendingOtp.email,
      verificationId: pendingOtp.verificationId,
      isExistingUser: pendingOtp.isExistingUser,
      token: code.trim(),
      password: pendingOtp.isExistingUser ? undefined : password,
    })
    setBusy(false)
    if (completed.error) return toast.error(errorMessage(completed.error, '验证码校验失败'))
    setPendingOtp(null)
    toast.success(pendingOtp.isExistingUser ? '登录成功' : '注册成功')
    navigate(from, { replace: true })
  }

  const sendReset = async () => {
    if (!EMAIL_RE.test(email)) return toast.error('请输入有效的邮箱地址')
    setBusy(true)
    const started = await cloud.auth.resetPasswordForEmail(email)
    setBusy(false)
    if (started.error) return toast.error(errorMessage(started.error, '重置邮件发送失败'))
    setResetCtx(started.data)
    setNotice('重置验证码已发送，请输入邮件中的验证码与新密码')
  }

  const submitReset = async (event) => {
    event.preventDefault()
    if (!resetCtx) return toast.error('请先获取重置验证码')
    if (newPassword.length < 6) return toast.error('新密码至少 6 位')
    setBusy(true)
    const done = await resetCtx.updateUser({ nonce: code.trim(), password: newPassword })
    setBusy(false)
    if (done?.error) return toast.error(errorMessage(done.error, '重置密码失败'))
    toast.success('密码已重置')
    setTab('password')
  }

  const wechatLogin = async () => {
    setBusy(true)
    const { data, error } = await cloud.auth.signInWithOAuth({
      provider: 'wechat',
      redirectTo: location.origin, // 必须是站点根：静态托管没有子路径回退
    })
    setBusy(false)
    if (error) return toast.error(errorMessage(error, '微信登录不可用'))
    if (data?.url) location.assign(data.url)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="page-title" style={{ marginBottom: 16 }}>
          博主登录
        </h1>

        <div className="auth-tabs">
          <button className={tab === 'password' ? 'active' : ''} onClick={() => setTab('password')}>
            密码登录
          </button>
          <button className={tab === 'otp' ? 'active' : ''} onClick={() => setTab('otp')}>
            验证码 / 注册
          </button>
          <button className={tab === 'reset' ? 'active' : ''} onClick={() => setTab('reset')}>
            找回密码
          </button>
        </div>

        {notice ? <div className="alert info">{notice}</div> : null}

        {tab === 'password' ? (
          <form onSubmit={submitPassword}>
            <div className="field">
              <label>邮箱</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label>密码</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="登录密码"
                autoComplete="current-password"
              />
            </div>
            <button className="btn primary" style={{ width: '100%' }} disabled={busy}>
              {busy ? '处理中…' : '登录'}
            </button>
          </form>
        ) : null}

        {tab === 'otp' ? (
          <form onSubmit={submitOtp}>
            <div className="field">
              <label>邮箱</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label>验证码</label>
              <div className="code-row">
                <input
                  className="input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="邮件中的验证码"
                />
                <button
                  type="button"
                  className="btn"
                  onClick={sendCode}
                  disabled={busy || countdown > 0}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </button>
              </div>
            </div>
            {pendingOtp && !pendingOtp.isExistingUser ? (
              <div className="field">
                <label>设置密码（新用户）</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少 6 位"
                />
              </div>
            ) : null}
            <button className="btn primary" style={{ width: '100%' }} disabled={busy}>
              {busy ? '处理中…' : '登录 / 注册'}
            </button>
          </form>
        ) : null}

        {tab === 'reset' ? (
          <form onSubmit={submitReset}>
            <div className="field">
              <label>邮箱</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="code-row" style={{ marginBottom: 16 }}>
              <input
                className="input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="重置验证码"
              />
              <button type="button" className="btn" onClick={sendReset} disabled={busy}>
                发送
              </button>
            </div>
            <div className="field">
              <label>新密码</label>
              <input
                className="input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="至少 6 位"
              />
            </div>
            <button className="btn primary" style={{ width: '100%' }} disabled={busy}>
              重置密码
            </button>
          </form>
        ) : null}

        <div className="divider">或使用第三方登录</div>
        <button className="btn" style={{ width: '100%' }} onClick={wechatLogin} disabled={busy}>
          微信扫码登录
        </button>
        <p className="hint" style={{ marginTop: 10 }}>
          微信登录需站点已发布到正式 HTTPS 域名，本地预览不可用；若未开启会提示「未打开微信登录」。
        </p>
      </div>
    </div>
  )
}
