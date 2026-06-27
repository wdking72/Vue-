import { reactive } from './mini-reactive.js'
import { track, trigger, effect } from './tools.js'

export default function ref(rawVal) {
  const depMap = new Map() // 依赖存储器
  let val = rawVal // 存储原始值
  // 处理对象类型值
  if ( rawVal instanceof Object) {
    // 如果是对象，需要递归响应式处理
    val = reactive(rawVal)
  } else {
    val = rawVal
  }
  return {
    // 用_value自定义key
    get value() {
      // 触发依赖收集
      track(depMap, '_value')
      return val
    },
    set value(newVal) {
      val = newVal
      // 触发依赖更新
      trigger(depMap, '_value')
      return true // 返回 true 表示设置成功
    }
  }
}


// 测试 ref
  const count = ref(0)

  effect(() => {
    console.log('count.value:', count.value)
  })

  count.value = 1  // 应该触发 effect 执行
  count.value = 2  // 应该再次触发

// 测试 ref 包裹对象
  const state = ref({ name: 'Vue', version: 3 })

  effect(() => {
    console.log('state.value.name:', state.value.name)
  })

  state.value.name = 'React'  // 修改属性，会触发吗？
  state.value = { name: 'Angular', version: 2 }  // 替换整个对象，会触发吗？
// 测试 双层响应式
const refState = ref({ name: 'Vue', count: 0 })                                                                       
                                                                                                                        
  effect(() => {                                                                                                        
    console.log('只监听 name:', refState.value.name)                                                                    
  })                                                                                                                    
                                                                                                                        
  refState.value.count = 999  // 会触发吗？