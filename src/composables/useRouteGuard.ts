import type { Router } from 'vue-router/auto'

export function useRouteGuard(router: Router) {
  const { start, done } = useNProgress()
  router.beforeEach((to, from, next) => {
    const { token, logged, refreshed } = useAppStore()
    const { refresh } = useLogin()
    const requireAuth = to.meta.requireAuth
    const path = to.path
    const toLogin = path === '/login'
    if (requireAuth) {
      if (token && logged) {
        if (toLogin) {
          return next(from.path)
        }
        if (refreshed) {
          return next()
        }
        return refresh({ token }).then(() => {
          next()
        }).catch(() => {
          next(`/login?redirect=${to.path}`)
        })
      }
      else {
        if (toLogin) {
          return next()
        }
        return next(`/login?redirect=${to.path}`)
      }
    }
    else {
      return next()
    }
    start()
  })
  router.afterEach((to, from) => {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    to.meta.transition = toDepth < fromDepth ? 'slide-right' : toDepth > fromDepth ? 'slide-left' : 'fade'

    useChangeTitle(to)
    done()
  })
}
