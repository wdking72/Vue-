let currentEffect = null // 当前正在执行的 effect 函数

export function effect(fn, { scheduler } = {}) {
  currentEffect = fn
  fn.scheduler = scheduler // 存储调度函数  
  fn()
  currentEffect = null // 执行完成后，将 currentEffect 重置为 null
} 

// track 依赖收集
export function track(depMap, key) {
  if (currentEffect) {
        // 如果当前属性不存在依赖，创建一个空 Set 存储依赖
    if (!depMap.has(key)) {
      depMap.set(key, new Set())
    }
    depMap.get(key).add(currentEffect)
  }
}

// trigger 触发依赖更新
export function trigger(depMap, key) {
  if (depMap.has(key)) {
    depMap.get(key).forEach(fn => {
      // 如果有调度器，调用调度器；否则直接调用依赖函数
      if (fn.scheduler) {
        fn.scheduler() // 调用调度函数
      } else {
        fn()
      }
    })
  }
}