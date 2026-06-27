# 2026-06-21 阶段2（续）：computed 与 scheduler 机制

## 今天学了什么

- effect 的 scheduler 机制：依赖变了不立即执行，而是执行自定义逻辑
- computed 的实现原理：惰性计算 + 缓存（dirty 标记）
- 手写了迷你 computed，与 Vue 源码做了对比

## 关键代码片段

### 迷你 effect（支持 scheduler）

```javascript
function effect(fn, { scheduler } = {}) {
  currentEffect = fn
  fn.scheduler = scheduler
  fn()
  currentEffect = null
}

// set 触发时
if (fn.scheduler) {
  fn.scheduler()  // 有 scheduler 就调 scheduler
} else {
  fn()            // 没有就直接执行 effect
}
```

### 迷你 computed

```javascript
function computed(getter) {
  let value
  let dirty = true

  effect(() => {
    value = getter()
    dirty = false
  }, {
    scheduler: () => {
      dirty = true  // 依赖变了，只标记脏，不重新计算
    }
  })

  return {
    get value() {
      if (dirty) {
        value = getter()
        dirty = false
      }
      return value
    }
  }
}
```

### Vue 源码对比

| 概念 | 我们写的 | Vue 的实现 |
|------|---------|-----------|
| dirty 标记 | `let dirty = true` | `flags: EffectFlags.DIRTY` |
| 依赖变化通知 | scheduler 设 dirty | `notify()` 设 DIRTY + batch |
| 读取时计算 | `if (dirty) getter()` | `refreshComputed(this)` |

## 踩坑记录

1. `{ scheduler } = {}` 解构参数要给默认空对象，否则不传参会报错
2. scheduler 默认值不能是 `() => {}`（空函数），否则 effect 永远不会重新执行
3. computed 的 `get value()` 里计算后要设 `dirty = false`，否则缓存不生效

## 面试话术

> "computed 的核心是惰性计算和缓存。它内部用 effect 监听 getter，但依赖变化时不立即重新计算，而是通过 scheduler 把 dirty 标记设为 true。只有当读取 .value 且 dirty 为 true 时才重新计算，否则返回缓存值。这种设计避免了不必要的重复计算。"

## 下一步计划

- 学习 watch 的实现原理
- 理解 watch 如何基于 effect 实现
