import { render } from './Vnode.js'

export function patch(oldVnode, newVnode, container) {
  if (!oldVnode) {
    // 新节点，直接渲染
    mount(newVnode, container)
    return
  }
  if (oldVnode.tag !== newVnode.tag) {
    const anchor = oldVnode.el.nextSibling // 记录旧元素的下一个兄弟节点
    // 元素类型不同，直接替换
    container.removeChild(oldVnode.el) // 先删除旧元素
    // 再渲染新元素
    mount(newVnode, container, anchor)
    return
  } else {

  }
}

// 创建元素节点,不挂载
function createElement(vnode) {
  const {tag, props, children} = vnode // 解构赋值
  const el = document.createElement(tag)
  vnode.el = el
  if (props) {
    // 处理属性
    el.setAttribute('class', props.class)
  }
  if (children) {
    // 处理子节点
    handleChildren(children, el)
  }
 
  return el
}
// anchor 插入点,默认挂载到容器末尾
function mount(vnode, container, anchor = null) {
  const el = createElement(vnode)
  if (anchor) {
    container.insertBefore(el, anchor)
  } else {
    container.appendChild(el)
  }
}

/**
 * 1. 字符串：创建文本节点 document.createTextNode(children)                                                             
 * 2. VNode 对象：递归调用 render                                                                                        
 * 3. 数组：遍历处理每一项
 */
function handleChildren (children, element) {
  //  1. 字符串：创建文本节点 document.createTextNode(children)  
  if (typeof children === "string") {
    const textNode = document.createTextNode(children)
    element.appendChild(textNode)
  } else if (Array.isArray(children)) {
    // 3. 数组：遍历处理每一项
    // 递归调用 handleChildren 处理每个子项
       children.forEach(child => {
        handleChildren(child, element)
      })
  } else {
    // 2. VNode 对象：递归调用 render                                                                                        
    render(children, element)
  }
} 