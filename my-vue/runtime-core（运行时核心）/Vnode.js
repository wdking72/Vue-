import { patch } from './patch.js'

// 创建虚拟节点
export function h (tag, props, children = null) {
  return {
    tag,
    props,
    children
  }
}

export function render (vnode, container) {
  // 挂载或更新节点
  patch(container._vnode || null, vnode, container)
  // 更新容器的_vnode属性
  container._vnode = vnode
}
