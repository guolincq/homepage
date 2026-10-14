import { createWorkBuddyCloud } from '@tencent-ai/workbuddy-cloud-sdk'

/**
 * publicConfig 由 workbuddy_cloud_service 激活后返回，是唯一允许写进前端的配置。
 * endpoint 必须来自这里，不可硬编码其它域名，也不可从 location / 环境变量推导。
 */
export const publicConfig = {
  resourceId: 'wbcs_J5UfLnr2TuPYEvQvdNummW',
  endpoint: 'https://personal-blog-91222.app.workbuddy.host',
  oauthRelayBaseUrl: 'https://www.workbuddy.cn/v2/as/genie-baas/oauth',
  publishableKey: 'wbpk_uDOwiIXjOH2UKaG5u6MefY_E2OTRJia9jPEW79hjblhWcq9XR726uWw',
}

export const cloud = createWorkBuddyCloud({
  endpoint: publicConfig.endpoint,
  oauthRelayBaseUrl: publicConfig.oauthRelayBaseUrl,
  publishableKey: publicConfig.publishableKey,
})

/** 统一解包：有 error 就抛，方便调用处用 try/catch 聚合成用户可见提示。 */
export function unwrap(result, fallback = null) {
  if (!result) return fallback
  if (result.error) throw result.error
  return result.data ?? fallback
}

export function errorMessage(error, fallback = '请求失败，请稍后重试') {
  if (!error) return fallback
  const code = error.code || error.kind
  if (code === '42501' || code === 'permission-denied') return '没有权限执行该操作，请确认已登录'
  if (code === '23505') return '已存在相同记录（标题别名重复）'
  if (code === '42P01') return '数据表尚未初始化，请联系站长'
  if (code === 'network' || code === 'backend-unavailable') return '网络异常，请检查网络后重试'
  return error.message || fallback
}
