import { effect } from './mini-reactive.js'

function computed(getter) {
  let value // 用于记录缓存
  let dirty = true // 用于记录是否需要重新计算
  effect(() => {
    value = getter() // 计算新的值
    dirty = false // 标记为已计算
  }, { 
    scheduler: () => {
      dirty = true // 标记为需要重新计算
  } })

  return {
    get value() {
      if (dirty) {
        value = getter() // 计算新的值
        dirty = false // 标记为已计算
        return value
      }
      return value
    }
  }
}