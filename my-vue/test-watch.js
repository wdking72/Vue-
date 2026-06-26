import { effect } from "./mini-reactive.js"
import { reactive } from "./mini-reactive.js"
import watch from "./watch.js"

// 测试 watch
const state = reactive({ count: 0 })

console.log("=== 测试1: 基本 watch ===")
watch(
  () => state.count,
  (newVal, oldVal) => {
    console.log(`count 变化了: ${oldVal} -> ${newVal}`)
  }
)

console.log("--- 修改 count ---")
state.count = 1  // 应该输出: count 变化了: 0 -> 1

console.log("--- 再次修改 count ---")
state.count = 2  // 应该输出: count 变化了: 1 -> 2

console.log("\n=== 测试2: immediate watch ===")
const state2 = reactive({ name: "Vue" })

watch(
  () => state2.name,
  (newVal, oldVal) => {
    console.log(`name 变化了: ${oldVal} -> ${newVal}`)
  },
  { immediate: true }  // 应该立即执行一次: name 变化了: undefined -> Vue
)

console.log("--- 修改 name ---")
state2.name = "React"  // 应该输出: name 变化了: Vue -> React

console.log("\n=== 测试3: deep watch ===")
const state3 = reactive({ obj: { a: 1, b: { c: 2 } } })

watch(
  () => state3.obj,
  (newVal, oldVal) => {
    console.log(`obj 变化了`, newVal)
  },
  { deep: true }
)

console.log("--- 修改内部属性 ---")
state3.obj.a = 10        // 应该触发: obj 变化了
state3.obj.b.c = 20      // 应该触发: obj 变化了

console.log("\n=== 测试4: 没有 deep，修改内部属性不触发 ===")
const state4 = reactive({ obj: { a: 1 } })

watch(
  () => state4.obj,
  (newVal, oldVal) => {
    console.log(`obj 变化了（不应该触发）`)
  }
)

console.log("--- 修改内部属性（没有 deep）---")
state4.obj.a = 10        // 不应该触发
console.log("没有输出说明 deep 功能正常！")
