let currentEffect = null // 当前正在执行的 effect 函数

function effect(fn) {
  currentEffect = fn
  fn()
  currentEffect = null // 执行完成后，将 currentEffect 重置为 null
} 

function reactive(obj) {
  const depMap = new Map() // 依赖存储器
  return new Proxy(obj, {
    get(target, key) {
      if (currentEffect) {
        // 如果当前属性不存在依赖，创建一个空 Set 存储依赖
        if (!depMap.has(key)) {
          depMap.set(key, new Set())
        }
        depMap.get(key).add(currentEffect)
      }
      return target[key]
    },
    set(target, key, newVal) {
      target[key] = newVal
      // 触发依赖更新
      if (depMap.has(key)) {
        depMap.get(key).forEach(fn => {
          fn()
        })
      }
      return true // 返回 true 表示设置成功
    }
  })
}