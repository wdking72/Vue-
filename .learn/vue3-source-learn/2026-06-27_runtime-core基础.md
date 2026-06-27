# 2026-06-27 runtime-core 基础：VNode、render、patch

## 今天学了什么

- VNode 的本质：用 JS 对象描述 DOM 结构
- render 函数的职责：调用 patch，保存旧节点
- patch 函数的核心逻辑：初次挂载 vs 类型替换
- anchor 参数：保持节点替换后的位置
- Vue 3 的设计：createElement 和 mount 分离

## 核心代码

### h 函数 - 创建 VNode

```javascript
export function h(tag, props, children = null) {
  return {
    tag,
    props,
    children
  }
}
```

### render 函数 - 入口

```javascript
export function render(vnode, container) {
  // 调用 patch，对比新旧节点
  patch(container._vnode || null, vnode, container)
  // 保存当前节点，下次更新用
  container._vnode = vnode
}
```

### patch 函数 - 分发器

```javascript
export function patch(oldVnode, newVnode, container) {
  if (!oldVnode) {
    // 初次挂载
    mount(newVnode, container)
    return
  }
  if (oldVnode.tag !== newVnode.tag) {
    // 类型不同，替换
    const anchor = oldVnode.el.nextSibling
    container.removeChild(oldVnode.el)
    mount(newVnode, container, anchor)
    return
  }
  // 类型相同，更新（待实现）
  // patchElement(oldVnode, newVnode, container)
}
```

### mount 函数 - 挂载

```javascript
export function mount(vnode, container, anchor = null) {
  const el = createElement(vnode)
  if (anchor) {
    container.insertBefore(el, anchor)
  } else {
    container.appendChild(el)
  }
}
```

### createElement 函数 - 创建 DOM

```javascript
export function createElement(vnode) {
  const { tag, props, children } = vnode
  const el = document.createElement(tag)
  vnode.el = el  // 保存 DOM 引用

  if (props) {
    el.setAttribute('class', props.class)
  }
  if (children) {
    handleChildren(children, el)
  }
  return el
}
```

## 关键理解

### 架构设计

```
h(tag, props, children)  →  创建 VNode
        ↓
render(vnode, container)  →  入口，调用 patch
        ↓
patch(prevVNode, vnode, container)  →  分发
        ├── prevVNode = null → mount()
        └── tag 不同 → removeChild + mount(anchor)
        ↓
mount(vnode, container, anchor)  →  createElement + 插入容器
        ↓
createElement(vnode)  →  创建 DOM + 处理 props/children
```

### anchor 的作用

```javascript
// anchor = null → 插入到末尾
container.appendChild(el)

// anchor = DOM 节点 → 插入到该节点前面
container.insertBefore(el, anchor)
```

**用途**：替换节点时保持位置不变

```javascript
// 记录旧节点的下一个兄弟作为 anchor
const anchor = oldEl.nextSibling
// 移除旧节点
container.removeChild(oldEl)
// 插入新节点到 anchor 前面（原位置）
container.insertBefore(newEl, anchor)
```

### container._vnode 的作用

```javascript
// 第一次渲染
render(vnode1, app)
// app._vnode = vnode1

// 第二次渲染（更新）
render(vnode2, app)
// patch(vnode1, vnode2, app) → 对比新旧
```

**本质**：在容器上保存上一次的 VNode，实现新旧对比

### createElement vs mount 分离

| 函数 | 职责 | 何时使用 |
|------|------|---------|
| createElement | 只创建 DOM | 需要 DOM 但不立即挂载 |
| mount | 创建 + 插入容器 | 初次挂载 |

**好处**：类型替换时，先 createElement 创建新 DOM，再 insertBefore 插入原位置

## 和 Vue 3 源码对比

| 方面 | 我们的实现 | Vue 3 |
|------|-----------|-------|
| VNode 结构 | `{ tag, props, children, el }` | 更丰富：type, shapeFlag, patchFlag... |
| render | 调用 patch | 调用 patch |
| patch | 处理 null 和类型不同 | processElement/processComponent/processText |
| mount | createElement + insert | mountElement + hostInsert |
| 旧节点保存 | `container._vnode` | `container._vnode` ✅ 一致 |

## 待学习内容

- [ ] patchElement：同类型节点更新
- [ ] patchProps：对比更新属性
- [ ] patchChildren：对比更新子节点（diff 算法）
- [ ] 组件系统：processComponent

## 面试话术

> "Vue 3 的渲染器核心是 patch 函数。render 是入口，内部调用 patch 对比新旧 VNode。如果旧节点为空就 mount 挂载，类型不同就替换，类型相同就 patchElement 更新。替换时用 anchor 记录位置，保证 DOM 顺序不变。旧节点保存在 container._vnode 上，实现新旧对比。"

## 文件位置

- h + render：`my-vue/runtime-core（运行时核心）/Vnode.js`
- patch + mount + createElement：`my-vue/runtime-core（运行时核心）/patch.js`
- 测试文件：`test/test-patch.html`
