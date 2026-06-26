import { effect } from "./mini-reactive.js";
export default function watch(source, callback, {immediate = false, deep = false} = {}) {
  let oldVal = update(source)

  effect(() => {
    if (deep) {
      // 深度遍历对象，触发所有属性的依赖更新
      traverse(update(source))
    } else {
    // 触发依赖更新
      update(source)
    }
  }, {scheduler: () => {
    let newVal = update(source)
    callback(newVal, oldVal)
    oldVal = newVal // 更新旧值
  }})

    // 立即执行一次回调函数
  if (immediate) {
    callback(oldVal, undefined)
  }

}
// 调用source函数获取最新值，或直接返回source值，触发依赖更新
function update(source) {
  return typeof source === "function" ? source() : source
}
const visited = new Set()
function traverse (obj) {
  if (typeof obj !== "object" || obj === null) {
    return 
  }
  // 标记当前对象为已访问，避免重复遍历
  visited.add(obj)
  for (let key in obj) {
    // 如果当前属性不存在依赖，创建一个空 Set 存储依赖，避免重复遍历
    if (!visited.has(obj[key])) {
      traverse(obj[key])
    }
  }
  return obj
}