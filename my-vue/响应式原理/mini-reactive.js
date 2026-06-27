import { track, trigger } from './tools.js'





const proxyCache = new WeakMap() // 代理对象存储器

export function reactive(obj) {
  // 如果对象已经是代理对象，直接返回
  if (proxyCache.has(obj)) {
    return proxyCache.get(obj)
  }
  const depMap = new Map() // 依赖存储器
  const proxy = new Proxy(obj, {
    // 拦截属性访问操作
    get(target, key) {
      // 触发依赖收集
      track(depMap, key)
      const value = target[key]
      if (typeof value === "object" && value !== null) {
        // 如果属性值是对象，递归调用 reactive 函数
        return reactive(value) // 递归处理属性值
      }
      return value
    },
    // 拦截属性设置操作
    set(target, key, newVal) {
      target[key] = newVal // 先设置属性值，再触发依赖更新
      // 触发依赖更新
      trigger(depMap, key)
      return true // 返回 true 表示设置成功
    }
  })
  proxyCache.set(obj, proxy) // 缓存代理对象
  return proxy
}

