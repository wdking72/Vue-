let currentEffect = null // 当前正在执行的 effect 函数

export function effect(fn, { scheduler } = {}) {
  currentEffect = fn
  fn.scheduler = scheduler // 存储调度函数  
  fn()
  currentEffect = null // 执行完成后，将 currentEffect 重置为 null
} 

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
      if (currentEffect) {
        // 如果当前属性不存在依赖，创建一个空 Set 存储依赖
        if (!depMap.has(key)) {
          depMap.set(key, new Set())
        }
        depMap.get(key).add(currentEffect)
      }
      const value = target[key]
      if (typeof value === "object" && value !== null) {
        // 如果属性值是对象，递归调用 reactive 函数
        return reactive(value) // 递归处理属性值
      }
      return value
    },
    // 拦截属性设置操作
    set(target, key, newVal) {
      target[key] = newVal
      // 触发依赖更新
      if (depMap.has(key)) {
        depMap.get(key).forEach(fn => {
          if (fn.scheduler) {
            fn.scheduler() // 调用调度函数
          } else {
            fn()
          }
        })
      }
      return true // 返回 true 表示设置成功
    }
  })
  proxyCache.set(obj, proxy) // 缓存代理对象
  return proxy
}