import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { cloud } from './cloud'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      // 微信网页登录回调：URL 带 code 时完成登录，无 code 时返回 null（普通访问）。
      try {
        const callback = await cloud.auth.handleWechatWebCallback()
        if (callback?.data) {
          // state 一次性，必须立刻清掉 code/state，否则刷新会用掉过的 code 报错
          history.replaceState(null, '', location.pathname + location.hash)
        }
      } catch {
        /* 非回调场景，忽略 */
      }
      try {
        const { data } = await cloud.auth.getSession()
        if (mounted) setSession(data ?? null)
      } catch {
        if (mounted) setSession(null)
      }
      if (mounted) setReady(true)
    })()

    const unsubscribe = cloud.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null)
    })
    return () => {
      mounted = false
      unsubscribe?.()
    }
  }, [])

  const signOut = useCallback(async () => {
    await cloud.auth.signOut()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthed: Boolean(session?.user),
      ready,
      signOut,
    }),
    [session, ready, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用')
  return ctx
}
